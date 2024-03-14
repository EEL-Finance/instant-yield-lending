"use client";

/* ------------------------- Imports ------------------------- */
// Frontend
import { useEffect, useState } from "react";
// Web3
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import * as solana from "@solana/web3.js";
// import idl from "./lib/idl/instant_yield_lending.json";
import { getProvider } from "@project-serum/anchor";


/* ------------------------ Variables ------------------------ */
// const PROGRAM_ID = new solana.PublicKey(idl.metadata.address);

async function LoadProgram() {
    const programId = new solana.PublicKey('ALend7Ketfx5bxh6ghsCDXAoDrhvEmsXT3cynB6aPLgx'); // Lending Program
    console.log(anchor.getProvider());
    const idl = await anchor.Program.fetchIdl(programId, anchor.getProvider());
    console.log(idl); // outputs null for some reason
    if (idl) {
        const program = new anchor.Program(idl, programId, anchor.getProvider());
        // Interact with the contract
      } else {
        console.error("IDL is null, unable to proceed.");
      }
}

/* ------------------------ Components ----------------------- */
export default function App() {
    // const [program, setProgram] = useState<anchor.Program<anchor.Idl>>();

    const connection = new solana.Connection(solana.clusterApiUrl('devnet'))
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
        
          // const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID)
          // setProgram(program)

          //console.log("Program:", program);
    }, [wallet])

    const lendBtn = () => {
        LoadProgram();
    }

    return (
        <div className="h-full v-full p-5">
            <button onClick={lendBtn}>Initialise Treasury</button>
        </div>
    )
}