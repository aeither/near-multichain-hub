// store/nearStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NearStore {
	nearAccountId: string;
	nearPrivateKey: string;
	setNearAccountId: (id: string) => void;
	setNearPrivateKey: (key: string) => void;
}

export const useNearStore = create<NearStore>()(
	persist(
		(set) => ({
			nearAccountId: "",
			nearPrivateKey: "",
			setNearAccountId: (id) => set({ nearAccountId: id }),
			setNearPrivateKey: (key) => set({ nearPrivateKey: key }),
		}),
		{
			name: "near-storage",
		},
	),
);