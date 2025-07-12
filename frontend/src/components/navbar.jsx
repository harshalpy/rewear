"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setToken(token);
    }, [token])
    return (
        <header className="w-full px-6 py-4 border-b border-muted flex justify-between items-center">
            <h1 className="text-2xl font-bold">ReWear</h1>
            <nav className="flex gap-4 items-center">
                <Link href="/" className="text-sm font-medium hover:underline">
                    Home
                </Link>
                {token ? (
                    <Link href="/dashboard" className="text-sm font-medium hover:underline">
                        Dashboard
                    </Link>
                ) : (
                    <Link href="/login" className="text-sm font-medium hover:underline">
                        Login
                    </Link>
                )}
            </nav>
        </header>
    )
}