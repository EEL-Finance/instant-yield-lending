"use client";

/* ------------------------- Imports ------------------------- */
// Frontend
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "./styles.css";
import Link from 'next/link';
// Web3
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { InstantYieldLending } from "../lib/types/instant_yield_lending";
import idl from "../lib/idl/instant_yield_lending.json";


/* ------------------------ Variables ------------------------ */
const PROGRAM_ID = new PublicKey("7kB1Hkaq6CVoB4C2pMoKws2ijMEL6Uh5HEP5aJnSUP2W")

// This fixes the hydration error that is created by <WalletMultiButton />
const WalletMultiButton = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
)


/* ------------------------ Components ----------------------- */
export default function Header() {
    const [treasury] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("iyl-treasury")], PROGRAM_ID)
    console.log("Treasury account:", treasury.toBase58())

    const [program, setProgram] = useState<anchor.Program<InstantYieldLending>>()

    const { connection } = useConnection()
    const wallet = useAnchorWallet()

    // Setup provider and program
    useEffect(() => {
        if (!wallet) { return }
        console.log("Wallet:", wallet.publicKey.toBase58())

        let provider: anchor.Provider
        try {
            provider = anchor.getProvider()
        } catch {
            provider = new anchor.AnchorProvider(connection, wallet, {})
            anchor.setProvider(provider)
        }

        const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID) as unknown as anchor.Program<InstantYieldLending> // Haven't found a better way to use the program types
        setProgram(program)

        console.log("Program:", program)
    }, [wallet])

    // TODO: Disable button when program is initialized
    async function onClickInit() {
        if (!wallet || !program) {
            console.log("Program not initialised")
            return;
        }

        const tx = await program.methods.initializeTreasury()
            .accounts({ treasury })
            .rpc()

        console.log(tx)
    }

    return (
        <header className="h-20 w-full bg-bg-d flex flex-row items-center gap-8 px-5 text-ac-1">
            <Link href="/"><h1 className="font-bold text-3xl">EEL Finance</h1></Link>
            <button onClick={onClickInit} className="text-md font-semibold rounded-md border-2 border-bg-d ml-auto bg-ac-1 h-12 px-3 text-bg-d">Initialise Treasury</button>
            <WalletMultiButton />
        </header>
    )
}