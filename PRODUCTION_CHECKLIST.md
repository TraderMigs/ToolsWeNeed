# Production Deployment Checklist

## ✅ CRITICAL - Must Complete Before Launch

### Environment Variables
- [ ] Set `VITE_SUPABASE_URL` to your production Supabase URL
- [ ] Set `VITE_SUPABASE_ANON_KEY` to your production Supabase anonymous key
- [ ] Set `VITE_STRIPE_PUBLISHABLE_KEY` to your production Stripe publishable key
- [ ] Set `VITE_STRIPE_EXPORT_PRICE_ID` to your Stripe price ID for exports
- [ ] Set `VITE_STRIPE_RESUME_PRICE_ID` to your Stripe price ID for resume exports
- [ ] Set `VITE_GA_TRACKING_ID` to your Google Analytics tracking ID
- [ ] Set `VITE_APP_ENV=production`

### Stripe Configuration
- [ ] Create products in Stripe Dashboard:
  - [ ] Export product ($2.00)
  - [ ] Resume Builder Pro product ($7.00)
- [ ] Copy the Price IDs and update environment variables
- [ ] Configure webhook endpoint: `https://[your-project].supabase.co/functions/v1/stripe-webhook`
- [ ] Set webhook events: `checkout.session.completed`, `checkout.session.expired`
- [ ] Copy webhook signing secret to Supabase environment variables

### Supabase Configuration
- [ ] Deploy all Edge Functions:
  ```bash
  npm run deploy:functions
  ```
- [ ] Set Supabase environment variables:
  - [ ] `STRIPE_SECRET_KEY` (production)
  - [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] Verify database tables exist and RLS policies are active
- [ ] Test Edge Functions are responding

### Domain & Hosting
- [ ] Configure custom domain (if using)
- [ ] Update CORS settings in Supabase for production domain
- [ ] Update Stripe webhook URL for production domain
- [ ] Test SSL certificate is working

## ⚠️ IMPORTANT - Recommended Before Launch

### Content & SEO
- [ ] Replace placeholder Google Analytics ID
- [ ] Update social preview image (`public/social-preview.png`)
- [ ] Verify all tool metadata is complete
- [ ] Test social sharing links
- [ ] Submit sitemap to Google Search Console

### Testing
- [ ] Test complete payment flow with Stripe test cards
- [ ] Verify all export formats work correctly
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Verify PWA installation works

### Performance
- [ ] Run Lighthouse audit
- [ ] Optimize images if needed
- [ ] Test loading times
- [ ] Verify service worker is functioning

## 🔧 OPTIONAL - Nice to Have

### Analytics & Monitoring
- [ ] Set up error monitoring (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring

### Business
- [ ] Set up customer support email
- [ ] Create privacy policy and terms of service
- [ ] Set up backup procedures
- [ ] Plan for scaling if needed

## 🚀 Deployment Commands

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   ```bash
   npm run deploy
   ```

3. **Verify deployment:**
   ```bash
   npm run verify
   ```

## 🧪 Post-Deployment Testing

- [ ] Test payment flow with real Stripe account
- [ ] Verify webhook is receiving events
- [ ] Test export downloads work
- [ ] Check analytics are tracking
- [ ] Verify all tools load and function correctly
- [ ] Test on multiple devices and browsers

## 📞 Support Contacts

- **Stripe Support**: https://support.stripe.com
- **Supabase Support**: https://supabase.com/support
- **Netlify Support**: https://www.netlify.com/support

---

**IMPORTANT**: This application is ready for production deployment once the above checklist is completed. All core functionality is implemented and tested.