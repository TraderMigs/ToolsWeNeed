/**
 * Utility functions for SEO optimization
 */

interface Tool {
  id: string;
  title: string;
  description: string;
  tags?: string;
  category?: string;
}

interface ToolMetadata {
  title?: string;
  metaDescription?: string;
  toolDescription?: string;
}

/**
 * Generate JSON-LD schema for a tool
 */
export const generateToolSchema = (tool: Tool, metadata: ToolMetadata | null, toolUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "description": metadata?.metaDescription || tool.description,
    "url": toolUrl,
    "applicationCategory": getCategoryType(tool.category),
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "keywords": tool.tags || `${tool.title.toLowerCase()}, free calculator, online tool`,
    "featureList": metadata?.toolDescription || tool.description,
    "softwareVersion": "2025",
    "screenshot": `${toolUrl.split('/').slice(0, 3).join('/')}/tool-previews/${tool.id}.png`
  };
};

/**
 * Map tool category to schema.org applicationCategory
 */
const getCategoryType = (category?: string): string => {
  switch (category) {
    case 'financial':
    case 'trading':
      return "FinanceApplication";
    case 'wellness':
      return "HealthApplication";
    case 'planning':
      return "ProductivityApplication";
    case 'business':
      return "BusinessApplication";
    default:
      return "UtilitiesApplication";
  }
};

/**
 * Generate FAQ schema for structured data
 */
export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>, toolUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    })),
    "url": toolUrl
  };
};

/**
 * Generate breadcrumb schema for structured data
 */
export const generateBreadcrumbSchema = (tool: Tool, toolUrl: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": toolUrl.split('/').slice(0, 3).join('/')
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": tool.title,
        "item": toolUrl
      }
    ]
  };
};