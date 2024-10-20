// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useNearCA } from "@/lib/hooks";
import { useNearStore } from "@/store/nearStore";
import Image from "next/image";

export default function Home() {
	const { nearAccountId, nearPrivateKey, setNearAccountId, setNearPrivateKey } =
		useNearStore();
	const { caSendEth, caMintNFT, isCaEnabled, error } = useNearCA(
		nearAccountId,
		nearPrivateKey,
	);

	const handleAccountIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNearAccountId(e.target.value);
	};

	const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNearPrivateKey(e.target.value);
	};

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<input
					type="text"
					placeholder="Enter NEAR Account ID"
					value={nearAccountId}
					onChange={handleAccountIdChange}
					className="p-2 border rounded"
				/>
				<input
					type="password"
					placeholder="Enter NEAR Private Key"
					value={nearPrivateKey}
					onChange={handlePrivateKeyChange}
					className="p-2 border rounded"
				/>
				<Image
					className="dark:invert"
					src="https://nextjs.org/icons/next.svg"
					alt="Next.js logo"
					width={180}
					height={38}
					priority
				/>
				<ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
					<li className="mb-2">
						Get started by editing{" "}
						<code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
							app/page.tsx
						</code>
						.
					</li>
					<li>Save and see your changes instantly.</li>
				</ol>

				<Button onClick={caSendEth} disabled={!isCaEnabled}>
					Send ETH
				</Button>
				<Button onClick={caMintNFT} disabled={!isCaEnabled}>
					Mint NFT
				</Button>
				{error && <p className="text-red-500">{error.message}</p>}
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				<div>footer</div>
			</footer>
		</div>
	);
}
