import React from 'react';
import { Lightbulb, X } from 'lucide-react';

interface SmartSuggestionsProps {
  toolName: string;
  suggestions: any;
  onUseSuggestion: (suggestions: any) => void;
  onDismiss: () => void;
  visible: boolean;
  userContext?: any;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  toolName,
  suggestions,
  onUseSuggestion,
  onDismiss,
  visible,
  userContext
}) => {
  if (!visible) return null;

  const getSuggestionText = (toolName: string, context?: any) => {
    switch (toolName) {
      case 'fasting-planner':
        return context?.experience ? 
          `Recommended for ${context.experience} level: ${suggestions.selectedType} fasting schedule` :
          'Personalized fasting schedule based on your experience level';
      case 'freelance-proposal-estimator':
        return context?.industry ? 
          `Industry-standard rates for ${context.industry}: $${suggestions.defaultHourlyRate}/hr` :
          'Market-rate pricing based on industry standards and experience';
      case 'event-cost-estimator':
        return context?.attendees ? 
          `Optimized for ${context.attendees} attendees with location-based pricing` :
          'Cost estimates based on attendee count and venue location';
      case 'self-employed-tax-estimator':
        return context?.businessType ? 
          `Tax optimization for ${context.businessType} business with industry-specific deductions` :
          'Real tax calculations based on current IRS rates and business type';
      case 'debt-snowball-tracker':
        return context?.totalDebt ? 
          `Optimized payoff strategy for $${context.totalDebt.toLocaleString()} total debt` :
          'Personalized debt payoff strategy based on your financial capacity';
      case 'budget-card-conveyor':
        return context?.income ? 
          `Budget optimized for $${context.income.toLocaleString()} income using 50/30/20 rule` :
          'Evidence-based budget allocation using proven financial ratios';
      case 'hourly-rate-calculator':
        return context?.experience ? 
          `Rate calculation for ${context.experience}-level professional with market adjustments` :
          'Market-competitive rates based on experience level and industry standards';
      case 'wedding-budget-planner':
        return 'Typical breakdown: Venue (40%), Food (30%), Photography (10%), Attire (8%)';
      default:
        return 'Smart suggestions based on real market data and best practices';
    }
  };

  return (
    <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex items-start gap-2 sm:gap-3">
        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-blue-300 mb-2 text-sm sm:text-base">💡 Smart Suggestions</h4>
          <p className="text-xs sm:text-sm text-blue-200 mb-3">
            {getSuggestionText(toolName, userContext)}
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onUseSuggestion(suggestions)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors min-h-[44px] flex items-center justify-center"
            >
              Apply Smart Suggestions
            </button>
            <button
              onClick={onDismiss}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors min-h-[44px] flex items-center justify-center"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-blue-400 hover:text-blue-300 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};