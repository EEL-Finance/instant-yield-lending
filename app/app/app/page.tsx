"use client";

/* ------------------------- Imports ------------------------- */
// Frontend
import { useEffect, useState, Fragment } from "react";
import Container from '../components/Container'
import Card from '../components/Card';
import WalletContextWrapper from "../components/walletContextWrapper";
import Header from "../components/header";
import Footer from "../components/footer";
// Web3
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { InstantYieldLending } from "../lib/types/instant_yield_lending";
import idl from "../lib/idl/instant_yield_lending.json";


/* ------------------------ Variables ------------------------ */
const PROGRAM_ID = new PublicKey("7kB1Hkaq6CVoB4C2pMoKws2ijMEL6Uh5HEP5aJnSUP2W")


/* ------------------------ Components ----------------------- */
export default function App() {
    const [program, setProgram] = useState<anchor.Program<InstantYieldLending>>()
    const [amount, setAmount] = useState('')
    
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

    function submit() {
        console.log("Submitted")
    }

    return (
      <WalletContextWrapper>
      <div className="h-screen flex flex-col justify-between">
        <Header />
          <div className="h-full v-full p-5 flex flex-col items-start gap-5">
              {/* <button onClick={onClickInit}>Initialise Treasury</button> */}
              {/* <button onClick={onClickDirectDeposit}>Deposit to Treasury</button>
              <button onClick={createEscrow}>Create Escrow</button>
              <br/>
              <div className="bg-bg-d h-96 w-64 text-ac-1 flex flex-col items-center gap-5">
                  <h1 className="font-semibold text-lg">Escrow Status</h1>
                  <p>Initialized: {"false"}</p>
                  <p>Input: {"#"} lamports</p>
              </div> */}

          <Container>
              <div className='grid gap-4 md:grid-cols-2 mt-16'>
                  <div className='col-span-2 grid gap-4'>
                  </div>

                  <div className="col-span-2 grid gap-4">
                  <Card>
                      <div className='flex gap-4 justify-around flex-wrap mb-4'>
                      <div>
                          <p className='text-sm text-slate-400 font-medium mb-1'>Current APY: </p>
                          <h1 className='text-2xl font-bold'> 20% </h1>
                      </div>
                      <div>
                          <p className='text-sm text-slate-400 font-medium mb-1'>Underlying protocol address: </p>
                          <h1 className='text-2xl font-bold'> ALendwrgiewriw </h1>
                      </div>
                      </div>
                  </Card>
                  <Card>
                      <h1 className='text-2xl font-bold mb-4'>Open Position</h1>
                      <form onSubmit={submit} className='grid grid-cols-2 gap-3'>
                          <div className='flex col-span-2 flex-col'>
                              <label htmlFor="endTime" className='block mb-1 text-sm font-medium text-gray-900 dark:text-white'>Enter amount to stake</label>
                              <input name='receiver_address' placeholder="Stake amount" type="text" className="bg-gray-50 border border-bg-d text-gray-900 text-sm rounded-lg focus:ring-ac-2 focus:border-ac-2 block w-full p-2.5 dark:bg-gray-700 dark:border-ac-3 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ac-2 dark:focus:border-ac-2"/>
                          </div>
                          <div className='flex grid-cols-1 flex-col relative'>
                              <label htmlFor="endTime" className='block mb-1 text-sm font-medium text-gray-900 dark:text-white'>Enter desired amount</label>
                              <input name='receiver_address' placeholder="Desired amount" type="text" className="bg-gray-50 border border-bg-d text-gray-900 text-sm rounded-lg focus:ring-ac-2 focus:border-ac-2 block w-full p-2.5 dark:bg-gray-700 dark:border-ac-3 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ac-2 dark:focus:border-ac-2"/>
                          </div>
                          <button type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Estimate Lockup Period</button>
                      </form>
                      <form onSubmit={submit} className='grid grid-cols-2 gap-2 mt-8'>
                          <h1 className='text-xl col-span-2 font-bold'><span className='text-m font-normal relative text-border-bg-d'>Estimated lockup period: </span>3 months</h1>
                          <button type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Stake & Receive</button>
                      </form>
                  </Card >
                  </div>
                  <div className='col-span-2'>
                  </div>
              </div>
          </Container>

          </div>
        <Footer />
      </div>
    </WalletContextWrapper>
    )
}