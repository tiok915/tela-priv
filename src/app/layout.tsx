import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Privacy | Checkout",
    icons: {
        icon: "/assets/images/logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>): JSX.Element {
    return (
        <html lang="en">
            <body>
                <div id="app">{children}</div>
            </body>
        </html>
    );
}
