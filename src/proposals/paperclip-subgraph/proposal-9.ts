import { ethers } from "hardhat";
import ZrxTreasuryAbi from "../../../contract-abis/zrx-protocol/ZrxTreasury.json";
import {ZrxTreasury} from "../../../contract-libs";
import {IZrxTreasury} from "../../../contract-libs/zrx-protocol/ZrxTreasury";
import { tokenTransfer } from "../../lib/erc-20/token-transfer";
import { transferARBTokens } from "../../lib/arbitrum/send-token-transfer-message";
import { TREASURY, ZRX } from "../../lib/constants";

async function main() {

  const paperClipMainnetAddress = "0xA2b6590A6dC916fe317Dcab169a18a5B87A5c3d5";
  const zrxAmount = ethers.utils.parseEther("53959");
  const zrxTransfer: string = await tokenTransfer(ZRX, zrxAmount, paperClipMainnetAddress);
  
  const paperClipArbitrumAddress = "0xc5A13251c01257404430952481ACb8C0D6ed171D";
  const arbAmount = "15703";
  const arbTransferTicket = await transferARBTokens(paperClipArbitrumAddress, arbAmount, "0.001", TREASURY);

  const actions: IZrxTreasury.ProposedActionStruct[] = [
      { target: ZRX, data: zrxTransfer, value: 0},
      { target: arbTransferTicket.to!, data: arbTransferTicket.data!, value: arbTransferTicket.value!},
  ];

  await submitProposal(actions, TREASURY);
}

async function submitProposal(actions: IZrxTreasury.ProposedActionStruct[], treasuryAddress: string) {
  const currentEpoch = 195;
  const votingEpoch = currentEpoch + 2;
  const executionEpoch = votingEpoch + 1;
  const description = `# Z-9 GRANT PROPOSAL: Paperclip Labs to Build 0x Community Subgraph

  ## Summary 
  
  This proposal seeks authorization of a $32k grant from the treasury to Paperclip Labs. The community has discussed the merits of the proposal in the governance forum and signaled support for moving forward to an onchain vote: 
  
  https://snapshot.org/#/0xgov.eth/proposal/0x0ed3de830180c6de6681bd7a5cc896fa705a8239a6bace7806a3ea7efd89f68b
  
  ## Grant Details
  
  **Amount:** $32k in $ZRX and $ARB (50/50)
  
  **Price reference:** $ZRX 30-day EMA as of 11/13/2023 = $.29652 (https://www.tradingview.com/symbols/ZRXUSD/technicals/?exchange=COINBASE); $ARB 30-day EMA as of 11/13/2023 = $1.01890 (https://www.tradingview.com/symbols/ARBUSD/technicals/?exchange=COINBASE) 
  
  **Receiving address:** Ethereum 0xA2b6590A6dC916fe317Dcab169a18a5B87A5c3d5; Arbitrum 0xc5A13251c01257404430952481ACb8C0D6ed171D
  
  ## Proposal Details 
  
  See detailed explanation at https://forum.0xprotocol.org/t/grant-request-0x-community-subgraph/3710
  
  ## Action Required 
  
  Send 53,959 $ZRX to 0xA2b6590A6dC916fe317Dcab169a18a5B87A5c3d5
  
  Send 15,703 $ARB to 0xc5A13251c01257404430952481ACb8C0D6ed171D
  
  Note: ZRXTreasury address aliased on L2 0x1cc2810061c2f5B2088054EE184E6c79E1592212`

  const operatedPoolIds = "0x0000000000000000000000000000000000000000000000000000000000000030";

  const treasury = <ZrxTreasury>await ethers.getContractAt(ZrxTreasuryAbi, treasuryAddress);

  const tx = await treasury.propose(actions, executionEpoch, description, [operatedPoolIds]);
  await tx.wait();
  // tx: 0xddc131a7876c90079d4a61f31949666e6d57218d57c59a4b654a5b11a4e21142
}

async function executeProposal(id: number, actions: IZrxTreasury.ProposedActionStruct[], treasuryAddress: string) {
  const treasury = <ZrxTreasury>await ethers.getContractAt(ZrxTreasuryAbi, treasuryAddress);
  const tx = await treasury.execute(
    id,
    actions,
  );
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
