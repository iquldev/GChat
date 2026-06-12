import { defineStore } from 'pinia';
import { useCookie, useState, useRuntimeConfig } from '#app';

export interface UIModelOption {
  label: string;
  value: string;
}

export const useUIStore = defineStore('ui', () => {
  const config = useRuntimeConfig();
  const defaultModel = config.public.defaultAiModel as string;

  const isSidebarExpanded = useCookie('ui:isSidebarExpanded', {
    default: () => false,
  });
  const isSearchActive = useState('ui:isSearchActive', () => false);
  const searchQuery = useState('ui:searchQuery', () => '');
  const isSettingsOpen = useState('ui:isSettingsOpen', () => false);

  const selectedModel = useCookie('ui:selectedModel', {
    default: () => defaultModel,
  });

  const modelOptions = useState<UIModelOption[]>('ui:modelOptions', () => [
    { label: defaultModel, value: defaultModel },
  ]);

  const isBlurDisabled = useCookie<boolean>('ui:isBlurDisabled', {
    default: () => false,
  });

  const toggleSidebar = () => {
    isSidebarExpanded.value = !isSidebarExpanded.value;
  };

  const toggleSearch = () => {
    isSearchActive.value = !isSearchActive.value;
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
    modelOptions,
    isBlurDisabled,
    toggleSidebar,
    toggleSearch,
    toggleSettings,
  };
});
