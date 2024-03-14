"use client";

import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// require("./wallet-multi-button.module.css");
import "./styles.css";

import { useAnchorWallet } from "@solana/wallet-adapter-react";


export default function Header() {
    function click() {

    }

    return (
        <header className="h-20 w-full bg-bg-d flex flex-row items-center gap-8 px-5 text-ac-1">
            <h1 className="font-bold text-3xl">EEL Finance</h1>
            {/* <button className="font-semibold text-xl ml-auto" onClick={click}>Connect Wallet</button> */}
            <WalletMultiButton></WalletMultiButton>
        </header>
    )
}