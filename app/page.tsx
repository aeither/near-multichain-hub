"use client";

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


export default function Dashboard() {
	const { nearAccountId, nearPrivateKey, setNearAccountId, setNearPrivateKey } =
		useNearStore();
	const { caSendEth, caMintNFT, isCaEnabled, error } = useNearCA(
		nearAccountId,
		nearPrivateKey,
	);

	const [transferAmount, setTransferAmount] = useState("");
	const [transferTo, setTransferTo] = useState("");
	const [transferNetwork, setTransferNetwork] = useState("Sepolia");

	const handleAccountIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNearAccountId(e.target.value);
	};

	const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNearPrivateKey(e.target.value);
	};

	const handleTransfer = () => {
		if (!isCaEnabled) {
			toast({
				title: "Error",
				description: "Contract Account is not enabled",
				variant: "destructive",
			});
			return;
		}
		caSendEth();
		setTransferAmount("");
		setTransferTo("");
	};

	const handleMintNFT = () => {
		if (!isCaEnabled) {
			toast({
				title: "Error",
				description: "Contract Account is not enabled",
				variant: "destructive",
			});
			return;
		}
		caMintNFT();
	};

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-3xl font-bold mb-6">
				Universal Testnet Wallet Dashboard
			</h1>

			{/* NEAR Account Setup */}
			<Card>
				<CardHeader>
					<CardTitle>NEAR Account Setup</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<Input
							type="text"
							placeholder="Enter NEAR Account ID"
							value={nearAccountId}
							onChange={handleAccountIdChange}
							className="p-2 border rounded"
						/>
						<Input
							type="password"
							placeholder="Enter NEAR Private Key"
							value={nearPrivateKey}
							onChange={handlePrivateKeyChange}
							className="p-2 border rounded"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Token Transfer */}
			<Card>
				<CardHeader>
					<CardTitle>Token Transfer</CardTitle>
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
									<RadioGroupItem value="Goerli" id="goerli" />
									<Label htmlFor="goerli">Goerli</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="Mumbai" id="mumbai" />
									<Label htmlFor="mumbai">Mumbai</Label>
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

			{/* NFT Minting */}
			<Card>
				<CardHeader>
					<CardTitle>NFT Minting</CardTitle>
				</CardHeader>
				<CardContent>
					<Button
						onClick={handleMintNFT}
						className="w-full"
						disabled={!isCaEnabled}
					>
						<PlusIcon className="mr-2 h-4 w-4" /> Mint NFT
					</Button>
				</CardContent>
			</Card>

			{error && <p className="text-red-500">{error.message}</p>}
		</div>
	);
}