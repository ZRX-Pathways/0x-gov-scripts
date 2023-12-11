import { ethers } from "hardhat";
import { tokenTransfer } from "../../lib/erc-20/token-transfer";
import { SHA_OPERATED_POOL, TREASURY, ZRX } from "../../lib/constants";
import { submitProposal } from "../../lib/0x-treasury/submit-proposal";

async function main() {
  const receiver = "0x080f08076e8EAdC66006C3CbFEd28a34918A1fA6";
  const grantAmount = ethers.utils.parseEther("63308");
  const description = `# Z-11 GRANT PROPOSAL: RigoBlock to Build Batch Multiplex Feature (pZEIP-2)

  ## Summary 
  
  This proposal seeks authorization of a $25k grant from the treasury to RigoBlock as a participant in the ZRX Pathways initiative, which aims to enable core protocol improvements by providing a better experience for core protocol contributors. 
  
  The community has discussed the merits of the proposal in the governance forum and signaled support for moving forward to an onchain vote: 
  
  https://snapshot.org/#/0xgov.eth/proposal/0xc62f5528ad411184c35b0c4b015c545c349799d7b72f54483b272c29384cba96
  
  ## Grant Details
  
  **Amount:** $25k in $ZRX
  
  **Price reference:** $ZRX 30-day EMA as of 12/11/2023 = $0.394898 (https://www.tradingview.com/symbols/ZRXUSD/technicals/?exchange=COINBASE)
  
  **Receiving address:** 0x080f08076e8EAdC66006C3CbFEd28a34918A1fA6
  
  ## Proposal Details 
  
  See detailed explanation at https://forum.0xprotocol.org/t/grant-request-pzeip-2-batch-multiplex-feature-rigoblock/3739
  
  ## Action Required 
  
  Send 63,308 $ZRX to 0x080f08076e8EAdC66006C3CbFEd28a34918A1fA6`;
  
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
