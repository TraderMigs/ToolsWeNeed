import React, { useState, useEffect } from 'react';
import { Check, Download, ArrowLeft, ExternalLink } from 'lucide-react';
import { verifyCheckoutSession, getCheckoutSession } from '../utils/paymentUtils';
import { env } from '../utils/env';
import { getProductByPriceId, getProductByToolId } from '../stripe-config';

interface PaymentSuccessPageProps {
  sessionId: string;
  onBack: () => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({
  sessionId,
  onBack
}) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    verifyPayment();
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      setIsVerifying(true);
      
      // Get the temp session ID from URL for data retrieval
      const urlParams = new URLSearchParams(window.location.search);
      const tempSessionId = urlParams.get('temp_session_id');
      const format = urlParams.get('format') || 'pdf';
      const filename = urlParams.get('filename') || 'export';
      
      console.log('Payment verification started:', { sessionId, tempSessionId, format, filename });
      
      // Verify the payment was successful
      const verified = await verifyCheckoutSession(sessionId);
      
      console.log('Payment verification result:', verified);
      
      if (verified) {
        // Get session details
        const session = await getCheckoutSession(sessionId);
        setSessionData(session);
        
        console.log('Session details retrieved:', session);
        
        // Get product information
        const productInfo = getProductByToolId('default');
        setProduct(productInfo);
        
        // Store temp session ID for download
        if (tempSessionId) {
          setSessionData(prev => ({ 
            ...prev, 
            tempSessionId, 
            format, 
            filename 
          }));
        }
        
        setIsVerified(true);
        setDownloadReady(true);
        
        console.log('Payment verification completed successfully');
      } else {
        console.error('Payment verification failed');
        setError('Payment verification failed. Please contact support.');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError(`Unable to verify payment: ${err.message}. Please contact support.`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownload = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tempSessionId = urlParams.get('temp_session_id');
      const format = urlParams.get('format') || 'pdf';
      const filename = urlParams.get('filename') || 'export';
      
      if (!tempSessionId) {
        console.error('❌ Missing temp_session_id for download');
        throw new Error('Download session not found. Please contact support.');
      }
      
      console.log('🚀 Starting download:', { tempSessionId, format, filename });
      
      // Add retry logic for race conditions
      let retries = 3;
      let lastError;
      
      while (retries > 0) {
        try {
          await attemptDownload(tempSessionId, format, filename);
          console.log('✅ Download completed successfully');
          return;
        } catch (error) {
          lastError = error;
          retries--;
          if (retries > 0) {
            console.log(`⏳ Download attempt failed, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
          }
        }
      }
      
      throw lastError;
    } catch (error) {
      console.error('💥 Download error:', error);
      setError(`Download failed: ${error.message}. Please contact support.`);
    }
  };
  
  const attemptDownload = async (tempSessionId: string, format: string, filename: string) => {
    try {
      // Trigger download from the secure export function
      const supabaseUrl = env.SUPABASE_URL;
      const supabaseAnonKey = env.SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase configuration missing:', { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey });
        throw new Error('Configuration error');
      }
      
      const functionUrl = `${supabaseUrl}/functions/v1/generate-secure-export`;
      
      console.log('Calling Supabase function:', functionUrl);
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          sessionId: tempSessionId,
          format,
          filename,
          toolId: 'default'
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download request failed:', { status: response.status, statusText: response.statusText, errorText });
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('Download completed successfully');
      
    } catch (error) {
      console.error('Download error:', error);
      setError(`Download failed: ${error.message}. Please contact support.`);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verifying Payment</h1>
          <p className="text-gray-300">
            Please wait while we confirm your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Tools
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-300 mb-6">
          Thank you for your purchase. Your download is ready.
        </p>

        {product && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-white mb-1">{product.name}</h3>
            <p className="text-sm text-gray-400">{product.description}</p>
            <p className="text-lg font-bold text-green-400 mt-2">${product.price.toFixed(2)}</p>
          </div>
        )}

        <div className="space-y-3">
          {downloadReady && (
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Download Your File
            </button>
          )}
          
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Tools
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          You'll also receive an email confirmation shortly.
        </div>
      </div>
    </div>
  );
};