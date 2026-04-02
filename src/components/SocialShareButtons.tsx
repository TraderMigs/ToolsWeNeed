import React from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface SocialShareButtonsProps {
  toolName: string;
  toolId: string;
  description: string;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  toolName,
  toolId,
  description
}) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://toolsweneed.com/${toolId}`;
  const shareText = `Just used this free ${toolName} tool — no sign-up needed!`;
  
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(twitterUrl, '_blank');

    // Track share event
    trackEvent(toolId, 'share');
    
    // Track share event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        'event_category': 'engagement',
        'event_label': 'Twitter',
        'tool_id': toolId
      });
    }
  };
  
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookUrl, '_blank');

    // Track share event
    trackEvent(toolId, 'share');
    
    // Track share event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        'event_category': 'engagement',
        'event_label': 'Facebook',
        'tool_id': toolId
      });
    }
  };
  
  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(linkedinUrl, '_blank');

    // Track share event
    trackEvent(toolId, 'share');
    
    // Track share event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        'event_category': 'engagement',
        'event_label': 'LinkedIn',
        'tool_id': toolId
      });
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('Link copied to clipboard!');

    // Track share event
    trackEvent(toolId, 'share');
    
    // Track copy event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        'event_category': 'engagement',
        'event_label': 'Copy Link',
        'tool_id': toolId
      });
    }
  };
  
  const shareNatively = () => {
    if (navigator.share) {
      navigator.share({
        title: toolName,
        text: shareText,
        url: currentUrl
      }).catch(err => {
        // Track share error
        if (typeof gtag !== 'undefined') {
          gtag('event', 'share_error', {
            'event_category': 'error',
            'event_label': err.message,
            'tool_id': toolId
          });
        }
        console.error('Share failed:', err);
      });

      // Track share event
      trackEvent(toolId, 'share');
      
      // Track native share
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          'event_category': 'engagement',
          'event_label': 'Native Share',
          'tool_id': toolId
        });
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        onClick={shareNatively}
        className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-xs sm:text-sm"
      >
        <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>Share</span>
      </button>
      
      <button
        onClick={shareToTwitter}
        className="p-2 bg-[#1DA1F2] hover:bg-[#1a94df] rounded-lg transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      <button
        onClick={shareToFacebook}
        className="p-2 bg-[#4267B2] hover:bg-[#375694] rounded-lg transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      <button
        onClick={shareToLinkedIn}
        className="p-2 bg-[#0077B5] hover:bg-[#006396] rounded-lg transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      <button
        onClick={copyToClipboard}
        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        aria-label="Copy link"
      >
        <Link className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};