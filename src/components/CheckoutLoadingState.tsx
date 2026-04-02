import React from 'react';
import { Loader, CreditCard, Shield, Lock } from 'lucide-react';

interface CheckoutLoadingStateProps {
  isVisible: boolean;
  productName: string;
  price: number;
}

export const CheckoutLoadingState: React.FC<CheckoutLoadingStateProps> = ({
  isVisible,
  productName,
  price
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 text-center border border-gray-700">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Preparing Checkout</h3>
          <p className="text-gray-300">
            Setting up secure payment for {productName}
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">{productName}</span>
            <span className="font-bold text-white">${price.toFixed(2)}</span>
          </div>
          <div className="text-sm text-gray-400">One-time payment</div>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-4 h-4" />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" />
            <span>Stripe</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          You'll be redirected to Stripe's secure checkout page
        </div>
      </div>
    </div>
  );
};