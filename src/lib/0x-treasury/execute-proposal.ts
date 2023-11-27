import { ethers } from "hardhat";
import ZrxTreasuryAbi from "../../../contract-abis/zrx-protocol/ZrxTreasury.json";
import {ZrxTreasury} from "../../../contract-libs";

export async function executeProposal(treasuryAddress: string, proposalCreationTxHash: string, simulate: boolean = false) {
  const treasury = <ZrxTreasury>await ethers.getContractAt(ZrxTreasuryAbi, treasuryAddress);

  const proposalCreationTx = await ethers.provider.getTransaction(proposalCreationTxHash);
  const proposalCreationReceipt = await proposalCreationTx.wait();
  const proposalCreatedEvent = treasury.interface.parseLog(proposalCreationReceipt.logs[0]);

  const proposalId = proposalCreatedEvent.args.proposalId;
  const actions = proposalCreatedEvent.args.actions;

  const value = actions.reduce((acc: any, action: any) => acc.add(action.value), ethers.BigNumber.from(0));

  console.log(`Proposal ${proposalId} created with value ${ethers.utils.formatEther(value)} and actions:`, actions);

  if (simulate) {
    return treasury.interface.encodeFunctionData("execute", [proposalId, actions]);
  }

  const tx = await treasury.execute(proposalId, actions, { value });
  await tx.wait();
}
