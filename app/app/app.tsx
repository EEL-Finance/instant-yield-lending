"use client";

/* ------------------------- Imports ------------------------- */
// Frontend
import { useEffect, useState } from "react";
// Web3
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "./lib/idl/instant_yield_lending.json";
import { InstantYieldLending } from "./lib/types/instant_yield_lending";


/* ------------------------ Variables ------------------------ */
const PROGRAM_ID = new PublicKey("E53aBtof6YzCWAXpCgXsJDhskma11NBLEgTFFvJDzzHv");


/* ------------------------ Components ----------------------- */
export default function App() {
    const [treasury] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("iyl-treasury")], PROGRAM_ID);
    console.log("Treasury account:", treasury.toBase58());

    const [program, setProgram] = useState<anchor.Program<InstantYieldLending>>();

    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    // Setup provider and program
    useEffect(() => {
        if (!wallet) { return }
        console.log("Wallet:", wallet.publicKey.toBase58());

        let provider: anchor.Provider;
        try {
            provider = anchor.getProvider()
          } catch {
            provider = new anchor.AnchorProvider(connection, wallet, {})
            anchor.setProvider(provider)
          }
        
          const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID) as unknown as anchor.Program<InstantYieldLending>; // If only there was a better way to do this
          setProgram(program)

          console.log("Program:", program);
    }, [wallet])

    async function onClickInit() {
        if (!wallet || !program) { 
            console.log("Program not initialised")
            return;
        }

        const tx = await program.methods.initializeTreasury()
            .accounts({ treasury })
            .rpc();

        console.log(tx);
    }

    async function onClickDirectDeposit() {
        if (!wallet || !program ) { 
            console.log("Program not initialised")
            return;
        }

        const tx = await program.methods.fillTreasury()
            .accounts({
                treasury, payer: wallet.publicKey
            })
            .rpc();

        console.log("Deposit tx hash:", tx);

        let balance = await anchor.getProvider().connection.getBalance(treasury);
		console.log("Balance: ", balance);
    }

    return (
        <div className="h-full v-full p-5 flex flex-col gap-5">
            <button onClick={onClickInit}>Initialise Treasury</button>
            <button onClick={onClickDirectDeposit}>Deposit to Treasury</button>
        </div>
    )
}