"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { handleSwapInit } from "@/utils/handleswap";

export default function SwapHandler({ itemRequestedId, ownerId, open, onClose, onSuccess }) {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);

    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        const fetchUserItems = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/products?user=${userId}&status=available`);
                setItems(res.data.products || []);
            } catch (err) {
                console.error("Failed to load user items", err);
            }
        };

        if (open && userId) fetchUserItems();
    }, [open, userId]);

    const handleSubmit = async () => {
        try {
            const res = await handleSwapInit({
                token,
                itemRequested: itemRequestedId,
                offeredItem: selectedItem,
                isPointSwap: true,
            });

            if (res?.data) {
                alert("Bought Successfully!");
                window.location.href = "/dashboard";
            }
            else {
                alert(res.message || "Something went wrong during the swap.");
            }
        }
        catch (err) {
            console.error("Swap error:", err);
            alert("Something went wrong during the swap.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select an Item to Offer</DialogTitle>
                </DialogHeader>

                {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No available items to offer.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => setSelectedItem(item._id)}
                                className={`cursor-pointer border p-2 rounded-md ${selectedItem === item._id ? "border-purple-500" : "border-gray-300"
                                    }`}
                            >
                                <img
                                    src={item.images?.[0] || "/placeholder.jpg"}
                                    alt={item.title}
                                    className="h-24 w-full object-cover rounded"
                                />
                                <p className="text-sm mt-1 truncate">{item.title}</p>
                            </div>
                        ))}
                    </div>
                )}

                <Button onClick={handleSubmit} disabled={loading || !selectedItem} className="mt-4 w-full">
                    {loading ? "Sending..." : "Send Swap Request"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}