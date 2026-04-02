/**
 * Advanced SEO optimization utilities
 */

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage?: string;
  structuredData?: any;
}

export class SEOOptimizer {
  private static instance: SEOOptimizer;
  
  static getInstance(): SEOOptimizer {
    if (!SEOOptimizer.instance) {
      SEOOptimizer.instance = new SEOOptimizer();
    }
    return SEOOptimizer.instance;
  }

  updatePageSEO(data: SEOData): void {
    // Update title
    document.title = data.title;

    // Update meta description
    this.updateMetaTag('description', data.description);

    // Update keywords
    this.updateMetaTag('keywords', data.keywords.join(', '));

    // Update canonical URL
    this.updateLinkTag('canonical', data.canonicalUrl);

    // Update Open Graph tags
    this.updateMetaProperty('og:title', data.title);
    this.updateMetaProperty('og:description', data.description);
    this.updateMetaProperty('og:url', data.canonicalUrl);
    
    if (data.ogImage) {
      this.updateMetaProperty('og:image', data.ogImage);
    }

    // Update Twitter Card tags
    this.updateMetaTag('twitter:title', data.title);
    this.updateMetaTag('twitter:description', data.description);

    // Add structured data
    if (data.structuredData) {
      this.addStructuredData(data.structuredData);
    }

    // Update breadcrumbs
    this.updateBreadcrumbs(data.canonicalUrl);
  }

  private updateMetaTag(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  private updateMetaProperty(property: string, content: string): void {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  private updateLinkTag(rel: string, href: string): void {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
  }

  private addStructuredData(data: any): void {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  private updateBreadcrumbs(url: string): void {
    const pathSegments = new URL(url).pathname.split('/').filter(Boolean);
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        ...pathSegments.map((segment, index) => ({
          "@type": "ListItem",
          "position": index + 2,
          "name": segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          "item": `${window.location.origin}/${pathSegments.slice(0, index + 1).join('/')}`
        }))
      ]
    };

    this.addStructuredData(breadcrumbs);
  }

  generateSitemap(): string {
    const baseUrl = window.location.origin;
    const urls = [
      { loc: baseUrl, priority: '1.0', changefreq: 'weekly' },
      ...tools.map(tool => ({
        loc: `${baseUrl}/${tool.id}`,
        priority: '0.8',
        changefreq: 'monthly'
      }))
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <priority>${url.priority}</priority>
    <changefreq>${url.changefreq}</changefreq>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('')}
</urlset>`;
  }

  trackPageView(toolId?: string): void {
    // Enhanced analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        tool_id: toolId,
        user_engagement: this.calculateEngagementScore()
      });
    }
  }

  private calculateEngagementScore(): number {
    // Calculate engagement based on time on page, interactions, etc.
    const timeOnPage = Date.now() - (window as any).pageLoadTime;
    const interactions = (window as any).interactionCount || 0;
    
    return Math.min(100, (timeOnPage / 1000) + (interactions * 10));
  }
}

// Initialize page load time tracking
(window as any).pageLoadTime = Date.now();
(window as any).interactionCount = 0;

// Track interactions
document.addEventListener('click', () => {
  (window as any).interactionCount++;
});

export const seoOptimizer = SEOOptimizer.getInstance();