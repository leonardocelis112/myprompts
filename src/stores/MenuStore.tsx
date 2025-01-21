import { create } from "zustand";
import MenuStore from "src/interfaces/MenuStore";

const useMenuStore = create<MenuStore>((set) => ({
  selectedMenu: "Prompts",
  setSelectedMenu: (menu: string) => set({ selectedMenu: menu }),
}));

export default useMenuStore;
