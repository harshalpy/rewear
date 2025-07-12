import Link from "next/link";

export default function NavBar() {
    return (
        <header className="w-full px-6 py-4 border-b border-muted flex justify-between items-center">
            <h1 className="text-2xl font-bold">ReWear</h1>
            <nav className="flex gap-4 items-center">
                <Link href="/" className="text-sm font-medium hover:underline">
                    Home
                </Link>
                <Link href="/login" className="text-sm font-medium hover:underline">
                    Login
                </Link>
                <Link href="/signup" className="text-sm font-medium hover:underline">
                    Sign Up
                </Link>
            </nav>
        </header>
    )
}