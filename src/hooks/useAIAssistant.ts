import { useState, useCallback } from 'react';

interface AIAssistantState {
  isVisible: boolean;
  isEnabled: boolean;
  currentTool: string;
}

interface UseAIAssistantReturn {
  isVisible: boolean;
  isEnabled: boolean;
  currentTool: string;
  showAssistant: () => void;
  hideAssistant: () => void;
  toggleAssistant: () => void;
  setCurrentTool: (toolName: string) => void;
  enableAssistant: () => void;
  disableAssistant: () => void;
}

export const useAIAssistant = (initialTool: string = ''): UseAIAssistantReturn => {
  const [state, setState] = useState<AIAssistantState>({
    isVisible: false,
    isEnabled: true, // Can be controlled by admin settings
    currentTool: initialTool
  });

  const showAssistant = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: true }));
  }, []);

  const hideAssistant = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false }));
  }, []);

  const toggleAssistant = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const setCurrentTool = useCallback((toolName: string) => {
    setState(prev => ({ ...prev, currentTool: toolName }));
  }, []);

  const enableAssistant = useCallback(() => {
    setState(prev => ({ ...prev, isEnabled: true }));
  }, []);

  const disableAssistant = useCallback(() => {
    setState(prev => ({ ...prev, isEnabled: false }));
  }, []);

  return {
    isVisible: state.isVisible,
    isEnabled: state.isEnabled,
    currentTool: state.currentTool,
    showAssistant,
    hideAssistant,
    toggleAssistant,
    setCurrentTool,
    enableAssistant,
    disableAssistant
  };
};