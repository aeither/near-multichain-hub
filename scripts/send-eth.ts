import dotenv from "dotenv";
import { SEPOLIA_CHAIN_ID, setupNearEthAdapter } from "./setup";
dotenv.config();

const run = async (): Promise<void> => {
	const evm = await setupNearEthAdapter();

	console.log("🚀 ~ run ~ evm:", evm.address);
	await evm.signAndSendTransaction({
		// Sending to self.
		to: evm.address,
		// THIS IS ONE WEI!
		value: BigInt(1),
		chainId: SEPOLIA_CHAIN_ID,
	});
};
run();
