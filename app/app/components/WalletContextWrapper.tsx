"use client";

/* ------------------------- Imports ------------------------- */
// Frontend
import { ReactNode } from "react";
// Web3
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

/* ------------------------ Variables ------------------------ */
export interface WalletContextWrapperProps {
    children: ReactNode
}

const wallets = [
    new PhantomWalletAdapter()
] 
const endpoint = clusterApiUrl("devnet");
// const endpoint = "http://127.0.0.1:8899";

/* ------------------------ Components ----------------------- */
export default function WalletContextWrapper({ children }: WalletContextWrapperProps) {
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
                <WalletModalProvider>
                    { children }
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}