import React, { useState, useEffect } from 'react';
import { Crown, Check, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { env } from '../utils/env';

interface SubscriptionStatusProps {
  userId?: string;
  compact?: boolean;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  userId,
  compact = false
}) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      loadSubscriptionData();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const loadSubscriptionData = async () => {
    try {
      const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
      
      // Get active subscription
      const { data: subscriptionData } = await supabase
        .from('stripe_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      
      if (subscriptionData) {
        setSubscription(subscriptionData);
      }
      
      // Get recent orders
      const { data: ordersData } = await supabase
        .from('stripe_orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (ordersData) {
        setOrders(ordersData);
      }
      
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {subscription ? (
          <>
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">Premium</span>
          </>
        ) : orders.length > 0 ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Customer</span>
          </>
        ) : (
          <>
            <X className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Free</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
      
      {subscription ? (
        <div className="bg-yellow-600/20 border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="font-medium text-yellow-300">Premium Subscriber</span>
          </div>
          <p className="text-sm text-yellow-200">
            Plan: {subscription.plan_name}
          </p>
          <p className="text-xs text-yellow-300 mt-1">
            Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-300">Free User</span>
          </div>
          <p className="text-sm text-gray-400">
            All tools are free to use. Premium exports available for purchase.
          </p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-white mb-2">Recent Purchases</h4>
          <div className="space-y-2">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="bg-gray-700 rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{order.product_name}</span>
                  <span className="text-sm font-medium text-green-400">
                    ${(order.amount_total / 100).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};