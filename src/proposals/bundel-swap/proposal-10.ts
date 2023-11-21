import { ethers } from "hardhat";
import { tokenTransfer } from "../../lib/erc-20/token-transfer";
import { SHA_OPERATED_POOL, TREASURY, ZRX } from "../../lib/constants";
import { submitProposal } from "../../lib/0x-treasury/submit-proposal";

async function main() {
    const receiver = "0x00A3834faEb85840e358ea22D20d6513aa2aD7E7";
    const grantAmount = ethers.utils.parseEther("70893");
    const description = `# Z-10 GRANT PROPOSAL: 31Third to Build BundleSwapFeature (pZEIP)

    ## Summary 
    
    This proposal seeks authorization of a $25k grant from the treasury to 31Third as a participant in the ZRX Pathways initiative, which aims to enable core protocol improvements by providing a better experience for core protocol contributors. 
    
    The community has discussed the merits of the proposal in the governance forum and signaled support for moving forward to an onchain vote: 
    
    https://snapshot.org/#/0xgov.eth/proposal/0xa8b19617ed5ccf26ff1873df191e908c8ab65f345b197f62fd45a11ed22a654b
    
    
    ## Grant Details
    
    **Amount:** $25k in $ZRX
    
    **Price reference:** $ZRX 30-day EMA as of 11/21/2023 = $.3526420 (https://www.tradingview.com/symbols/ZRXUSD/technicals/?exchange=COINBASE)
    
    **Receiving address:** 0x00A3834faEb85840e358ea22D20d6513aa2aD7E7
    
    ## Proposal Details 
    
    See detailed explanation at https://forum.0xprotocol.org/t/grant-request-pzeip-bundleswapfeature-31third/3723
    
    ## Action Required 
    
    Send 70,893 $ZRX to 0x00A3834faEb85840e358ea22D20d6513aa2aD7E7`;

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
        [SHA_OPERATED_POOL],
    );

    const receipt = await tx.wait();
    console.log(`transaction submitted: ${receipt.transactionHash}`);
    // tx: 0x3f8a2911ac7cffbdaafc390754151704888d201071f7379aee1b1e040ddd6842
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
