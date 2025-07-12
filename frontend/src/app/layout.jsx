import "./globals.css";

export const metadata = {
    title: "ReWear",
    description: "Community Clothing Exchange",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                {children}
            </body>
        </html>
    );
}