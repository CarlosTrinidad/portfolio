import create from "zustand";

type Extra = {
  extra: number;
  setExtra: (param: number) => void;
};

const useStore = create<Extra>((set) => ({
  extra: 0,
  setExtra: (param) => set({ extra: param }),
}));

export default useStore;
