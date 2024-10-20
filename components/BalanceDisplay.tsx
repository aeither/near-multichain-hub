import { useEffect, useState } from "react";
import { createPublicClient, defineChain, formatEther, http } from "viem";
import { morphHolesky, sepolia } from "viem/chains";

const ethShorten = (address: string) => {
  if (!address) return null;
  const start = address.slice(0, 6);
  const end = address.slice(-4);
  return `${start}...${end}`;
};


export const openCampusCodex = defineChain({
	id: 656476,
	testnet: true,
	name: "Open Campus Codex",
	nativeCurrency: {
		decimals: 18,
		name: "ETH",
		symbol: "ETH",
	},
	rpcUrls: {
		public: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
		default: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
	},
	blockExplorers: {
		default: {
			name: "Blockscout",
			url: "https://rpc.open-campus-codex.gelato.digital",
		},
	},
});

const networks = [
	{ chain: sepolia, name: "Sepolia" },
	{ chain: morphHolesky, name: "Morph" },
	{ chain: openCampusCodex, name: "EDU Chain" },
];

const BalanceDisplay = ({ address }: { address: `0x${string}` }) => {
	const [balances, setBalances] = useState<Record<string, string | null>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBalances = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const newBalances: Record<string, string> = {};

				for (const network of networks) {
					const client = createPublicClient({
						chain: network.chain,
						transport: http(),
					});

					const balanceWei = await client.getBalance({ address });
					const balanceEther = formatEther(balanceWei);
					newBalances[network.name] = balanceEther;
				}

				setBalances(newBalances);
			} catch (err) {
				console.error("Error fetching balances:", err);
				setError("Failed to fetch balances");
			} finally {
				setIsLoading(false);
			}
		};

		if (address) {
			fetchBalances();
		}
	}, [address]);

	if (isLoading) return <div>Loading balances...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<h2>Balances: {address}</h2>
			{/* {ethShorten(address)} */}
			{networks.map((network) => (
				<div key={network.name}>
					<p>
						{network.name}: {balances[network.name] || "0"}{" "}
						{network.chain.nativeCurrency.symbol}
					</p>
				</div>
			))}
		</div>
	);
};

export default BalanceDisplay;
