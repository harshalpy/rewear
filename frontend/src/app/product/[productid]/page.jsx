"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { handleSwapInit } from "@/utils/handleswap";
import SwapHandler from "@/components/swaphandler";

export default function ProductPage() {
    const { productid } = useParams();
    const [product, setProduct] = useState(null);
    const [showSwap, setShowSwap] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/products/${productid}`);
                if (!res.ok) throw new Error("API failed");

                const data = await res.json();
                setProduct(data.product);
            } catch (err) {
                console.warn("Using fallback product:", err);
                setProduct({
                    title: "Floral Summer Dress",
                    description: "Beautiful floral dress perfect for summer days.",
                    size: "S",
                    condition: "used",
                    images: [
                        "https://picsum.photos/seed/dress1/500",
                        "https://picsum.photos/seed/dress2/500",
                        "https://picsum.photos/seed/dress3/500",
                        "https://picsum.photos/seed/dress4/500",
                    ],
                });
            }
        };

        if (productid) fetchProduct();
    }, [productid]);

    if (!product) return <div className="text-center text-white">Loading...</div>;

    const handleLogin = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
        }
    };
    return (
        <div className="max-w-6xl mx-auto px-4 py-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="rounded-lg overflow-hidden shadow-md">
                    <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-[400px] object-cover"
                    />
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-purple-300">{product.title}</h1>
                    <p className="text-sm text-gray-400">Size: {product.size}</p>
                    <p className="text-sm text-gray-400 capitalize">Condition: {product.condition}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {product.description || "No description available."}
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <button onClick={() => {
                            handleLogin()
                            setShowSwap(true);
                        }} className="w-full sm:w-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition shadow-sm hover:shadow-md">
                            🔁 Swap Now
                        </button>
                        <SwapHandler
                            itemRequestedId={product._id}
                            ownerId={product.user_id}
                            open={showSwap}
                            onClose={() => setShowSwap(false)}
                            onSuccess={(swap) => {
                                console.log("Swap created:", swap);
                                window.location.href = "/dashboard";
                            }}
                        />
                        <button
                            onClick={async () => {
                                const token = localStorage.getItem("token");
                                if (!token) {
                                    return window.location.href = "/login";
                                }

                                try {
                                    const res = await handleSwapInit({
                                        token,
                                        itemRequested: productid,
                                        isPointSwap: true,
                                    });

                                    console.log(res);
                                    if (res?.data) {
                                        alert("Bought Successfully!");
                                        window.location.href = "/dashboard";
                                    }
                                    else {
                                        alert(res.message||"Something went wrong during the swap.");
                                    }
                                }
                                catch (err) {
                                    console.error("Swap error:", err);
                                    alert("Something went wrong during the swap.");
                                }
                            }}
                            className="w-full sm:w-auto px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition shadow-sm hover:shadow-md"
                        >
                            💰 Buy using Points
                        </button>

                    </div>

                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-lg text-purple-400 mb-3">Product Images</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {product.images.map((img, index) => (
                        <div key={index} className="rounded-lg overflow-hidden shadow-sm border border-purple-900/20">
                            <img src={img} alt={`Product ${index}`} className="w-full h-36 object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}