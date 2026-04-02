import React, { useState, useRef, useEffect } from 'react';
import { Zap, MessageCircle, X, Send, Loader, Sparkles, AlertTriangle } from 'lucide-react';

interface AIFormAssistantProps {
  toolName: string;
  currentFields?: Record<string, any>;
  onSuggestion?: (fieldName: string, value: any) => void;
  onBulkFill?: (suggestions: Record<string, any>) => void;
  visible?: boolean;
  onToggle?: () => void;
}

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  suggestions?: Record<string, any>;
  timestamp: Date;
}

interface FieldSuggestion {
  field: string;
  value: any;
  explanation: string;
  confidence: number;
}

export const AIFormAssistant: React.FC<AIFormAssistantProps> = ({
  toolName,
  currentFields = {},
  onSuggestion,
  onBulkFill,
  visible = false,
  onToggle
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: AIMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `Hi! I'm here to help you fill out the ${toolName}. I can suggest realistic values, explain fields, or help you complete the entire form. What would you like help with?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, toolName, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAISuggestions = async (userInput: string): Promise<{ response: string; suggestions?: FieldSuggestion[] }> => {
    // Simulate AI processing with realistic suggestions based on tool type
    await new Promise(resolve => setTimeout(resolve, 1500));

    const toolSuggestions = getToolSpecificSuggestions(toolName, userInput, currentFields);
    
    return {
      response: toolSuggestions.response,
      suggestions: toolSuggestions.suggestions
    };
  };

  const getToolSpecificSuggestions = (tool: string, input: string, fields: Record<string, any>) => {
    const lowerInput = input.toLowerCase();
    
    // Budget Card Conveyor suggestions
    if (tool.includes('Budget')) {
      if (lowerInput.includes('help') || lowerInput.includes('fill') || lowerInput.includes('start')) {
        return {
          response: "I'll help you create a realistic budget! Here are some common categories and typical amounts for a household:",
          suggestions: [
            { field: 'housing', value: 1500, explanation: 'Rent/mortgage (30% of income)', confidence: 85 },
            { field: 'food', value: 400, explanation: 'Groceries and dining', confidence: 80 },
            { field: 'transportation', value: 300, explanation: 'Car payment, gas, insurance', confidence: 75 },
            { field: 'utilities', value: 150, explanation: 'Electric, water, internet', confidence: 90 },
            { field: 'savings', value: 500, explanation: 'Emergency fund (20% of income)', confidence: 85 }
          ]
        };
      }
      if (lowerInput.includes('income')) {
        return {
          response: "For income, consider all sources: salary, freelance work, investments, side hustles. A typical range is $3,000-$6,000/month for most households.",
          suggestions: [
            { field: 'salary', value: 4500, explanation: 'Primary job income', confidence: 70 },
            { field: 'freelance', value: 800, explanation: 'Side work income', confidence: 60 }
          ]
        };
      }
    }

    // Tax Estimator suggestions
    if (tool.includes('Tax')) {
      if (lowerInput.includes('deduction') || lowerInput.includes('expense')) {
        return {
          response: "Here are common business deductions for self-employed individuals:",
          suggestions: [
            { field: 'homeOffice', value: 1500, explanation: 'Home office deduction (simplified method)', confidence: 80 },
            { field: 'equipment', value: 2000, explanation: 'Computer, software, tools', confidence: 75 },
            { field: 'vehicle', value: 3000, explanation: 'Business vehicle expenses', confidence: 70 },
            { field: 'healthInsurance', value: 4800, explanation: 'Self-employed health insurance', confidence: 85 }
          ]
        };
      }
      if (lowerInput.includes('rate') || lowerInput.includes('percentage')) {
        return {
          response: "Tax rates vary by income level. Self-employment tax is 15.3%, plus federal income tax (10-37% brackets).",
          suggestions: [
            { field: 'taxRate', value: 25, explanation: 'Combined effective rate estimate', confidence: 75 }
          ]
        };
      }
    }

    // Debt Snowball suggestions
    if (tool.includes('Debt')) {
      if (lowerInput.includes('credit card') || lowerInput.includes('debt')) {
        return {
          response: "I'll help you set up a debt payoff plan. Here are typical credit card scenarios:",
          suggestions: [
            { field: 'creditCard1', value: { balance: 3500, minPayment: 85, rate: 18.99 }, explanation: 'High-interest credit card', confidence: 80 },
            { field: 'creditCard2', value: { balance: 1200, minPayment: 35, rate: 22.99 }, explanation: 'Store credit card', confidence: 75 },
            { field: 'extraPayment', value: 200, explanation: 'Additional monthly payment', confidence: 85 }
          ]
        };
      }
    }

    // Freelance Proposal suggestions
    if (tool.includes('Freelance') || tool.includes('Proposal')) {
      if (lowerInput.includes('rate') || lowerInput.includes('price')) {
        return {
          response: "Freelance rates vary by skill and experience. Here are market-rate suggestions:",
          suggestions: [
            { field: 'hourlyRate', value: 75, explanation: 'Mid-level freelancer rate', confidence: 70 },
            { field: 'contingency', value: 10, explanation: 'Standard project buffer', confidence: 90 }
          ]
        };
      }
      if (lowerInput.includes('milestone') || lowerInput.includes('project')) {
        return {
          response: "Here's a typical project breakdown for web development:",
          suggestions: [
            { field: 'discovery', value: { hours: 20, description: 'Research and planning' }, explanation: 'Project foundation', confidence: 85 },
            { field: 'development', value: { hours: 40, description: 'Core development work' }, explanation: 'Main deliverable', confidence: 90 },
            { field: 'testing', value: { hours: 15, description: 'QA and deployment' }, explanation: 'Quality assurance', confidence: 80 }
          ]
        };
      }
    }

    // Net Worth suggestions
    if (tool.includes('Net Worth')) {
      if (lowerInput.includes('asset') || lowerInput.includes('worth')) {
        return {
          response: "Here are common assets to track for net worth calculation:",
          suggestions: [
            { field: 'checking', value: 5000, explanation: 'Checking account balance', confidence: 70 },
            { field: 'savings', value: 15000, explanation: 'Emergency fund savings', confidence: 75 },
            { field: 'retirement', value: 45000, explanation: '401k/IRA balance', confidence: 65 },
            { field: 'home', value: 250000, explanation: 'Home market value', confidence: 60 }
          ]
        };
      }
    }

    // Savings Goal suggestions
    if (tool.includes('Savings')) {
      if (lowerInput.includes('goal') || lowerInput.includes('target')) {
        return {
          response: "Here are popular savings goals with realistic targets:",
          suggestions: [
            { field: 'emergency', value: { target: 10000, monthly: 500 }, explanation: '6-month emergency fund', confidence: 90 },
            { field: 'vacation', value: { target: 5000, monthly: 300 }, explanation: 'Annual vacation fund', confidence: 80 },
            { field: 'downPayment', value: { target: 50000, monthly: 1000 }, explanation: 'House down payment', confidence: 75 }
          ]
        };
      }
    }

    // Generic helpful response
    return {
      response: `I can help you with the ${tool}! Try asking me about specific fields you'd like help with, or say "fill everything" for complete suggestions.`,
      suggestions: []
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await getAISuggestions(inputValue);
      
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.response,
        suggestions: aiResponse.suggestions?.reduce((acc, suggestion) => {
          acc[suggestion.field] = suggestion.value;
          return acc;
        }, {} as Record<string, any>),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm having trouble right now. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestions = (suggestions: Record<string, any>) => {
    if (onBulkFill) {
      onBulkFill(suggestions);
    }
    
    // Show success message
    const successMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: "Great! I've filled in the suggested values. You can always adjust them as needed.",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, successMessage]);
  };

  const quickPrompts = [
    "Help me fill everything out",
    "What should I enter here?",
    "Suggest realistic numbers",
    "Explain this field"
  ];

  if (!visible) return null;

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-40"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {/* AI Assistant Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold">AI Form Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          {showDisclaimer && (
            <div className="p-3 bg-yellow-50 border-b border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-800">
                  <p className="font-medium mb-1">AI Suggestions Disclaimer</p>
                  <p>These are general suggestions only. Not financial, legal, or professional advice.</p>
                  <button
                    onClick={() => setShowDisclaimer(false)}
                    className="text-yellow-600 hover:text-yellow-700 underline mt-1"
                  >
                    Got it, hide this
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Suggestions */}
                  {message.suggestions && Object.keys(message.suggestions).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleApplySuggestions(message.suggestions!)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition-colors"
                      >
                        <Zap className="w-4 h-4 inline mr-1" />
                        Apply These Suggestions
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInputValue(prompt)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about this form..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};