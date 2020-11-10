import create from "zustand";

interface Asset {
  id: number;
  assetClass: string;
  amount: number;
  weights: number;
  gainLoss: number;
}

type Assets = {
  original: Array<Asset>;
  custom: Array<Asset>;
  setOriginal: (param: Array<Asset>) => void;
  setCustom: (param: Array<Asset>) => void;
};

const useStore = create<Assets>((set) => ({
  original: [
    {
      id: 1,
      assetClass: "US Equities",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
    {
      id: 2,
      assetClass: "Money Market",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
    {
      id: 3,
      assetClass: "Real Estate Funds",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
    {
      id: 4,
      assetClass: "Developing World International Equities",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
    {
      id: 5,
      assetClass: "Goverment Bonds",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
    {
      id: 6,
      assetClass: "Emerging Market Equities",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
    {
      id: 7,
      assetClass: "Treasury Inflation Protected Securities	",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
    {
      id: 8,
      assetClass: "Other",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
  ],
  custom: [
    {
      id: 1,
      assetClass: "US Equities",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
    {
      id: 2,
      assetClass: "Money Market",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },

    {
      id: 4,
      assetClass: "Developing World International Equities",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
    {
      id: 5,
      assetClass: "Goverment Bonds",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
    {
      id: 6,
      assetClass: "Emerging Market Equities",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
    {
      id: 7,
      assetClass: "Treasury Inflation Protected Securities	",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
    {
      id: 8,
      assetClass: "Other",
      amount: 0,
      weights: 0,
      gainLoss: 0,
    },
  ],
  setOriginal: (param) => set({ original: param }),
  setCustom: (param) => set({ custom: param }),
}));

export default useStore;
