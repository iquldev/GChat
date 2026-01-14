import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", () => {
  const isSidebarExpanded = useState("ui:isSidebarExpanded", () => false);
  const isHomeScreen = useState("ui:isHomeScreen", () => true);
  const isSearchActive = useState("ui:isSearchActive", () => false);
  const searchQuery = useState("ui:searchQuery", () => "");
  const isSettingsOpen = useState("ui:isSettingsOpen", () => false);

  const toggleSidebar = () => {
    isSidebarExpanded.value = !isSidebarExpanded.value;
  };

  const toggleSearch = () => {
    isSearchActive.value = !isSearchActive.value;
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const setHomeScreen = (value: boolean) => {
    isHomeScreen.value = value;
  };

  const toggleSettings = (value?: boolean) => {
    isSettingsOpen.value = value !== undefined ? value : !isSettingsOpen.value;
  };

  return {
    isSidebarExpanded,
    isHomeScreen,
    isSearchActive,
    searchQuery,
    isSettingsOpen,
    toggleSidebar,
    toggleSearch,
    setSearchQuery,
    setHomeScreen,
    toggleSettings,
  };
});
