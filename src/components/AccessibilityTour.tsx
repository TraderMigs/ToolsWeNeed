import React, { useState, useEffect } from 'react';
import { Eye, Type, Contrast, Volume2, X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  feature: string;
  icon: React.ComponentType<any>;
  action?: () => void;
}

export const AccessibilityTour: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Accessibility Features Available',
      description: 'We\'ve built this site to be accessible to everyone. Let us show you the available options.',
      feature: 'overview',
      icon: Eye
    },
    {
      id: 'font-size',
      title: 'Adjustable Font Sizes',
      description: 'Change text size to your preference. Choose from Small, Medium, Large, or Extra Large.',
      feature: 'fontSize',
      icon: Type,
      action: () => {
        // Temporarily highlight the font size controls
        const root = document.documentElement;
        root.style.fontSize = '18px';
        setTimeout(() => {
          root.style.fontSize = '16px';
        }, 2000);
      }
    },
    {
      id: 'contrast',
      title: 'High Contrast Mode',
      description: 'Switch to high contrast colors for better visibility and reduced eye strain.',
      feature: 'contrast',
      icon: Contrast,
      action: () => {
        // Temporarily enable high contrast
        document.documentElement.classList.add('high-contrast');
        setTimeout(() => {
          document.documentElement.classList.remove('high-contrast');
        }, 3000);
      }
    },
    {
      id: 'motion',
      title: 'Reduced Motion',
      description: 'Disable animations and transitions if they cause discomfort or distraction.',
      feature: 'motion',
      icon: Volume2
    },
    {
      id: 'access-panel',
      title: 'Accessibility Panel',
      description: 'Find all these options in the accessibility panel. Look for the eye icon in the bottom left.',
      feature: 'panel',
      icon: Eye,
      action: () => {
        // Highlight the accessibility button
        const button = document.querySelector('[aria-label="Open accessibility settings"]');
        if (button) {
          (button as HTMLElement).style.boxShadow = '0 0 0 3px #3B82F6';
          setTimeout(() => {
            (button as HTMLElement).style.boxShadow = '';
          }, 3000);
        }
      }
    }
  ];

  useEffect(() => {
    // Check if user has seen the accessibility tour
    const hasSeenAccessibilityTour = localStorage.getItem('accessibility_tour_completed');
    const isFirstVisit = !localStorage.getItem('user_has_visited');
    
    if (!hasSeenAccessibilityTour && isFirstVisit) {
      // Show tour after a brief delay on first visit
      setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    }
    
    if (!isFirstVisit) {
      localStorage.setItem('user_has_visited', 'true');
    }
    
    setHasSeenTour(!!hasSeenAccessibilityTour);
  }, []);

  const handleNext = () => {
    const step = tourSteps[currentStep];
    if (step.action) {
      step.action();
    }

    if (currentStep < tourSteps.length - 1) {
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
    localStorage.setItem('accessibility_tour_completed', 'true');
    setIsVisible(false);
    setHasSeenTour(true);
  };

  const handleSkip = () => {
    localStorage.setItem('accessibility_tour_completed', 'true');
    setIsVisible(false);
    setHasSeenTour(true);
  };

  // Show accessibility reminder for returning users
  const showAccessibilityReminder = () => {
    setIsVisible(true);
    setCurrentStep(0);
  };

  if (!isVisible) {
    // Show subtle reminder for users who have completed the tour
    if (hasSeenTour) {
      return (
        <button
          onClick={showAccessibilityReminder}
          className="fixed bottom-20 left-4 bg-blue-600/80 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-40"
          title="Accessibility features available"
          aria-label="Show accessibility tour"
        >
          <Eye className="w-4 h-4" />
        </button>
      );
    }
    return null;
  }

  const currentStepData = tourSteps[currentStep];
  const Icon = currentStepData.icon;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white rounded-t-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Accessibility Features</h2>
            <button
              onClick={handleSkip}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Skip tour"
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
          <div className="text-sm mt-2 text-white/80">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Feature Demo Area */}
          {currentStepData.feature === 'fontSize' && (
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300 mb-2">Font size preview:</p>
              <div className="space-y-2">
                <p style={{ fontSize: '14px' }}>Small text example</p>
                <p style={{ fontSize: '16px' }}>Medium text example</p>
                <p style={{ fontSize: '18px' }}>Large text example</p>
                <p style={{ fontSize: '20px' }}>Extra large text example</p>
              </div>
            </div>
          )}

          {currentStepData.feature === 'contrast' && (
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300 mb-2">Contrast comparison:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-600 text-gray-300 p-2 rounded text-center text-sm">
                  Normal contrast
                </div>
                <div className="bg-black text-white p-2 rounded text-center text-sm border border-white">
                  High contrast
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-500' : 
                    index < currentStep ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Skip Option */}
          <div className="mt-4 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Skip tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for managing accessibility tour
export const useAccessibilityTour = () => {
  const [shouldShowTour, setShouldShowTour] = useState(false);

  const triggerTour = () => {
    setShouldShowTour(true);
  };

  const resetTour = () => {
    localStorage.removeItem('accessibility_tour_completed');
    setShouldShowTour(true);
  };

  return {
    shouldShowTour,
    triggerTour,
    resetTour
  };
};