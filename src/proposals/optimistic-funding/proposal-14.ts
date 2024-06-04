import { ethers } from "hardhat";
import { tokenTransfer } from "../../lib/erc-20/token-transfer";
import { SHA_OPERATED_POOL, TREASURY, ZRX } from "../../lib/constants";
import { submitProposal } from "../../lib/0x-treasury/submit-proposal";

async function main() {
  const receiver = "0xc6784343E4e2eDA2b785B78994c33734Aa4A09fe";
  const grantAmount = ethers.utils.parseEther("471993");
  const description = `# Z-14 Optimistic Funding for 0x Improvement Proposals

  ## Summary 
  
  This proposal seeks authorization to move $250k from the ZRX Treasury to a Safe to support more predictable funding for pZEIPs as part of the ZRX Pathways initiative, which aims to enable core protocol improvements by providing a better experience for core protocol contributors. 
  
  The community has discussed the merits of the proposal in the governance forum and signaled support for moving forward to an onchain vote: 
  
  https://snapshot.org/#/0xgov.eth/proposal/0xfbedd5050bbd2a7b68f4e5ab581f01512d3d4d03b870db3a80ff7a9e7db7c105
  
  ## Details
  
  **Amount:** $250k in $ZRX
  
  **Price reference:** $ZRX 30-day EMA as of 06/04/2024 =  $0.529669  (https://www.tradingview.com/symbols/ZRXUSD/technicals/?exchange=COINBASE)
  
  **Receiving address:** 0xc6784343E4e2eDA2b785B78994c33734Aa4A09fe
  
  ## Proposal Details 
  
  See detailed explanation at https://forum.0xprotocol.org/t/grant-request-optimistic-funding-for-0x-improvement-proposals-zrx-pathways-experiment-2/3798
  
  ## Action Required 
  
  Send 471,993 $ZRX to 0xc6784343E4e2eDA2b785B78994c33734Aa4A09fe`;
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
