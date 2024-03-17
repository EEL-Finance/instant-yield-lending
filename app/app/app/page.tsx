"use client";

/* ------------------------- Imports ------------------------- */
// Frontend
import { useEffect, useState } from "react";
import WalletContextWrapper from "../components/WalletContextWrapper";
import Container from '../components/Container'
import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from '../components/Card';
// Web3
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { InstantYieldLending } from "../lib/types/instant_yield_lending";
import idl from "../lib/idl/instant_yield_lending.json";


/* ------------------------ Variables ------------------------ */
const PROGRAM_ID = new PublicKey("7kB1Hkaq6CVoB4C2pMoKws2ijMEL6Uh5HEP5aJnSUP2W")
// Solend 
const SOLEND_PROGRAM_ID = "So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo";
const LENDING_MARKET_MAIN = "4UpD2fh7xH3VP9QQaXtsS1YY3bxzWhtfpks7FatyKvdY";
const OBLIGATION_LEN = 1300;

/* ------------------------ Components ----------------------- */
export default function App() {
	const [program, setProgram] = useState<anchor.Program<InstantYieldLending>>()
	const [amount, setAmount] = useState('')

	const { connection } = useConnection()
	const wallet = useAnchorWallet()

    // admin
    const [program, setProgram] = useState<anchor.Program<InstantYieldLending>>()
    const [treasury] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("iyl-treasury")], PROGRAM_ID)

    // frontend
    const { connection } = useConnection()
    const wallet = useAnchorWallet()
    const [hasPosition, setHasPosition] = useState(false);

    // position
    const [lendAmount, setLendAmount] = useState();
    const [stakeAmount, setStakeAmount] = useState();
    const [desiredAmount, setDesiredAmount] = useState();
    const [esimatedLockup, setEstimatedLockup] = useState("...");


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

        if (false) { // Check if user has opened a position
            setHasPosition(true);
        }

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

    async function lendTokens() { // Solend integration
        console.log("Connection: ", connection) // Connection is underfined
        try {
            const accounts = await connection.getProgramAccounts(
                new PublicKey(SOLEND_PROGRAM_ID),
                {
                    commitment: connection.commitment,
                    filters: [
                        {
                            memcmp: {
                                offset: 10,
                                bytes: LENDING_MARKET_MAIN,
                            },
                        },
                        {
                            dataSize: OBLIGATION_LEN,
                        },
                    ],
                    encoding: "base64",
                }
            );
            console.log("Number of users:", accounts.length);
            console.log(accounts)
        } catch(err) {
            console.error(err)
        }
    }

    function estimateLockup() {
        console.log("Estimate lockup. Stake: ", stakeAmount, " Desired: ", desiredAmount)
        setEstimatedLockup("6");
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

    return (
        <WalletContextWrapper>
            <div className="h-screen flex flex-col justify-between">
                <Header />
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
                                        <h1 className='text-2xl font-bold mb-4'>Lend on Solend</h1>
                                        <div className='grid grid-cols-2 gap-3'>
                                            <div className='flex col-span-2 flex-col'>
                                                <label htmlFor="endTime" className='block mb-1 text-sm font-medium text-gray-900 dark:text-white'>Enter amount of USDC to lend</label>
                                                <input
                                                    name='lend_amount' placeholder="Lend amount" type="text" className="bg-gray-50 border border-bg-d text-gray-900 text-sm rounded-lg focus:ring-ac-2 focus:border-ac-2 block w-full p-2.5 dark:bg-gray-700 dark:border-ac-3 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ac-2 dark:focus:border-ac-2"
                                                    value={lendAmount}
                                                    onChange={handleLendChange}
                                                />
                                            </div>
                                            <button onClick={lendTokens} type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Lend</button>
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
                                        <div className='grid grid-cols-2 gap-2 mt-8'>
                                            <h1 className='text-xl col-span-2 font-bold'><span className='text-m font-normal relative text-border-bg-d'>Estimated lockup period: </span>{esimatedLockup} months</h1>
                                            <button onClick={stakeAndReceive} type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Stake & Receive</button>
                                        </div>
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
                                                <p className='text-sm text-slate-400 font-medium mb-1'>Current APY: </p>
                                                <h1 className='text-2xl font-bold'> 20% </h1>
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
                                </div>
                                <div className='col-span-2'>
                                </div>
                            </div>
                        </Container>
                    )}

				</div>
				<Footer />
			</div>
		</WalletContextWrapper>
	)
}