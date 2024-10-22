import { useEffect, useState } from "react";
import {
	createPublicClient,
	defineChain,
	erc20Abi,
	formatUnits,
	http,
} from "viem";
import { morphHolesky, sepolia } from "viem/chains";

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
	{
		chain: sepolia,
		name: "Sepolia",
		tokenAddress: "0x3AFBb57C8014EA432c4cB1ae5Df2cE0f357c1a23",
	}, // Replace with actual token addresses
	{
		chain: morphHolesky,
		name: "Morph",
		tokenAddress: "0x5199caf18B5B5b1eEFEd9DE55feEE1c29707953F",
	},
	{
		chain: openCampusCodex,
		name: "EDU Chain",
		tokenAddress: "0x52cF6C7dda31D6a08788cF1Bfa2C0AEF79D76070",
	},
];

const ERC20BalanceDisplay = ({ address }: { address: `0x${string}` }) => {
	const [balances, setBalances] = useState<Record<string, string | null>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchERC20Balances = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const newBalances: Record<string, string> = {};

				for (const network of networks) {
					const client = createPublicClient({
						chain: network.chain,
						transport: http(),
					});

					const balance = await client.readContract({
						address: network.tokenAddress as `0x${string}`,
						abi: erc20Abi,
						functionName: "balanceOf",
						args: [address],
					});

					const tokenDecimals = await client.readContract({
						address: network.tokenAddress as `0x${string}`,
						abi: erc20Abi,
						functionName: "decimals",
					});

					const formattedBalance = formatUnits(balance, tokenDecimals);
					newBalances[network.name] = formattedBalance;
				}

				setBalances(newBalances);
			} catch (err) {
				console.error("Error fetching ERC20 balances:", err);
				setError("Failed to fetch ERC20 balances");
			} finally {
				setIsLoading(false);
			}
		};

		if (address) {
			fetchERC20Balances();
		}
	}, [address]);

	if (isLoading) return <div>Loading ERC20 balances...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<h2>ERC20 Token Balances: {address}</h2>
			{networks.map((network) => (
				<div key={network.name}>
					<p>
						{network.name}: {balances[network.name] || "0"} ERC20
					</p>
				</div>
			))}
		</div>
	);
};

export default ERC20BalanceDisplay;
