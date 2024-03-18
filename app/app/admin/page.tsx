"use client";

/* ------------------------- Imports ------------------------- */
// Frontend
import { useEffect, useState } from "react";
import Container from "../components/Container";
import Card from "../components/Card";
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
	const [treasury] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("iyl-treasury")], PROGRAM_ID)
	const [balance, setBalance] = useState(0)
	const [depositTreasury, setDepositTreasury] = useState(0)

	const handleDepositTreasuryChange = (event: any) => {
		const value = event.target.value;
		setDepositTreasury(value);
	};

	const { connection } = useConnection();
	const wallet = useAnchorWallet()

	const [program, setProgram] = useState<anchor.Program<InstantYieldLending>>()

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

		getProgramState()
	}, [wallet, connection])

	async function getProgramState() {
		setBalance(await connection.getBalance(treasury))
	}

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

	async function depositToTreasury() {
		if (!wallet || !program) {
			console.log("Program not initialised")
			return
		}

		const tx = await program.methods.treasuryDirectDeposit(new anchor.BN(depositTreasury)) // TODO: replace '5' with input
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
		<Container>
			<Card>
				<h1 className='text-2xl font-bold mb-4'>Settings</h1>
				<div className='grid grid-cols-2 gap-3'>
					<div className='flex grid-cols-1 flex-col relative'>
						<button onClick={initializeTreasury} type="submit" className="whitespace-nowrap col-span-2 text-center font-semibold rounded-md border-1 border-bg-d bg-ac-1 h-9 px-3 text-bg-d">Initialize Treasury</button>
						<h1>Treasury Balance: { balance } lamports</h1>
						<h1>Treasury Balance: { balance / anchor.web3.LAMPORTS_PER_SOL } SOL</h1>
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
	);
}
