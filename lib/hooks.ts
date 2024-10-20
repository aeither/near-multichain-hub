import { type NearEthAdapter, setupAdapter } from "near-ca";
import { useEffect, useState } from "react";

export function useNearEthAdapter(
	nearAccountId: string,
	nearPrivateKey: string,
) {
	const [adapter, setAdapter] = useState<NearEthAdapter | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		async function initializeAdapter() {
			try {
				const MPC_CONTRACT_ID = "v1.signer-prod.testnet";

				if (!(nearAccountId && nearPrivateKey)) {
					throw new Error("NEAR Account ID and Private Key are required");
				}

				const newAdapter = await setupAdapter({
					accountId: nearAccountId,
					privateKey: nearPrivateKey,
					mpcContractId: MPC_CONTRACT_ID,
				});

				setAdapter(newAdapter);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("An unknown error occurred"),
				);
			}
		}

		initializeAdapter();
	}, [nearAccountId, nearPrivateKey]);

	return { adapter, error };
}