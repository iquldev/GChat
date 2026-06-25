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

  const isBlurDisabled = useCookie<boolean>('ui:isBlurDisabled', {
    default: () => false,
  });

  const aiTemperature = useCookie<number>('ui:aiTemperature', {
    default: () => 0.7,
  });

  const aiMaxTokens = useCookie<number>('ui:aiMaxTokens', {
    default: () => 2048,
  });

  const customSystemPrompt = useCookie<string>('ui:customSystemPrompt', {
    default: () => '',
  });

  const customModelId = useCookie<string>('ui:customModelId', {
    default: () => '',
  });

  const enterToSend = useCookie<boolean>('ui:enterToSend', {
    default: () => true,
  });

  const userApiKey = useCookie<string>('ui:userApiKey', {
    default: () => '',
  });

  const soundEnabled = useCookie<boolean>('ui:soundEnabled', {
    default: () => false,
  });


  const isOledMode = useCookie<boolean>('ui:isOledMode', {
    default: () => false,
  });

  const modelOptions = computed<UIModelOption[]>(() => {
    const options = [{ label: defaultModel, value: defaultModel }];
    if (customModelId.value && customModelId.value !== defaultModel) {
      options.push({ label: customModelId.value, value: customModelId.value });
    }
    return options;
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
    aiTemperature,
    aiMaxTokens,
    customSystemPrompt,
    customModelId,
    enterToSend,
    userApiKey,
    soundEnabled,
    isOledMode,
    toggleSidebar,
    toggleSearch,
    toggleSettings,
  };
});

export type UIStore = ReturnType<typeof useUIStore>;
