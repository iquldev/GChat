import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useUIStore = defineStore("ui", () => {
  const isSidebarExpanded = useCookie("ui:isSidebarExpanded", {
    default: () => false,
  });
  const isSearchActive = useState("ui:isSearchActive", () => false);
  const searchQuery = useState("ui:searchQuery", () => "");
  const isSettingsOpen = useState("ui:isSettingsOpen", () => false);

  const selectedModel = useCookie("ui:selectedModel", {
    default: () => "gemini-3-flash",
  });

  const toggleSidebar = () => {
    isSidebarExpanded.value = !isSidebarExpanded.value;
  };

  const toggleSearch = () => {
    isSearchActive.value = !isSearchActive.value;
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const toggleSettings = (value?: boolean) => {
    isSettingsOpen.value = value !== undefined ? value : !isSettingsOpen.value;
  };

  return {
    isSidebarExpanded,
    isSearchActive,
    searchQuery,
    isSettingsOpen,
    selectedModel,
    toggleSidebar,
    toggleSearch,
    setSearchQuery,
    toggleSettings,
  };
});
