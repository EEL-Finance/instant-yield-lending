"use client";

/* ------------------------- Imports ------------------------- */
// Frontend
import { useEffect, useState } from "react";
// Web3
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "./lib/idl/instant_yield_lending.json";


/* ------------------------ Variables ------------------------ */
const PROGRAM_ID = new PublicKey(idl.metadata.address);


/* ------------------------ Components ----------------------- */
export default function App() {
    const [program, setProgram] = useState<anchor.Program<anchor.Idl>>();

    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    // Setup provider and program
    useEffect(() => {
        console.log("Wallet:", wallet);
        if (!wallet) { return }


        let provider: anchor.Provider;
        try {
            provider = anchor.getProvider()
          } catch {
            provider = new anchor.AnchorProvider(connection, wallet, {})
            anchor.setProvider(provider)
          }
        
          const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID)
          setProgram(program)

          console.log("Program:", program);
    }, [wallet])

    return (
        <div className="h-full v-full p-5">
            <button>Initialise Treasury</button>
        </div>
    )
}