import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata = {
    title: "ReWear",
    description: "Community Clothing Exchange",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            
                <body className={`antialiased`}>
                    <ThemeProvider attribute="class" defaultTheme="dark">
                    {children}
                    </ThemeProvider>
                </body>
        </html>
    );
}