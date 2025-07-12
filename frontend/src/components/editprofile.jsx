"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";

export default function EditProfileModal({ user, open, onClose, onUpdate }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(user?.profile_image || "");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            if (selectedFile) {
                formData.append("profile_image", selectedFile);
            }

            const res = await axios.patch(
                `http://localhost:4000/api/users/${user._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            onUpdate(res.data.user);
            onClose();
        } catch (err) {
            console.error("Failed to update profile", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                            <Image src={preview || "/placeholder.jpg"} alt="Avatar" fill className="object-cover" />
                        </div>
                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Updating..." : "Save Changes"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
