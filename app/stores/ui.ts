import { defineStore } from "pinia";
import { useCookie, useState } from "#app";

export const useUIStore = defineStore("ui", () => {
  const isSidebarExpanded = useCookie("ui:isSidebarExpanded", {
    default: () => false,
  });
  const isSearchActive = useState("ui:isSearchActive", () => false);
  const searchQuery = useState("ui:searchQuery", () => "");
  const isSettingsOpen = useState("ui:isSettingsOpen", () => false);

  const selectedModel = useCookie("ui:selectedModel", {
    default: () => "gemini-2.5-flash",
  });

  const isBlurDisabled = useCookie<boolean>("ui:isBlurDisabled", {
    default: () => false,
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
    isBlurDisabled,
    toggleSidebar,
    toggleSearch,
    setSearchQuery,
    toggleSettings,
  };
});
