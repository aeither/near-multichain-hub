import dotenv from "dotenv";
import { type NearEthAdapter, setupAdapter } from "near-ca";
import { sepolia } from "viem/chains";
// This is Sepolia, but can be replaced with nearly any EVM network.
export const SEPOLIA_CHAIN_ID = sepolia.id;

export async function setupNearEthAdapter(): Promise<NearEthAdapter> {
	dotenv.config();
	const { NEAR_ACCOUNT_ID, NEAR_ACCOUNT_PRIVATE_KEY, MPC_CONTRACT_ID } =
		process.env;
	if (!(NEAR_ACCOUNT_ID && NEAR_ACCOUNT_PRIVATE_KEY && MPC_CONTRACT_ID)) {
		throw new Error(
			"One of env vars NEAR_ACCOUNT_ID, NEAR_ACCOUNT_PRIVATE_KEY, or MPC_CONTRACT_ID is undefined",
		);
	}
	return setupAdapter({
		accountId: NEAR_ACCOUNT_ID,
		privateKey: NEAR_ACCOUNT_PRIVATE_KEY,
		mpcContractId: MPC_CONTRACT_ID,
	});
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
