# Tools We Need

A comprehensive collection of free online tools for finance, health, and productivity.

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_APP_ENV`: Set to "development" for local development
   - `VITE_GA_TRACKING_ID`: Your Google Analytics tracking ID (optional for development)

## Development

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

## Supabase Edge Functions

This project uses Supabase Edge Functions for server-side operations. To deploy them:

1. Navigate to each function directory:
   ```bash
   cd supabase/functions/stripe-checkout
   ```

2. Deploy the function:
   ```bash
   supabase functions deploy stripe-checkout --no-verify-jwt
   ```

3. Repeat for other functions:
   - `stripe-webhook`
   - `verify-payment`
   - `generate-secure-export`
   - `store-export-data`

## Deployment

Build the production version:
```bash
npm run build
```

See `DEPLOYMENT.md` for detailed deployment instructions.

## Features

- Multiple financial calculators and tools
- Health and productivity trackers
- Export functionality with Stripe payment integration
- Resume Builder Pro with AI-powered features
- Responsive design for all devices

## License

All rights reserved. © 2025 ToolsWeNeed.com