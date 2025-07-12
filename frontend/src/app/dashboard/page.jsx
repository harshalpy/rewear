"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditProfileModal from "@/components/editprofile";
import Link from "next/link";

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
                <Button variant="destructive" onClick={() => window.location.href = "/listing"}>Listing</Button>
                <Button variant="destructive" onClick={() => {
                    localStorage.removeItem("userId");
                    localStorage.removeItem("token");
                    window.location.href = "/";
                }}>Logout</Button>
                {user?.is_admin && <Button  variant="destructive" href="/panel" className="text-sm">Admin Panel</Button>}
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
                                className="min-w-[15rem] w-48 flex-shrink-0 rounded-xl bg-white dark:bg-muted shadow"
                            >
                                <div className="relative aspect-square w-full">
                                    <Image
                                        src={product.images?.[0] || "/placeholder.jpg"}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-4 space-y-2">
                                    <h4 className="font-medium truncate">{product.title}</h4>

                                    <div className="flex flex-wrap gap-2">
                                        {product.category && (
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-[#EEE2DE] text-[#5C3D2E] capitalize">
                                                {product.category}
                                            </span>
                                        )}
                                        {product.size && (
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-[#E6F4F1] text-[#1B4D3E] uppercase">
                                                {product.size}
                                            </span>
                                        )}
                                        {product.condition && (
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-[#FFF3CD] text-[#7C5700] capitalize">
                                                {product.condition}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        <span
                                            className={`px-2 py-0.5 text-xs rounded-full capitalize ${product.status === "available"
                                                    ? "bg-green-100 text-green-700"
                                                    : product.status === "inreview"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {product.status}
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 text-xs rounded-full ${product.approved
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {product.approved ? "Approved" : "Pending"}
                                        </span>
                                    </div>

                                    <Link href={`/product/${product._id}`} passHref>
                                        <Button variant="outline" className="mt-2 w-full">
                                            View Product
                                        </Button>
                                    </Link>
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
                        {myPurchases.map((swap) => (
                            <Card
                                key={swap._id}
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
