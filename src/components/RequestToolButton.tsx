import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import { ToolRequestModal } from './ToolRequestModal';

interface RequestToolButtonProps {
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
}

export const RequestToolButton: React.FC<RequestToolButtonProps> = ({ 
  variant = 'primary',
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => {
    setIsModalOpen(true);
    
    // Track event in analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'open_tool_request', {
        'event_category': 'engagement',
        'event_label': 'request_tool_button'
      });
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors';
      case 'secondary':
        return 'bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors';
      case 'text':
        return 'text-blue-400 hover:text-blue-300 transition-colors';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors';
    }
  };
  
  return (
    <>
      <button
        onClick={openModal}
        className={`flex items-center gap-2 ${getButtonStyles()} ${className}`}
      >
        <Wrench className="w-4 h-4" />
        <span>Request a Tool</span>
      </button>
      
      <ToolRequestModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};