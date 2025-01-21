interface MenuStore {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
}

export default MenuStore;
