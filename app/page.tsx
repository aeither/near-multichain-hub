"use client";

import BalanceDisplay, { openCampusCodex } from "@/components/BalanceDisplay";
import TokenBalanceDisplay from "@/components/TokenBalanceDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { useNearCA } from "@/lib/hooks";
import { useNearStore } from "@/store/nearStore";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, SendIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { morphHolesky, sepolia } from "viem/chains";

const chainOptions = {
	Sepolia: sepolia,
	Morph: morphHolesky,
	"Open Campus": openCampusCodex,
};

export default function Dashboard() {
	const { nearAccountId, nearPrivateKey, setNearAccountId, setNearPrivateKey } =
		useNearStore();
	const { caSendEth, caMintERC20, isCaEnabled, error, adapter } = useNearCA(
		nearAccountId,
		nearPrivateKey,
	);

	const [transferAmount, setTransferAmount] = useState("");
	const [transferTo, setTransferTo] = useState("");
	const [transferNetwork, setTransferNetwork] = useState("Sepolia");
	const [mintAmount, setMintAmount] = useState("");

	const handleAccountIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNearAccountId(e.target.value);
	};

	const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNearPrivateKey(e.target.value);
	};

	const handleTransfer = async () => {
		if (!isCaEnabled) {
			toast({
				title: "Error",
				description: "Contract Account is not enabled",
				variant: "destructive",
			});
			return;
		}
		const selectedChain =
			chainOptions[transferNetwork as keyof typeof chainOptions];
		const hash = await caSendEth(
			BigInt(transferAmount),
			transferTo,
			selectedChain,
		);
		toast({
			title: "Sending...",
			description: hash,
		});
		setTransferAmount("");
		setTransferTo("");
	};

	const handleMintERC20 = async () => {
		if (!isCaEnabled) {
			toast({
				title: "Error",
				description: "Contract Account is not enabled",
				variant: "destructive",
			});
			return;
		}
		const selectedChain =
			chainOptions[transferNetwork as keyof typeof chainOptions];
		const hash = await caMintERC20(BigInt(mintAmount), selectedChain);
		toast({
			title: "Minting...",
			description: hash,
		});
		setMintAmount("");
	};

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-3xl font-bold mb-6">Universal Wallet Dashboard</h1>

			{/* Balance Display */}
			<Card>
				<CardHeader>
					<CardTitle>Balance Display</CardTitle>
				</CardHeader>
				<CardContent>
					<BalanceDisplay address={adapter?.address as `0x${string}`} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>ERC20 Token Balance Display</CardTitle>
				</CardHeader>
				<CardContent>
					<TokenBalanceDisplay address={adapter?.address as `0x${string}`} />
				</CardContent>
			</Card>

			{/* NEAR Account Setup */}
			<Card>
				<CardHeader>
					<CardTitle>NEAR Account Setup</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="nearAccountId">NEAR Account ID</Label>
							<Input
								id="nearAccountId"
								type="text"
								placeholder="Enter NEAR Account ID"
								value={nearAccountId}
								onChange={handleAccountIdChange}
								className="p-2 border rounded"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="nearPrivateKey">NEAR Private Key</Label>
							<Input
								id="nearPrivateKey"
								type="password"
								placeholder="Enter NEAR Private Key"
								value={nearPrivateKey}
								onChange={handlePrivateKeyChange}
								className="p-2 border rounded"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Coin Transfer */}
			<Card>
				<CardHeader>
					<CardTitle>Coin Transfer</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex space-x-2">
							<Input
								type="number"
								placeholder="Amount"
								value={transferAmount}
								onChange={(e) => setTransferAmount(e.target.value)}
								aria-label="Transfer Amount"
							/>
							<Input
								placeholder="To Address"
								value={transferTo}
								onChange={(e) => setTransferTo(e.target.value)}
								aria-label="To Address"
							/>
						</div>
						<RadioGroup
							value={transferNetwork}
							onValueChange={setTransferNetwork}
						>
							<div className="flex space-x-2">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="Sepolia" id="sepolia" />
									<Label htmlFor="sepolia">Sepolia</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="Morph" id="morph" />
									<Label htmlFor="morph">Morph</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="Open Campus" id="openCampus" />
									<Label htmlFor="openCampus">Open Campus</Label>
								</div>
							</div>
						</RadioGroup>
						<Button
							onClick={handleTransfer}
							className="w-full"
							disabled={!isCaEnabled}
						>
							<SendIcon className="mr-2 h-4 w-4" /> Transfer
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Visual Transfer Representation */}
			<AnimatePresence>
				{transferAmount && transferTo && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						className="flex justify-center items-center space-x-4"
					>
						<div className="text-lg font-bold">{transferNetwork}</div>
						<SendIcon className="h-6 w-6" />
						<div className="text-lg font-bold">
							{transferTo.slice(0, 6)}...{transferTo.slice(-4)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* ERC20 Minting */}
			<Card>
				<CardHeader>
					<CardTitle>ERC20 Minting</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<Input
							type="number"
							placeholder="Amount to Mint"
							value={mintAmount}
							onChange={(e) => setMintAmount(e.target.value)}
							aria-label="Mint Amount"
						/>
						<Button
							onClick={handleMintERC20}
							className="w-full"
							disabled={!isCaEnabled}
						>
							<PlusIcon className="mr-2 h-4 w-4" /> Mint ERC20
						</Button>
					</div>
				</CardContent>
			</Card>

			{error && <p className="text-red-500">{error.message}</p>}
		</div>
	);
}
