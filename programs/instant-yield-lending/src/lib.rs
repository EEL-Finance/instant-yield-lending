use anchor_lang::prelude::*;

declare_id!("CnT49JjxnPx4KE7FtLLG1GxzfoRvjPa4pvwupQZ2AWo6");

#[program]
pub mod instant_yield_lending {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
