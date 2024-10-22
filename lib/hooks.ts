import { type NearEthAdapter, setupAdapter } from "near-ca";
import { useCallback, useEffect, useState } from "react";
import { encodeFunctionData } from "viem";
import type { Chain } from "viem/chains";

export function useNearCA(nearAccountId: string, nearPrivateKey: string) {
	const [adapter, setAdapter] = useState<NearEthAdapter | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		async function initializeAdapter() {
			try {
				const MPC_CONTRACT_ID = "v1.signer-prod.testnet";

				if (!(nearAccountId && nearPrivateKey)) {
					setAdapter(null);
					setError(null);
					return;
				}

				const newAdapter = await setupAdapter({
					accountId: nearAccountId,
					privateKey: nearPrivateKey,
					mpcContractId: MPC_CONTRACT_ID,
				});

				setAdapter(newAdapter);
				setError(null);
			} catch (err) {
				setAdapter(null);
				setError(
					err instanceof Error ? err : new Error("An unknown error occurred"),
				);
			}
		}

		initializeAdapter();
	}, [nearAccountId, nearPrivateKey]);

	const isCaEnabled = adapter !== null && !error;

	const caSendEth = useCallback(
		async (amount: bigint, to: string, chain: Chain) => {
			if (!adapter) return;
			const transaction = {
				to: to as `0x${string}`,
				value: amount,
				chainId: chain.id,
			};
			const hash = await adapter.signAndSendTransaction(transaction);
			console.log("🚀 ~ caSendEth ~ hash:", hash);
			return hash;
		},
		[adapter],
	);

	const caMintERC20 = useCallback(
		async (amount: bigint, chain: Chain) => {
			if (!adapter) return;
			const contractAddress = "0x3afbb57c8014ea432c4cb1ae5df2ce0f357c1a23";
			const transaction = {
				to: contractAddress as `0x${string}`,
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
					args: [amount],
				}),
				chainId: chain.id,
			};
			const hash = await adapter.signAndSendTransaction(transaction);
			console.log(
				`Successfully minted ${amount.toString()} ERC20 tokens to ${adapter.address}. Hash: ${hash}`,
			);
			return hash;
		},
		[adapter],
	);

	return {
		caSendEth,
		caMintERC20,
		isCaEnabled,
		error,
		adapter,
	};
}