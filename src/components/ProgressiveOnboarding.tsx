import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, X, Lightbulb, ArrowRight } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component?: React.ReactNode;
  validation?: () => boolean;
  optional?: boolean;
}

interface ProgressiveOnboardingProps {
  toolName: string;
  steps: OnboardingStep[];
  onComplete: (data: any) => void;
  onSkip?: () => void;
  initialData?: any;
}

export const ProgressiveOnboarding: React.FC<ProgressiveOnboardingProps> = ({
  toolName,
  steps,
  onComplete,
  onSkip,
  initialData = {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Check if user has seen onboarding for this tool before
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(`onboarding_${toolName}_completed`);
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
    }
  }, [toolName]);

  const handleNext = () => {
    const step = steps[currentStep];
    
    // Validate current step if validation function exists
    if (step.validation && !step.validation()) {
      return; // Don't proceed if validation fails
    }

    // Mark step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`onboarding_${toolName}_completed`, 'true');
    setShowOnboarding(false);
    onComplete(formData);
  };

  const handleSkip = () => {
    localStorage.setItem(`onboarding_${toolName}_completed`, 'true');
    setShowOnboarding(false);
    if (onSkip) {
      onSkip();
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  if (!showOnboarding) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Getting Started with {toolName}</h2>
            <button
              onClick={handleSkip}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm mt-2 text-white/80">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              {currentStepData.title}
            </h3>
            <p className="text-gray-300">{currentStepData.description}</p>
          </div>

          {/* Step Content */}
          <div className="mb-6 min-h-[200px]">
            {currentStepData.component || (
              <div className="text-center py-8 text-gray-400">
                <p>Step content will be rendered here</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-500'
                      : completedSteps.has(index)
                      ? 'bg-green-500'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentStepData.optional && (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Skip
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Check className="w-4 h-4" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Skip All Option */}
          <div className="mt-4 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Skip setup and start using the tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for managing onboarding state
export const useProgressiveOnboarding = (toolName: string) => {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(`onboarding_${toolName}_completed`);
    const hasToolData = localStorage.getItem(`twn_${toolName}_data`);
    
    // Show onboarding if user hasn't seen it and doesn't have existing data
    if (!hasSeenOnboarding && !hasToolData) {
      setShouldShowOnboarding(true);
    }
  }, [toolName]);

  const resetOnboarding = () => {
    localStorage.removeItem(`onboarding_${toolName}_completed`);
    setShouldShowOnboarding(true);
  };

  return {
    shouldShowOnboarding,
    setShouldShowOnboarding,
    resetOnboarding
  };
};

// Predefined onboarding flows for different tools
export const getOnboardingSteps = (toolName: string): OnboardingStep[] => {
  switch (toolName) {
    case 'budget-card-conveyor':
      return [
        {
          id: 'welcome',
          title: 'Welcome to Budget Planning',
          description: 'Let\'s set up your budget in just a few steps. This will help you track income and expenses effectively.',
          component: (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💰</div>
              <p className="text-gray-300">
                We'll guide you through creating a comprehensive budget that works for your lifestyle.
              </p>
            </div>
          )
        },
        {
          id: 'income',
          title: 'Add Your Income Sources',
          description: 'Start by adding your primary income sources. You can add more later.',
          component: (
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">💡 Quick Tip</h4>
                <p className="text-sm text-gray-300">
                  Include all income sources: salary, freelance work, investments, side hustles, etc.
                </p>
              </div>
              <div className="text-center text-gray-400">
                <p>You'll add your actual income in the next screen</p>
              </div>
            </div>
          )
        },
        {
          id: 'expenses',
          title: 'Plan Your Expense Categories',
          description: 'Think about your main expense categories. We\'ll help you organize them.',
          component: (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Savings'].map(category => (
                  <div key={category} className="bg-gray-700 rounded-lg p-3 text-center">
                    <span className="text-white">{category}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 text-center">
                These are common categories. You can customize them in the tool.
              </p>
            </div>
          )
        },
        {
          id: 'ready',
          title: 'You\'re All Set!',
          description: 'Ready to start building your budget. Remember, you can always adjust and refine as you go.',
          component: (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-300 mb-4">
                Your budget tool is ready to use. Start by adding your first income or expense item.
              </p>
              <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  💡 Pro tip: Use the "Advanced Mode" for more detailed tracking options
                </p>
              </div>
            </div>
          )
        }
      ];

    case 'debt-snowball-tracker':
      return [
        {
          id: 'welcome',
          title: 'Start Your Debt-Free Journey',
          description: 'The debt snowball method helps you pay off debts systematically, building momentum as you go.',
          component: (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">❄️</div>
              <p className="text-gray-300 mb-4">
                We'll help you organize your debts and create a payoff strategy that works.
              </p>
              <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  The snowball method focuses on paying smallest balances first for psychological wins
                </p>
              </div>
            </div>
          )
        },
        {
          id: 'strategy',
          title: 'Choose Your Strategy',
          description: 'There are two main approaches to debt payoff. Choose the one that motivates you most.',
          component: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">🏔️ Debt Snowball</h4>
                  <p className="text-sm text-gray-300">
                    Pay smallest balances first. Great for motivation and quick wins.
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">⚡ Debt Avalanche</h4>
                  <p className="text-sm text-gray-300">
                    Pay highest interest rates first. Saves more money mathematically.
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'gather',
          title: 'Gather Your Debt Information',
          description: 'You\'ll need some basic information about each debt. Don\'t worry, you can add them one by one.',
          component: (
            <div className="space-y-4">
              <div className="bg-yellow-600/20 border border-yellow-500 rounded-lg p-4">
                <h4 className="font-medium text-yellow-300 mb-2">📋 What You'll Need</h4>
                <ul className="text-sm text-yellow-200 space-y-1">
                  <li>• Current balance for each debt</li>
                  <li>• Minimum monthly payment</li>
                  <li>• Interest rate (APR)</li>
                  <li>• Creditor name (optional)</li>
                </ul>
              </div>
              <p className="text-sm text-gray-400 text-center">
                Don't have all the details? You can start with what you know and update later.
              </p>
            </div>
          )
        }
      ];

    case 'self-employed-tax-estimator':
      return [
        {
          id: 'welcome',
          title: 'Simplify Your Tax Planning',
          description: 'As a self-employed individual, tax planning can be complex. We\'ll break it down into manageable steps.',
          component: (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-300 mb-4">
                Get accurate tax estimates and plan your quarterly payments with confidence.
              </p>
            </div>
          )
        },
        {
          id: 'income-types',
          title: 'Understanding Income Types',
          description: 'Different types of income are taxed differently. Let\'s identify what applies to you.',
          component: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">1099 Income</h4>
                  <p className="text-sm text-gray-300">
                    Freelance, consulting, contract work. Subject to self-employment tax.
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">W2 Income</h4>
                  <p className="text-sm text-gray-300">
                    Traditional employment. Employer handles payroll taxes.
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'deductions',
          title: 'Maximize Your Deductions',
          description: 'Business deductions can significantly reduce your tax burden. We\'ll help you identify them.',
          component: (
            <div className="space-y-4">
              <div className="bg-green-600/20 border border-green-500 rounded-lg p-4">
                <h4 className="font-medium text-green-300 mb-2">💡 Common Deductions</h4>
                <ul className="text-sm text-green-200 space-y-1">
                  <li>• Home office expenses</li>
                  <li>• Equipment and software</li>
                  <li>• Professional development</li>
                  <li>• Health insurance premiums</li>
                  <li>• Vehicle expenses</li>
                </ul>
              </div>
            </div>
          )
        }
      ];

    case 'fasting-planner':
      return [
        {
          id: 'welcome',
          title: 'Welcome to Intermittent Fasting',
          description: 'Intermittent fasting can be a powerful tool for health and wellness. Let\'s find the right approach for you.',
          component: (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⏰</div>
              <p className="text-gray-300 mb-4">
                We'll help you choose a fasting schedule that fits your lifestyle and goals.
              </p>
            </div>
          )
        },
        {
          id: 'experience',
          title: 'What\'s Your Experience Level?',
          description: 'Your experience with fasting helps us recommend the best starting point.',
          component: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <h4 className="font-medium text-white mb-2">🌱 Beginner</h4>
                  <p className="text-sm text-gray-300">New to fasting</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <h4 className="font-medium text-white mb-2">🚀 Intermediate</h4>
                  <p className="text-sm text-gray-300">Some experience</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <h4 className="font-medium text-white mb-2">⭐ Advanced</h4>
                  <p className="text-sm text-gray-300">Experienced faster</p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'schedule',
          title: 'Choose Your Fasting Schedule',
          description: 'Based on your experience, here are the recommended fasting windows.',
          component: (
            <div className="space-y-4">
              <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
                <h4 className="font-medium text-blue-300 mb-2">Recommended: 16:8</h4>
                <p className="text-sm text-blue-200">
                  Fast for 16 hours, eat within 8 hours. Perfect for beginners.
                </p>
              </div>
              <p className="text-sm text-gray-400 text-center">
                You can always adjust your schedule as you progress.
              </p>
            </div>
          )
        }
      ];

    default:
      return [
        {
          id: 'welcome',
          title: `Welcome to ${toolName}`,
          description: 'Let\'s get you started with this tool.',
          component: (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🛠️</div>
              <p className="text-gray-300">
                This tool will help you achieve your goals more effectively.
              </p>
            </div>
          )
        }
      ];
  }
};

// Component for showing onboarding trigger
export const OnboardingTrigger: React.FC<{
  toolName: string;
  onStart: () => void;
}> = ({ toolName, onStart }) => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(`onboarding_${toolName}_completed`);
    if (hasSeenOnboarding) {
      setDismissed(true);
    }
  }, [toolName]);

  if (dismissed) return null;

  return (
    <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-blue-400" />
          <div>
            <h4 className="font-medium text-blue-300">New to this tool?</h4>
            <p className="text-sm text-blue-200">Take a quick guided tour to get the most out of it.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onStart}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
          >
            Start Tour
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};