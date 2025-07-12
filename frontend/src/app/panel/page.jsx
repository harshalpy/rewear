"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [toast, setToast] = useState({ show: false, msg: "", success: true });

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const showToast = (msg, success = true) => {
        setToast({ show: true, msg, success });
        setTimeout(() => setToast({ show: false, msg: "", success: true }), 3000);
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/admin/products", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data.products || []);
            setError("");
        }
        catch (err) {
            console.error("Error fetching products", err);
            if (err.response?.status === 403) {
                setError("You do not have permission to view this page (Admin access required).");
            }
            else {
                setError("Failed to load products.");
            }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:4000/api/admin/products/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showToast("Product approved ✔️", true);
            setProducts((prev) => prev.filter((p) => p._id !== id));
        }
        catch (err) {
            console.error(err);
            showToast("Approval failed", false);
        }
    };

    const handleReject = async (id) => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        try {
            await axios.post(
                `http://localhost:4000/api/admin/products/${id}/reject`,
                { reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showToast("Product rejected ❌", true);
            setProducts((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            console.error(err);
            showToast("Rejection failed", false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="p-6 bg-red-100 text-red-800 border border-red-300 rounded-lg max-w-md text-center">
                    <p className="font-semibold">Access Denied</p>
                    <p className="text-sm mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {toast.show && (
                <div
                    className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-sm text-white z-50 transition-opacity ${toast.success ? "bg-green-600" : "bg-red-600"}`}
                >
                    {toast.msg}
                </div>
            )}

            {products.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No products to review</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <Card key={product._id} className="overflow-hidden rounded-xl shadow bg-white dark:bg-muted">
                            <Image
                                src={product.images?.[0] || "/placeholder.jpg"}
                                alt={product.title}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <CardContent className="space-y-2 p-4">
                                <h4 className="text-lg font-semibold truncate" title={product.title}>{product.title}</h4>
                                <div className="text-sm text-muted-foreground capitalize">
                                    {product.category} • {product.size} • {product.condition}
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <Button size="sm" onClick={() => handleApprove(product._id)}>Approve</Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleReject(product._id)}>Reject</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}