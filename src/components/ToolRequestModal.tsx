import React, { useState } from 'react';
import { X, Send, Check, AlertCircle } from 'lucide-react';
import { env } from '../utils/env';
import { trackEvent } from '../utils/analytics';

interface ToolRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolRequestModal: React.FC<ToolRequestModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reason: '',
    expensive_link: '',
    email: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      setSubmitStatus('error');
      setErrorMessage('Please provide a tool name and description.');
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
      
      const response = await fetch(`${supabaseUrl}/rest/v1/tool_requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit tool request');
      }
      
      setSubmitStatus('success');
      
      // Track tool request submission
      trackEvent('tool_request', 'submit');
      
      // Track event in analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'tool_request', {
          'event_category': 'engagement',
          'event_label': formData.title
        });
      }
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          reason: '',
          expensive_link: '',
          email: ''
        });
        
        // Close modal after showing success message
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 2000);
      }, 500);
    } catch (error) {
      console.error('Error submitting tool request:', error);
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
          <h3 className="text-xl font-bold text-white">Request a Tool</h3>
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
            <h4 className="text-lg font-medium text-white mb-2">Thanks for your suggestion!</h4>
            <p className="text-gray-300">
              If enough users request this, we'll build it for free.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitStatus === 'error' && (
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-300">{errorMessage || 'Failed to submit request. Please try again.'}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name of the Tool*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Freelance Invoice Generator"
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                What does the tool do?*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what you'd like this tool to do..."
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Why do you need it? (Optional)
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Tell us why this tool would be helpful to you..."
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                rows={2}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Link to expensive version (Optional)
              </label>
              <input
                type="url"
                name="expensive_link"
                value={formData.expensive_link}
                onChange={handleChange}
                placeholder="https://example.com/paid-tool"
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email (Optional, for follow-up only)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll only use this to notify you if we build your requested tool.
              </p>
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
                    Submit Tool Request
                  </>
                )}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              * Required fields
            </p>
          </form>
        )}
      </div>
    </div>
  );
};