import { ThemeProvider } from "next-themes";
import "./globals.css";
import NavBar from "@/components/navbar";

export const metadata = {
    title: "ReWear",
    description: "Community Clothing Exchange",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="dark">
                    <NavBar />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}