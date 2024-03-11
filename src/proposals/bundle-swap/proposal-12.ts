import { ethers } from "hardhat";
import { tokenTransfer } from "../../lib/erc-20/token-transfer";
import { SHA_OPERATED_POOL, TREASURY, ZRX } from "../../lib/constants";
import { submitProposal } from "../../lib/0x-treasury/submit-proposal";

async function main() {
  const receiver = "0x00A3834faEb85840e358ea22D20d6513aa2aD7E7";
  const grantAmount = ethers.utils.parseEther("52774");
  const description = `# Z-12 GRANT PROPOSAL: 31Third to Build BundleSwapFeature (pZEIP-1_m2)

  ## Summary 
  
  This proposal seeks authorization of a $25k grant from the treasury to 31Third as a participant in the ZRX Pathways initiative, which aims to enable core protocol improvements by providing a better experience for core protocol contributors. 
  
  The community has discussed the merits of the proposal in the governance forum and signaled support for moving forward to an onchain vote: 
  
  https://snapshot.org/#/0xgov.eth/proposal/0x73e94c013d19d5eb45a859a95e13acb6db1f0a57196a8c0f81708847b0a9bda8
  
  ## Grant Details
  
  **Amount:** $25k in $ZRX
  
  **Price reference:** $ZRX 30-day EMA as of 03/11/2024 = $0.473719 (https://www.tradingview.com/symbols/ZRXUSD/technicals/?exchange=COINBASE)
  
  **Receiving address:** 0x00A3834faEb85840e358ea22D20d6513aa2aD7E7
  
  ## Proposal Details 
  
  See detailed explanation at https://forum.0xprotocol.org/t/grant-request-pzeip-1-m2-bundleswapfeature-31third/3776
  
  ## Action Required 
  
  Send 52,774 $ZRX to 0x00A3834faEb85840e358ea22D20d6513aa2aD7E7`;
  const transferCall = await tokenTransfer(ZRX, grantAmount, receiver);

  const tx = await submitProposal(
    TREASURY,
    description,
    [
      {
        target: ZRX,
        data: transferCall,
        value: 0,
      },
    ],
    [SHA_OPERATED_POOL]
  );

  const receipt = await tx.wait();
  console.log(`transaction submitted: ${receipt.transactionHash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
