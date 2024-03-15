use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use anchor_lang::system_program::*;
use anchor_lang::prelude::*;

declare_id!("7kB1Hkaq6CVoB4C2pMoKws2ijMEL6Uh5HEP5aJnSUP2W");

#[program]
pub mod instant_yield_lending {
	use anchor_lang::system_program;

	use super::*;

	pub fn initialize_treasury(ctx: Context<InitTreasury>) -> Result<()> {
		ctx.accounts.treasury.bump = ctx.bumps.treasury;

		Ok(())
	}

	pub fn treasury_direct_deposit(ctx: Context<DirectDepositTreasury>, sol: u64) -> Result<()> {
		let cpi_ctx = CpiContext::new(
			ctx.accounts.system_program.to_account_info(), 
			system_program::Transfer {
				from: ctx.accounts.payer.to_account_info().clone(),
				to: ctx.accounts.treasury.to_account_info().clone(),
			}
		);

		system_program::transfer(cpi_ctx, LAMPORTS_PER_SOL * sol)?;

		Ok(())
	}

	pub fn initialize_escrow(ctx: Context<InitEscrow>, sol: u64) -> Result<()> {
		ctx.accounts.escrow.bump = ctx.bumps.escrow;

		// Send lamports lender -> escrow
		let cpi_ctx = CpiContext::new(
			ctx.accounts.system_program.to_account_info(),
			system_program::Transfer {
				from: ctx.accounts.lender.to_account_info().clone(),
				to: ctx.accounts.escrow.to_account_info().clone(),
			}
		);

		system_program::transfer(cpi_ctx, LAMPORTS_PER_SOL * sol)?;

		Ok(())
	}
}

#[account]
pub struct Treasury {
	bump: u8,
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
	signer: Signer<'info>,
	system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DirectDepositTreasury<'info> {
	#[account(
		mut,
		seeds = [b"iyl-treasury"],
		bump = treasury.bump
	)]
	pub treasury: Account<'info, Treasury>,

	#[account(mut)]
	payer: Signer<'info>,
	system_program: Program<'info, System>,
}

#[account]
// Escrow transfer structure

// Escrow -> lending protocol
// Treasury -> lender
// Lending protocol -> escrow
// - commission -> treasury
// --- Transaction filled ---
// Escrow -> lender

pub struct Escrow {
	bump: u8,
	// provided lamports
	// target lamports
	// creation date
}

#[derive(Accounts)]
pub struct InitEscrow<'info> {
	#[account(
		init,
		seeds = [b"iyl-escrow", lender.key().as_ref()],
		bump,
		payer = lender,
		space = 8 + 1,
	)]
	pub escrow: Account<'info, Escrow>,

	#[account(mut)]
	lender: Signer<'info>,
	system_program: Program<'info, System>,
}