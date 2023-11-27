import { executeProposal } from "../lib/0x-treasury/execute-proposal";
import { TREASURY } from "../lib/constants";

async function execute(txHash: string, simulate: boolean = false) {
  const receipt = await executeProposal(TREASURY, txHash, simulate);
  console.log(receipt);
}

execute("", true)
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});