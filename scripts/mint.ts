import dotenv from "dotenv";
import { encodeFunctionData } from "viem";
import { SEPOLIA_CHAIN_ID, setupNearEthAdapter } from "./setup";

dotenv.config();

const run = async (): Promise<void> => {
	const adapter = await setupNearEthAdapter();

	console.log("🚀 ~ run ~ adapter address:", adapter.address);

	const contractAddress = "0x3afbb57c8014ea432c4cb1ae5df2ce0f357c1a23";
	const amountToMint = BigInt(20 * 10 ** 18); // 20 tokens with 18 decimals

	await adapter.signAndSendTransaction({
		to: contractAddress,
		data: encodeFunctionData({
			abi: [
				{
					name: "mint",
					type: "function",
					inputs: [{ name: "amount", type: "uint256" }],
					outputs: [],
				},
			],
			functionName: "mint",
			args: [amountToMint],
		}),
		chainId: SEPOLIA_CHAIN_ID,
	});

	console.log(`Successfully minted 20 tokens to ${adapter.address}`);
};

run().catch(console.error);