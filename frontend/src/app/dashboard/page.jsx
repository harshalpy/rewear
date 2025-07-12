"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditProfileModal from "@/components/editprofile";

export default function UserDashboard() {
    const [user, setUser] = useState(null);
    const [myListings, setMyListings] = useState([]);
    const [myPurchases, setMyPurchases] = useState([]);
    const [showEdit, setShowEdit] = useState(false);

    const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (!userId) return;

        const fetchDashboardData = async () => {
            try {
                const [userRes, listingsRes, purchasesRes] = await Promise.all([
                    axios.get(`http://localhost:4000/api/users/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    axios.get(`http://localhost:4000/api/products?user=${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    axios.get(`http://localhost:4000/api/swaps?requester_id=${userId}&status=completed`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                ]);

                setUser(userRes.data.user);
                setMyListings(listingsRes.data.products);
                setMyPurchases(purchasesRes.data.swaps || []);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, [userId]);

    return (
        <div className="min-h-screen px-6 py-10 bg-background text-foreground">
            <h1 className="text-4xl font-bold mb-8">User Dashboard</h1>

            <div className="flex flex-col md:flex-row items-center gap-6 bg-muted p-6 rounded-xl shadow mb-12">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border">
                    <Image
                        src={user?.profile_image || "/avatar.jpg"}
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex-1 space-y-1">
                    <h2 className="text-2xl font-semibold">{user?.name}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <p className="text-sm text-muted-foreground">Points: {user?.points}</p>
                </div>

                <Button variant="outline" onClick={() => setShowEdit(true)}>Edit Profile</Button>
                <EditProfileModal user={user} open={showEdit} onClose={() => setShowEdit(false)} onUpdate={setUser} />
            </div>

            <section className="mb-12">
                <h3 className="text-2xl font-semibold mb-4">My Listings</h3>
                {myListings.length === 0 ? (
                    <p className="text-muted-foreground">No items listed yet.</p>
                ) : (
                    <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-muted rounded-xl">
                        {myListings.map((product) => (
                            <Card
                                key={product._id}
                                className="min-w-[12rem] w-48 flex-shrink-0 rounded-xl bg-white dark:bg-muted shadow"
                            >
                                <div className="relative aspect-square w-full">
                                    <Image
                                        src={product.images?.[0] || "/placeholder.jpg"}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-4 space-y-1">
                                    <h4 className="font-medium truncate">{product.title}</h4>
                                    <p className="text-sm text-muted-foreground">{product.category}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{product.status}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>


            <section className="mb-12">
                <h3 className="text-2xl font-semibold mb-4">My Purchases</h3>
                {myListings.length === 0 ? (
                    <p className="text-muted-foreground">No purchases yet.</p>
                ) : (
                    <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-muted rounded-xl">
                        {myPurchases.map((product) => (
                            <Card
                                key={product._id}
                                className="min-w-[12rem] w-48 flex-shrink-0 rounded-xl bg-white dark:bg-muted shadow"
                            >
                                <div className="relative aspect-square w-full">
                                    <Image
                                        src={swap.item_requested?.images?.[0] || "/placeholder.jpg"}
                                        alt={swap.item_requested?.title || "Product"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-4 space-y-1">
                                    <h4 className="font-medium truncate">{swap.item_requested?.title}</h4>
                                    <p className="text-sm text-muted-foreground">{swap.item_requested?.category}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
