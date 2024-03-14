"use client";

/* ------------------------- Imports ------------------------- */
// Frontend
import dynamic from "next/dynamic";
import "./styles.css";
// Web3
import { useAnchorWallet } from "@solana/wallet-adapter-react";


/* ------------------------ Variables ------------------------ */
// This fixes the hydration error that is created by <WalletMultiButton />
const WalletMultiButton = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
)


/* ------------------------ Components ----------------------- */
export default function Header() {
    return (
        <header className="h-20 w-full bg-bg-d flex flex-row items-center gap-8 px-5 text-ac-1">
            <h1 className="font-bold text-3xl">EEL Finance</h1>
            <WalletMultiButton />
        </header>
    )
}