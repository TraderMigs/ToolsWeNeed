import React, { useState } from 'react';
import { Zap, Loader, Sparkles } from 'lucide-react';

interface AIFieldAssistantProps {
  fieldName: string;
  fieldLabel: string;
  toolName: string;
  currentValue?: any;
  onSuggestion: (value: any) => void;
  placeholder?: string;
}

export const AIFieldAssistant: React.FC<AIFieldAssistantProps> = ({
  fieldName,
  fieldLabel,
  toolName,
  currentValue,
  onSuggestion,
  placeholder
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);

  const getFieldSuggestion = async () => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const suggestion = generateFieldSuggestion(fieldName, fieldLabel, toolName);
    setSuggestion(suggestion);
    setShowSuggestion(true);
    setIsLoading(false);
  };

  const generateFieldSuggestion = (field: string, label: string, tool: string) => {
    const fieldLower = field.toLowerCase();
    const labelLower = label.toLowerCase();
    
    // Budget suggestions
    if (tool.includes('Budget')) {
      if (fieldLower.includes('rent') || fieldLower.includes('housing')) {
        return { value: 1500, explanation: 'Average rent/mortgage (30% of income)' };
      }
      if (fieldLower.includes('food') || fieldLower.includes('grocery')) {
        return { value: 400, explanation: 'Typical monthly food budget' };
      }
      if (fieldLower.includes('income') || fieldLower.includes('salary')) {
        return { value: 4500, explanation: 'Median monthly income' };
      }
      if (fieldLower.includes('saving')) {
        return { value: 500, explanation: 'Recommended 20% savings rate' };
      }
    }

    // Tax suggestions
    if (tool.includes('Tax')) {
      if (fieldLower.includes('rate')) {
        return { value: 25, explanation: 'Typical effective tax rate' };
      }
      if (fieldLower.includes('deduction')) {
        return { value: 12000, explanation: 'Standard deduction amount' };
      }
      if (fieldLower.includes('income')) {
        return { value: 75000, explanation: 'Median freelance income' };
      }
    }

    // Debt suggestions
    if (tool.includes('Debt')) {
      if (fieldLower.includes('balance')) {
        return { value: 3500, explanation: 'Average credit card balance' };
      }
      if (fieldLower.includes('payment')) {
        return { value: 85, explanation: 'Typical minimum payment' };
      }
      if (fieldLower.includes('rate') || fieldLower.includes('interest')) {
        return { value: 18.99, explanation: 'Average credit card APR' };
      }
    }

    // Freelance suggestions
    if (tool.includes('Freelance')) {
      if (fieldLower.includes('rate') || fieldLower.includes('hourly')) {
        return { value: 75, explanation: 'Mid-level freelancer rate' };
      }
      if (fieldLower.includes('hour')) {
        return { value: 20, explanation: 'Typical project phase hours' };
      }
    }

    // Net Worth suggestions
    if (tool.includes('Net Worth')) {
      if (fieldLower.includes('saving') || fieldLower.includes('cash')) {
        return { value: 15000, explanation: '6-month emergency fund' };
      }
      if (fieldLower.includes('retirement') || fieldLower.includes('401k')) {
        return { value: 45000, explanation: 'Average retirement savings' };
      }
    }

    // Generic suggestions
    if (labelLower.includes('amount') || labelLower.includes('cost')) {
      return { value: 100, explanation: 'Common amount for this field' };
    }
    if (labelLower.includes('percentage') || labelLower.includes('rate')) {
      return { value: 10, explanation: 'Typical percentage' };
    }

    return { value: '', explanation: 'AI suggestion based on common usage' };
  };

  const applySuggestion = () => {
    if (suggestion) {
      onSuggestion(suggestion.value);
      setShowSuggestion(false);
    }
  };

  return (
    <div className="relative">
      {/* AI Assist Button */}
      <button
        onClick={getFieldSuggestion}
        disabled={isLoading}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-700 disabled:text-gray-400 transition-colors z-10"
        title="Get AI suggestion"
      >
        {isLoading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </button>

      {/* Suggestion Popup */}
      {showSuggestion && suggestion && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20">
          <div className="flex items-start gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Suggested: <span className="text-purple-600">{suggestion.value}</span>
              </p>
              <p className="text-xs text-gray-600">{suggestion.explanation}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={applySuggestion}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded text-xs transition-colors"
            >
              Use This
            </button>
            <button
              onClick={() => setShowSuggestion(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded text-xs transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};