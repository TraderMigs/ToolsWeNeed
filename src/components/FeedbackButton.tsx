import React, { useState } from 'react';
import { MessageSquare, Flag } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';

interface FeedbackButtonProps {
  toolId: string;
  toolName: string;
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
  showIcon?: boolean;
  label?: string;
  isFlagged?: boolean;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ 
  toolId,
  toolName,
  variant = 'primary',
  className = '',
  showIcon = true,
  label = 'Feedback',
  isFlagged = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => {
    setIsModalOpen(true);
    
    // Track event in analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'open_feedback', {
        'event_category': 'engagement',
        'event_label': toolName,
        'tool_id': toolId
      });
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors';
      case 'secondary':
        return 'bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors';
      case 'text':
        return 'text-blue-400 hover:text-blue-300 transition-colors';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors';
    }
  };
  
  const Icon = isFlagged ? Flag : MessageSquare;
  
  return (
    <>
      <button
        onClick={openModal}
        className={`flex items-center gap-2 ${getButtonStyles()} ${className}`}
      >
        {showIcon && <Icon className="w-4 h-4" />}
        <span>{label}</span>
      </button>
      
      <FeedbackModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        toolId={toolId}
        toolName={toolName}
      />
    </>
  );
};