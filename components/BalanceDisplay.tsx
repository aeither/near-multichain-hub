import { useEffect, useState } from "react";
import { createPublicClient, formatEther, http } from "viem";
import { sepolia } from "viem/chains";

const BalanceDisplay = ({ address }: { address: `0x${string}` }) => {
	const [balance, setBalance] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBalance = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// Create a public client
				const client = createPublicClient({
					chain: sepolia,
					transport: http(),
				});

				// Fetch the balance
				const balanceWei = await client.getBalance({ address });

				// Convert balance from Wei to Ether and format it
				const balanceEther = formatEther(balanceWei);
				setBalance(balanceEther);
			} catch (err) {
				console.error("Error fetching balance:", err);
				setError("Failed to fetch balance");
			} finally {
				setIsLoading(false);
			}
		};

		if (address) {
			fetchBalance();
		}
	}, [address]);

	if (isLoading) return <div>Loading balance...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<h2>Balance</h2>
			<p>{balance} ETH</p>
		</div>
	);
};

export default BalanceDisplay;
