import TokenEscrowAbi from "../../../contract-abis/llama-pay/TokenEscrow.json";
import {ethers} from "hardhat";
import {TokenEscrow} from "../../../contract-libs";

export async function encodeBatchPay(
    escrowAddress: string,
    calls: string[],
): Promise<string> {
    const escrow = <TokenEscrow>await ethers.getContractAt(TokenEscrowAbi, escrowAddress);
    return escrow.interface.encodeFunctionData('batch', [calls, true]);
}