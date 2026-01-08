import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", () => {
  const isSidebarExpanded = ref(false);
  const isHomeScreen = ref(true);
  const isSearchActive = ref(false);
  const searchQuery = ref("");

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
