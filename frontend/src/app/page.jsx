'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await axios.get('http://localhost:4000/api/products');
                const prod = res.data.products || [];
                setProducts(prod);
                setCategories([...new Set(prod.map(item => item.category))]);
            } catch (err) {
                console.error('Failed to load products from API:', err);
            }
        }

        fetchProducts();
    }, []);

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category === selectedCategory)
        : products;

    return (
        <div>
            <header className="w-full px-6 py-4 border-b border-muted flex justify-between items-center">
                <h1 className="text-2xl font-bold">ReWear</h1>
                <nav className="flex gap-4 items-center">
                    <Link href="/login" className="text-sm font-medium hover:underline">
                        Login
                    </Link>
                    <Link href="/signup" className="text-sm font-medium hover:underline">
                        Sign Up
                    </Link>
                </nav>
            </header>

            <main className="p-6 space-y-16">
                <motion.section
                    className="text-center space-y-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-5xl font-extrabold tracking-tight">ReWear</h2>
                    <p className="mx-auto max-w-xl text-muted-foreground">
                        Swap your unused clothes, earn points, and support sustainable fashion.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Button size="lg">Start Swapping</Button>
                        <Button size="lg" variant="outline">
                            List an Item
                        </Button>
                    </div>
                </motion.section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-semibold">Browse by Category</h2>
                    <div className="flex flex-wrap gap-3">
                        {categories.map(cat => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? 'default' : 'secondary'}
                                className="capitalize px-4 py-2 transition-transform duration-300 hover:-translate-y-0.5 active:scale-95"
                                onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold">
                        {selectedCategory ? `${selectedCategory} Items` : 'Featured Items'}
                    </h2>

                    <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
                        <AnimatePresence>
                            {filteredProducts.slice(0, 12).map(product => (
                                <motion.div
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="group overflow-hidden rounded-xl border border-muted/20 bg-muted/5 shadow-sm transition-all duration-300 transform-gpu hover:scale-[0.98] hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary">
                                        <div className="relative aspect-square w-full">
                                            <Image
                                                src={product?.images?.[0] || '/placeholder.jpg'}
                                                alt={product.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                priority
                                            />
                                        </div>

                                        <CardContent className="p-4 space-y-2">
                                            <h3 className="truncate font-semibold text-lg">{product.title}</h3>
                                            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                                            <p className="text-sm">
                                                Size: <span className="font-medium">{product.size}</span>
                                            </p>
                                            <p className="text-sm">
                                                Condition:{' '}
                                                <span className="capitalize font-medium">{product.condition}</span>
                                            </p>
                                            <div className="flex items-center gap-2 pt-2">
                                                <Image
                                                    src={product.user_id?.profile_image || '/avatar.jpg'}
                                                    alt="User"
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full object-cover"
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    {product?.user_id?.name || 'Unknown'}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </div>
    );
}