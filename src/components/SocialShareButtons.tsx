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
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://www.toolsweneed.com/${toolId}`;
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

  // Uniform compact row: one labeled share pill + identical 40px icon circles
  const iconCircle = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={shareNatively}
        className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-blue-600 px-4 text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </button>

      <button onClick={shareToTwitter} className={`${iconCircle} bg-[#1DA1F2] hover:bg-[#1a94df]`} aria-label="Share on Twitter">
        <Twitter className="h-4 w-4" />
      </button>

      <button onClick={shareToFacebook} className={`${iconCircle} bg-[#4267B2] hover:bg-[#375694]`} aria-label="Share on Facebook">
        <Facebook className="h-4 w-4" />
      </button>

      <button onClick={shareToLinkedIn} className={`${iconCircle} bg-[#0077B5] hover:bg-[#006396]`} aria-label="Share on LinkedIn">
        <Linkedin className="h-4 w-4" />
      </button>

      <button onClick={copyToClipboard} className={`${iconCircle} bg-gray-700 hover:bg-gray-600`} aria-label="Copy link">
        <Link className="h-4 w-4" />
      </button>
    </div>
  );
};