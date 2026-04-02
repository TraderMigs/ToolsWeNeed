import React from 'react';
import { SocialShareButtons } from './SocialShareButtons';
import { FeedbackButton } from './FeedbackButton';
import { ToolSEOContent } from './ToolSEOContent';
import { trackEvent } from '../utils/analytics';

interface ToolPageProps {
  tool: any;
  onBack: () => void;
  children?: React.ReactNode;
}

export const ToolPage: React.FC<ToolPageProps> = ({ tool, onBack, children }) => {
  React.useEffect(() => {
    // Track tool view
    trackEvent(tool.id, 'view');
  }, [tool.id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onBack}
                className="flex items-center text-white/80 hover:text-white transition-colors min-h-[44px]"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Tools
              </button>
              
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {tool.category}
                </span>
                <button
                  onClick={() => {
                    try {
                      if (navigator.share) {
                        navigator.share({
                          title: tool.title,
                          text: tool.description,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                      trackEvent(tool.id, 'share');
                    } catch (error) {
                      console.error('Error sharing:', error);
                    }
                  }}
                  className="text-xs sm:text-sm px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors min-h-[44px]"
                >
                  Share This Tool
                </button>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{tool.title}</h1>
            <p className="text-white/90 text-lg leading-relaxed">{tool.description}</p>
          </div>

          <div className="p-6 bg-gray-800">
            {children}
            
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <SocialShareButtons 
                    toolName={tool.title}
                    toolId={tool.id}
                    description={tool.description}
                  />
                  <FeedbackButton toolId={tool.id} toolName={tool.title} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ToolSEOContent tool={tool} />
    </div>
  );
};