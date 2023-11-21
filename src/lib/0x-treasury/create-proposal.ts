import { ethers } from "hardhat";
import ZrxTreasuryAbi from "../../../contract-abis/zrx-protocol/ZrxTreasury.json";
import StakingProxyAbi from "../../../contract-abis/zrx-protocol/StakingProxy.json";
import {ZrxTreasury, StakingProxy} from "../../../contract-libs";
import {IZrxTreasury} from "../../../contract-libs/zrx-protocol/ZrxTreasury";

export async function encodeProposal(
  treasuryAddress: string, 
  description: string, 
  actions: IZrxTreasury.ProposedActionStruct[], 
  operatedPoolIds: string[]
) {
  const treasury = <ZrxTreasury>await ethers.getContractAt(ZrxTreasuryAbi, treasuryAddress);
  
  const stakingProxyAddress = await treasury.stakingProxy();
  const stakingProxy = <StakingProxy>await ethers.getContractAt(StakingProxyAbi, stakingProxyAddress);

  const currentEpoch = await stakingProxy.currentEpoch().then(e => e.toNumber());
  const votingEpoch = currentEpoch + 2;
  const executionEpoch = votingEpoch + 1;

  const callData = treasury.interface.encodeFunctionData('propose', [
    actions,
    executionEpoch,
    description,
    operatedPoolIds,
  ]);

  return callData;
}
