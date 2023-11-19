import TokenEscrowAbi from "../../contract-abis/llama-pay/TokenEscrow.json";
import {ethers} from "hardhat";
import {TokenEscrow} from "../../contract-libs";
import {BigNumber} from "ethers";

export async function encodeCreatePay(
    escrowAddress: string,
    tokenAddress: string,
    payee: string,
    amount: BigNumber,
    releaseTimestamp: number
): Promise<string> {
    const escrow = <TokenEscrow>await ethers.getContractAt(TokenEscrowAbi, escrowAddress);
    return escrow.interface.encodeFunctionData(
        'create',
        [
            tokenAddress,
            payee,
            amount,
            releaseTimestamp,
        ]
    )
}
