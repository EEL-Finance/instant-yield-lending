"use client";

/* ------------------------- Imports ------------------------- */
// Frontend
import { useEffect, useState } from "react";
// Web3
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { InstantYieldLending } from "./lib/types/instant_yield_lending";
import idl from "./lib/idl/instant_yield_lending.json";


/* ------------------------ Variables ------------------------ */
const PROGRAM_ID = new PublicKey("7kB1Hkaq6CVoB4C2pMoKws2ijMEL6Uh5HEP5aJnSUP2W")


/* ------------------------ Components ----------------------- */
export default function App() {
    const [program, setProgram] = useState<anchor.Program<InstantYieldLending>>()
    
    const { connection } = useConnection()
    const wallet = useAnchorWallet()
    
    const [treasury] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("iyl-treasury")], PROGRAM_ID)

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

    }, [wallet])

    async function onClickDirectDeposit() {
        if (!wallet || !program) {
            console.log("Program not initialised")
            return
        }

        const tx = await program.methods.treasuryDirectDeposit(new anchor.BN(5)) // TODO: replace '5' with input
            .accounts({
                treasury, payer: wallet.publicKey
            })
            .rpc()

        console.log("Deposit tx hash:", tx)

        let balance = await anchor.getProvider().connection.getBalance(treasury)
        console.log("Balance: ", balance)
    }

    async function createEscrow() {
        if (!wallet || !program) {
            console.log("Program not initialised")
            return
        }

        const [escrow] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("iyl-escrow"), wallet.publicKey.toBytes()], PROGRAM_ID); // TODO: extract to stateful var

        const tx = await program.methods.initializeEscrow(new anchor.BN(1))
            .accounts({ escrow, lender: wallet.publicKey })
            .rpc();

        console.log("Escrow init tx hash:", tx);

        let balance = await anchor.getProvider().connection.getBalance(escrow);
        console.log("Escrow balance:", balance);
    }

    return (
        <div className="h-full v-full p-5 flex flex-col items-start gap-5">
            {/* <button onClick={onClickInit}>Initialise Treasury</button> */}
            <button onClick={onClickDirectDeposit}>Deposit to Treasury</button>
            <button onClick={createEscrow}>Create Escrow</button>
            <br/>
            <div className="bg-bg-d h-96 w-64 text-ac-1 flex flex-col items-center gap-5">
                <h1 className="font-semibold text-lg">Escrow Status</h1>
                <p>Initialized: {"false"}</p>
                <p>Input: {"#"} lamports</p>
            </div>
        </div>
    )
}