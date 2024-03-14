import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { InstantYieldLending } from "../target/types/instant_yield_lending";

describe("instant-yield-lending", () => {
	const provider = anchor.AnchorProvider.env();
	anchor.setProvider(provider);

	const program = anchor.workspace.instant_yield_lending as Program<InstantYieldLending>;
	let payer = provider.wallet;

	let [treasury] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("iyl-treasury")], program.programId);

	// before(async () => {

	// })

	it("Initializes", async () => {
		let tx = await program.methods.initializeTreasury()
		.accounts({ treasury })
		.rpc();

		console.log("Initialize tx hash: ", tx);
	})

	it("Fills", async () => {
		let tx = await program.methods.fillTreasury()
			.accounts({ treasury, payer: payer.publicKey })
			.rpc();

		console.log("Fill tx hash: ", tx);

		let balance = await provider.connection.getBalance(treasury);
		console.log("Balance: ", balance);
	})
})
