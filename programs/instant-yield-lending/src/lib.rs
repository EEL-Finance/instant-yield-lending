use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use anchor_lang::system_program::*;
use anchor_lang::prelude::*;

declare_id!("E53aBtof6YzCWAXpCgXsJDhskma11NBLEgTFFvJDzzHv");

#[program]
pub mod instant_yield_lending {
	use anchor_lang::system_program;

	use super::*;

	pub fn initialize_treasury(ctx: Context<InitTreasury>) -> Result<()> {
		ctx.accounts.treasury.bump = ctx.bumps.treasury;

		Ok(())
	}

	pub fn fill_treasury(ctx: Context<FillTreasury>) -> Result<()> {
		let cpi_ctx = CpiContext::new(
			ctx.accounts.system_program.to_account_info(), 
			system_program::Transfer {
				from: ctx.accounts.payer.to_account_info().clone(),
				to: ctx.accounts.treasury.to_account_info().clone(),
			}
		);

		system_program::transfer(cpi_ctx, LAMPORTS_PER_SOL * 5)?;

		Ok(())
	}
}

#[account]
pub struct Treasury {
	bump: u8, // 1
}

#[derive(Accounts)]
pub struct InitTreasury<'info> {
	#[account(
		init, 
		seeds = [b"iyl-treasury"],
		bump,
		payer = signer, 
		space = 8 + 1,
	)]
	pub treasury: Account<'info, Treasury>,
	
	#[account(mut)]
	pub signer: Signer<'info>,
	pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FillTreasury<'info> {
	#[account(
		mut,
		seeds = [b"iyl-treasury"],
		bump = treasury.bump
	)]
	pub treasury: Account<'info, Treasury>,

	#[account(mut)]
	pub payer: Signer<'info>,
	pub system_program: Program<'info, System>,
}