import { ethers } from "hardhat";
import ZrxTreasuryAbi from "../../../contract-abis/zrx-protocol/ZrxTreasury.json";
import {ZrxTreasury} from "../../../contract-libs";

export async function executeProposal(treasuryAddress: string, proposalCreationTxHash: string) {
  const treasury = <ZrxTreasury>await ethers.getContractAt(ZrxTreasuryAbi, treasuryAddress);

  const proposalCreationTx = await ethers.provider.getTransaction(proposalCreationTxHash);
  const proposalCreationReceipt = await proposalCreationTx.wait();
  const proposalCreatedEvent = treasury.interface.parseLog(proposalCreationReceipt.logs[0]);

  const proposalId = proposalCreatedEvent.args.proposalId;
  const actions = proposalCreatedEvent.args.actions;

  const tx = await treasury.execute(proposalId, actions);
  await tx.wait();
}
