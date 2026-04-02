export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_Sg1wxYyiyWknGV',
    priceId: 'price_1RkfscRrIlnVe6VQvu5kFiFo',
    name: 'Resume Builder Pro',
    description: '$7 Tools We Need - Resume',
    price: 7.00,
    mode: 'payment'
  },
  {
    id: 'prod_Sg1vqihidz4gme',
    priceId: 'price_1RkfrqRrIlnVe6VQ9JIqfPm4',
    name: 'Premium Export',
    description: '$2 Tools We Need',
    price: 2.00,
    mode: 'payment'
  }
];

export const getProductByToolId = (toolId: string): StripeProduct => {
  if (toolId === 'resume-builder-pro') {
    return stripeProducts[0]; // Resume product
  }
  return stripeProducts[1]; // Default export product
};

export const getProductById = (productId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === productId);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};