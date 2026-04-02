import React, { useState } from 'react';
import { X, Send, Check, AlertCircle } from 'lucide-react';
import { env } from '../utils/env';
import { trackEvent } from '../utils/analytics';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId: string;
  toolName: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  isOpen, 
  onClose, 
  toolId,
  toolName
}) => {
  const [emojiRating, setEmojiRating] = useState<string>('');
  const [commentText, setCommentText] = useState('');
  const [isFlagged, setIsFlagged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emojiRating) {
      setSubmitStatus('error');
      setErrorMessage('Please select an emoji rating.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const supabaseUrl = env.SUPABASE_URL;
      const supabaseAnonKey = env.SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration is missing');
      }
      
      const response = await fetch(`${supabaseUrl}/rest/v1/tool_feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          tool_id: toolId,
          emoji_rating: emojiRating,
          comment_text: commentText,
          flagged: isFlagged,
          user_ip: '', // We'll leave this blank for privacy
          user_email: '' // We'll leave this blank for privacy
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      setSubmitStatus('success');
      
      // Track feedback submission
      trackEvent(toolId, 'feedback');
      
      // Track event in analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'tool_feedback', {
          'event_category': 'engagement',
          'event_label': toolName,
          'value': isFlagged ? 0 : 1
        });
      }
      
      // Reset form after successful submission
      setTimeout(() => {
        setEmojiRating('');
        setCommentText('');
        setIsFlagged(false);
        
        // Close modal after showing success message
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 2000);
      }, 500);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Tool Feedback</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {submitStatus === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Thanks for your feedback!</h4>
            <p className="text-gray-300">
              Your input helps us improve our tools for everyone.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitStatus === 'error' && (
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-300">{errorMessage || 'Failed to submit feedback. Please try again.'}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                How would you rate this tool?
              </label>
              <div className="flex justify-between">
                {[
                  { emoji: '😡', label: 'Angry', value: 'angry' },
                  { emoji: '😐', label: 'Neutral', value: 'neutral' },
                  { emoji: '😊', label: 'Happy', value: 'happy' },
                  { emoji: '🔥', label: 'Amazing', value: 'amazing' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setEmojiRating(option.value)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                      emojiRating === option.value
                        ? 'bg-blue-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-2xl mb-1">{option.emoji}</span>
                    <span className="text-xs">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What would make this tool better?
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
                placeholder="Share your thoughts, suggestions, or report any issues..."
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isFlagged}
                  onChange={(e) => setIsFlagged(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Flag this tool as broken or inaccurate</span>
              </label>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors font-medium text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};