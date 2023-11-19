import { ethers } from 'hardhat'
import { L1ToL2MessageCreator } from '@arbitrum/sdk/dist/lib/message/L1ToL2MessageCreator'
import { tokenTransfer } from '../erc-20/token-transfer';
import { TransactionRequest } from '@ethersproject/abstract-provider';

export async function transferARBTokens(arbitrumTokenAddress: string, receiver: string, amount: string, sender: string, gasOverride?: string, ): Promise<TransactionRequest> {
    const ethereumProvider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_MAINNET_API_KEY}`);
    const arbitrumProvider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');

    const messageData = await tokenTransfer(arbitrumTokenAddress, ethers.utils.parseEther(amount), receiver);

    const retryableTicketParams = {
        from: sender,
        to: arbitrumTokenAddress,
        l2CallValue: ethers.utils.parseEther('0'),
        callValueRefundAddress: sender,
        excessFeeRefundAddress: sender,
        data: messageData,
    };

    const request = await L1ToL2MessageCreator.getTicketCreationRequest(
        retryableTicketParams,
        ethereumProvider,
        arbitrumProvider
    );

    console.log('ticket estimated cost: ', ethers.utils.formatEther(request.txRequest.value));

    return {
        ...request.txRequest,
        value: gasOverride ? ethers.utils.parseEther(gasOverride) : request.txRequest.value,
    };
}
