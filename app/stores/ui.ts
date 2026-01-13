import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", () => {
  const isSidebarExpanded = useState("ui:isSidebarExpanded", () => false);
  const isHomeScreen = useState("ui:isHomeScreen", () => true);
  const isSearchActive = useState("ui:isSearchActive", () => false);
  const searchQuery = useState("ui:searchQuery", () => "");

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

  return {
    isSidebarExpanded,
    isHomeScreen,
    isSearchActive,
    searchQuery,
    toggleSidebar,
    toggleSearch,
    setSearchQuery,
    setHomeScreen,
  };
});
