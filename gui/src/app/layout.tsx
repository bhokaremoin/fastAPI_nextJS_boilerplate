import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Providers} from '@/app/providers';
import Navbar from "@/components/Navbar";
import {GlobalProvider} from "@/context/Global";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Todo App",
    description: "Todo App - changes pl",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Providers>
            <GlobalProvider>
                <Navbar/>{children}
            </GlobalProvider>
        </Providers></body>
        </html>
    );
}
