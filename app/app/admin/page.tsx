"use client";

/* ------------------------- Imports ------------------------- */
// Frontend
import { useEffect, useState, Fragment } from "react";
import WalletContextWrapper from "../components/walletContextWrapper";
import Header from "../components/header";
import Footer from "../components/footer";
import Container from "../components/Container";
import Card from "../components/Card";
import Link from 'next/link';
// Web3
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { InstantYieldLending } from "../lib/types/instant_yield_lending";
import idl from "../lib/idl/instant_yield_lending.json";


/* ------------------------ Variables ------------------------ */
const PROGRAM_ID = new PublicKey("7kB1Hkaq6CVoB4C2pMoKws2ijMEL6Uh5HEP5aJnSUP2W")

/* ------------------------ Components ----------------------- */
export default function Main() {
  const [depositTreasury, setDepositTreasury] = useState();
  const handleDepositTreasuryChange = (event: any) => {
    const value = event.target.value;
    setDepositTreasury(value);
  };
  const wallet = useAnchorWallet()
  const [treasury] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("iyl-treasury")], PROGRAM_ID)
  const [program, setProgram] = useState<anchor.Program<InstantYieldLending>>()


  function depositToTreasury() {

  }

    // TODO: Disable button when program is initialized
  async function initializeTreasury() {
      if (!wallet || !program) {
          console.log("Program not initialised")
          return;
      }

      const tx = await program.methods.initializeTreasury()
          .accounts({ treasury })
          .rpc()

      console.log(tx)
  }

  function createEscrow() {

  }

  return (
    <WalletContextWrapper>
      <div className="h-screen flex flex-col justify-between">
        <Header />
        <Container>
          <Card>
            <h1 className='text-2xl font-bold mb-4'>Settings</h1>
            <div className='grid grid-cols-2 gap-3'>
              <div className='flex grid-cols-1 flex-col relative'>
              <button onClick={initializeTreasury} type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Initialize Treasury</button>
                <label htmlFor="endTime" className='block mb-1 text-sm font-medium text-gray-900 dark:text-white'>Deposit to treasury: </label>
                <input
                  name='desired_amount' placeholder="Desired amount" type="text" className="bg-gray-50 border border-bg-d text-gray-900 text-sm rounded-lg focus:ring-ac-2 focus:border-ac-2 block w-full p-2.5 dark:bg-gray-700 dark:border-ac-3 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ac-2 dark:focus:border-ac-2"
                  value={depositTreasury}
                  onChange={handleDepositTreasuryChange}
                />
              </div>
              <button onClick={depositToTreasury} type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Deposit</button>
            </div>
          </Card >
          <Card>
          <button onClick={createEscrow} type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Create Escrow</button>
            <div className="bg-bg-d h-96 w-64 text-ac-1 flex flex-col items-center gap-5">
                  <h1 className="font-semibold text-lg">Escrow Status</h1>
                  <p>Initialized: {"false"}</p>
                  <p>Input: {"#"} lamports</p>
              </div>
          </Card>
        </Container>
        <Footer />
      </div>
    </WalletContextWrapper>
  );
}
