"use client";

/* ------------------------- Imports ------------------------- */
// Frontend
import { useEffect, useState, useReducer } from "react";
import Container from '../components/Container'
import Card from '../components/Card';
// Web3
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
// Helpers
import { getCurrentAPR } from "../utils/SolendAPI";
import * as constant from "../utils/constants.json"

import { InstantYieldLending } from "../lib/types/instant_yield_lending";
import idl from "../lib/idl/instant_yield_lending.json";


/* ------------------------ Variables ------------------------ */
const PROGRAM_ID = new web3.PublicKey("7kB1Hkaq6CVoB4C2pMoKws2ijMEL6Uh5HEP5aJnSUP2W")

// Solend (devnet)
const SOLEND_PROGRAM_ID = "ALend7Ketfx5bxh6ghsCDXAoDrhvEmsXT3cynB6aPLgx";
const LENDING_MARKET_MAIN = "GvjoVKNjBvQcFaSKUW1gTE7DxhSpjHbE69umVR5nPuQp";
const RESERVE_ACCOUNT_ID = "BgxfHJDzm44T7XG68MYKx7YisTjZu73tVovyZSjJMpmw"; // USDC
const OBLIGATION_LEN = 1300;

/* ------------------------ Components ----------------------- */
export default function App() {
    // web3
    const [program, setProgram] = useState<anchor.Program<InstantYieldLending>>()
    const [treasury] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("iyl-treasury")], new web3.PublicKey(constant.PROGRAM_ID))
    const [currentAPR, setCurrentAPR] = useState("Loading...")

    // frontend
    const [hasPosition, setHasPosition] = useState(false);
    const [showStakeAndReceive, setStakeAndReceive] = useState(false);

    // position
    const [lendAmount, setLendAmount] = useState();
    const [stakeAmount, setStakeAmount] = useState();
    const [desiredAmount, setDesiredAmount] = useState();
    const [esimatedLockup, setEstimatedLockup] = useState("Loading...");
    const [withdrawAmount, setWithdrawAmount] = useState();

    // constants
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

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
		const program = new anchor.Program(idl as anchor.Idl, constant.PROGRAM_ID) as unknown as anchor.Program<InstantYieldLending> // Haven't found a better way to use the program types
		setProgram(program)

        // const fetchAPR = async () => {
        //     setCurrentAPR(await getCurrentAPR());
        // };
        // fetchAPR();
    }, [wallet, connection])


	async function createEscrow() {
		if (!wallet || !program) {
			console.log("Program not initialised")
			return
		}

		const [escrow] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("iyl-escrow"), wallet.publicKey.toBytes()], new web3.PublicKey(constant.PROGRAM_ID)); // TODO: extract to stateful var

		const tx = await program.methods.initializeEscrow(new anchor.BN(1))
			.accounts({ escrow, lender: wallet.publicKey })
			.rpc();

		console.log("Escrow init tx hash:", tx);

		let balance = await anchor.getProvider().connection.getBalance(escrow);
		console.log("Escrow balance:", balance);
	}

    async function getCurrentAPR() {
        const apiUrl = `https://api.solend.fi/v1/reserves/historical-interest-rates?ids=${RESERVE_ACCOUNT_ID}&span=1w`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
    
            const historicalRates = data?.[RESERVE_ACCOUNT_ID];
            const supplyAPR = historicalRates[historicalRates.length - 1].supplyAPR;
            const supplyAPRPercentage = supplyAPR * 100;
            setCurrentAPR(supplyAPRPercentage.toFixed(2));
        } catch (error) {
            console.error('Error fetching data from Solend API:', error);
            throw error;
        }

    async function lendTokensSolend(): Promise<void> {
        try {
            console.log("Fuck this shit")
        } catch (error) {
          console.error('Error supplying tokens to Solend:', error);
          throw error;
        }
      }

    async function withdrawTokensSolend() {
        console.log("Withdraw");
    }

    function estimateLockup() {
        console.log("Estimate lockup. Stake: ", stakeAmount, " Desired: ", desiredAmount)
        setEstimatedLockup("6");
        setStakeAndReceive(true);
    }

    function stakeAndReceive() {
        console.log("Stake and receive")
    }

    function unlockCapital() {
        console.log("Unlock capital.")
    }

    const handleLendChange = (event: any) => {
        const value = event.target.value;
        setLendAmount(value);
    };

    const handleStakeChange = (event: any) => {
        const value = event.target.value;
        setStakeAmount(value);
    };

    const handleDesiredChange = (event: any) => {
        const value = event.target.value;
        setDesiredAmount(value);
    };

    const handleWithdrawChange = (event: any) => {
        const value = event.target.value;
        setWithdrawAmount(value);
    };

    return (
        <div className="h-full v-full p-5 flex flex-col items-start gap-5">
            {!hasPosition ? (
                <Container>
                    <div className='grid gap-4 md:grid-cols-2 mt-16'>
                        <div className='col-span-2 grid gap-4'>
                        </div>

                        <div className="col-span-2 grid gap-4">
                            <Card>
                                <div className='flex gap-4 justify-around flex-wrap mb-4'>
                                    <div>
                                        <p className='text-sm text-slate-400 font-medium mb-1'>Current supply APR on <a href="https://solend.fi/" className="text-blue-500 hover:underline">Orca</a>: </p>
                                        <h1 className='text-2xl font-bold'> {currentAPR}% </h1>
                                    </div>
                                    <div>
                                        <p className='text-sm text-slate-400 font-medium mb-1'>Underlying protocol address: </p>
                                        <h1 className='text-2xl font-bold'> <a href="https://explorer.solana.com/address/4UpD2fh7xH3VP9QQaXtsS1YY3bxzWhtfpks7FatyKvdY" className="text-blue-500 hover:underline">4UpD2fh7xH3VP9QQaXtsS1YY3bxzWhtfpks7FatyKvdY</a></h1>
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <h1 className='text-2xl font-bold mb-4'>Lend on Orca</h1>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='flex col-span-2 flex-col'>
                                        <label htmlFor="endTime" className='block mb-1 text-sm font-medium text-gray-900 dark:text-white'>Enter amount of USDC to lend</label>
                                        <input
                                            name='lend_amount' placeholder="Lend amount" type="text" className="bg-gray-50 border border-bg-d text-gray-900 text-sm rounded-lg focus:ring-ac-2 focus:border-ac-2 block w-full p-2.5 dark:bg-gray-700 dark:border-ac-3 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ac-2 dark:focus:border-ac-2"
                                            value={lendAmount}
                                            onChange={handleLendChange}
                                        />
                                    </div>
                                    <button onClick={lendTokensSolend} type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Lend</button>
                                </div>
                            </Card >
                            <Card>
                                <h1 className='text-2xl font-bold mb-4'>Open Position</h1>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='flex col-span-2 flex-col'>
                                        <label htmlFor="endTime" className='block mb-1 text-sm font-medium text-gray-900 dark:text-white'>Enter amount of cTokens to stake</label>
                                        <input
                                            name='stake_amount' placeholder="Stake amount" type="text" className="bg-gray-50 border border-bg-d text-gray-900 text-sm rounded-lg focus:ring-ac-2 focus:border-ac-2 block w-full p-2.5 dark:bg-gray-700 dark:border-ac-3 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ac-2 dark:focus:border-ac-2"
                                            value={stakeAmount}
                                            onChange={handleStakeChange}
                                        />
                                    </div>
                                    <div className='flex grid-cols-1 flex-col relative'>
                                        <label htmlFor="endTime" className='block mb-1 text-sm font-medium text-gray-900 dark:text-white'>Enter desired amount</label>
                                        <input
                                            name='desired_amount' placeholder="Desired amount" type="text" className="bg-gray-50 border border-bg-d text-gray-900 text-sm rounded-lg focus:ring-ac-2 focus:border-ac-2 block w-full p-2.5 dark:bg-gray-700 dark:border-ac-3 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ac-2 dark:focus:border-ac-2"
                                            value={desiredAmount}
                                            onChange={handleDesiredChange}
                                        />
                                    </div>
                                    <button onClick={estimateLockup} type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Estimate Lockup Period</button>
                                </div>
                                {showStakeAndReceive ? (
                                    <div className='grid grid-cols-2 gap-2 mt-8'>
                                        <h1 className='text-xl col-span-2 font-bold'><span className='text-m font-normal relative text-border-bg-d'>Estimated lockup period: </span>{esimatedLockup} months</h1>
                                        <button onClick={stakeAndReceive} type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Stake & Receive</button>
                                    </div>
                                    ) : 
                                    <div></div>
                                }
                            </Card >
                        </div>
                        <div className='col-span-2'>
                        </div>
                    </div>
                </Container>
            ) : (
                <Container>
                    <div className='grid gap-4 md:grid-cols-2 mt-16'>
                        <div className='col-span-2 grid gap-4'>
                        </div>

                        <div className="col-span-2 grid gap-4">
                            <Card>
                                <div className='flex gap-4 justify-around flex-wrap mb-4'>
                                    <div>
                                        <p className='text-sm text-slate-400 font-medium mb-1'>Current APR: </p>
                                        <h1 className='text-2xl font-bold'> {currentAPR}% </h1>
                                    </div>
                                    <div>
                                        <p className='text-sm text-slate-400 font-medium mb-1'>Staked amount: </p>
                                        <h1 className='text-2xl font-bold'> $100 </h1>
                                    </div>
                                    <div>
                                        <p className='text-sm text-slate-400 font-medium mb-1'>Received amount: </p>
                                        <h1 className='text-2xl font-bold'> $10 </h1>
                                    </div>
                                    <div>
                                        <p className='text-sm text-slate-400 font-medium mb-1'>Lockup left: </p>
                                        <h1 className='text-2xl font-bold'> 10 days </h1>
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div className='grid grid-cols-2 gap-2'>
                                    <button onClick={unlockCapital} type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Unlock capital</button>
                                </div>
                            </Card >
                            <Card>
                                <h1 className='text-2xl font-bold mb-4'>Withdraw on Orca</h1>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='flex col-span-2 flex-col'>
                                        <label htmlFor="endTime" className='block mb-1 text-sm font-medium text-gray-900 dark:text-white'>Enter amount of cTokens to withdraw</label>
                                        <input
                                            name='withdraw_amount' placeholder="Withdraw amount" type="text" className="bg-gray-50 border border-bg-d text-gray-900 text-sm rounded-lg focus:ring-ac-2 focus:border-ac-2 block w-full p-2.5 dark:bg-gray-700 dark:border-ac-3 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ac-2 dark:focus:border-ac-2"
                                            value={withdrawAmount}
                                            onChange={handleWithdrawChange}
                                        />
                                    </div>
                                    <button onClick={withdrawTokensSolend} type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Withdraw</button>
                                </div>
                            </Card >
                        </div>
                        <div className='col-span-2'>
                        </div>
                    </div>
                </Container>
            )}
        </div>
	)
}}