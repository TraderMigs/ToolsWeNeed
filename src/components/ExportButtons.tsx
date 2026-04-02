import React, { useState } from 'react';
import { Download, FileText, Table, FileSpreadsheet, File, Image, Lock, CreditCard, X } from 'lucide-react';
import { env } from '../utils/env';
import { trackExport } from '../utils/exportAnalytics';
import { createCheckoutSession } from '../utils/paymentUtils';
import { storeExportData } from '../utils/storageUtils';
import { getProductByToolId } from '../stripe-config';
import { measure } from '../utils/performance';
import { 
  exportToJSON, 
  exportToCSV, 
  exportToExcel, 
  exportToPDF, 
  exportToTXT, 
  exportToPNG,
  generateFilename 
} from '../utils/exportUtils';
import { EnhancedExportPreview } from './EnhancedExportPreview';
import { CheckoutLoadingState } from './CheckoutLoadingState';

interface ExportButtonsProps {
  data: any;
  toolId?: string;
  filename: string;
  title: string;
  csvData?: any[];
  elementId?: string;
}

interface ExportPreview {
  format: string;
  content: string;
  filename: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  data, 
  toolId = '',
  filename, 
  title, 
  csvData,
  elementId = 'export-content'
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [preview, setPreview] = useState<ExportPreview | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showCheckoutLoading, setShowCheckoutLoading] = useState(false);
  const [paidExports, setPaidExports] = useState<Set<string>>(new Set());
  
  // Get product configuration
  const product = getProductByToolId(toolId || '');
  const exportPriceDollars = product.price;
  const stripeProductId = product.priceId;

  const generatePreview = async (format: string): Promise<string> => {
    const baseFilename = generateFilename(filename, format);
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        if (!csvData || csvData.length === 0) return '';
        const headers = Object.keys(csvData[0]);
        const csvContent = [
          headers.join(','),
          ...csvData.map(row => 
            headers.map(header => {
              const value = row[header];
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            }).join(',')
          )
        ].join('\n');
        return csvContent;
      case 'txt':
        let content = `${title}\n`;
        content += `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;
        content += `Created with ToolsWeNeed.com\n`;
        content += '='.repeat(60) + '\n\n';
        
        if (data.summary || data.totals || data.results) {
          content += 'SUMMARY\n';
          content += '-'.repeat(20) + '\n';
          
          const summaryData = data.summary || data.totals || data.results;
          Object.entries(summaryData).forEach(([key, value]) => {
            const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            content += `${displayKey}: ${value}\n`;
          });
          content += '\n';
        }
        
        return content;
      case 'pdf':
        return `PDF Preview for: ${title}\n\nThis would be a formatted PDF document containing:\n- Summary data\n- Detailed calculations\n- Professional formatting\n- Charts and tables\n\nGenerated: ${new Date().toLocaleDateString()}`;
      default:
        return 'Preview not available for this format';
    }
  };

  const handlePreviewExport = async (format: string) => {
    setIsExporting(true);
    setSelectedFormat(format);
    
    // Track export preview event
    trackExport(title, format as any, 'preview');
    
    try {
      const previewContent = await measure(`generate_preview_${format}`, () => generatePreview(format));
      const baseFilename = generateFilename(filename, format);
      
      setPreview({
        format,
        content: previewContent,
        filename: `${baseFilename}.${format}`
      });
      
      setShowModal(false);
      setShowPreview(true);
      setShowPaywall(true);
    } catch (error) {
      console.error(`Error generating preview for ${format}:`, error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePayment = async (format: string) => {
    setIsProcessingPayment(true);
    setShowCheckoutLoading(true);
    
    // Track paid export event
    trackExport(title, selectedFormat as any, 'paid', exportPriceDollars);
    
    try {
      // Validate environment before proceeding
      if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
        throw new Error('Service configuration error. Please contact support.');
      }
      
      if (!env.STRIPE_PUBLISHABLE_KEY) {
        throw new Error('Payment processing is not available. Please contact support.');
      }
      
      // Generate session ID for data storage
      const tempSessionId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const exportData = {
        data,
        csvData,
        title
      };
      
      // Store export data (both localStorage and Supabase)
      await storeExportData(tempSessionId, exportData);
      
      // Create a checkout session with Stripe
      const response = await createCheckoutSession({
        priceId: stripeProductId,
        successUrl: `${window.location.origin}/?session_id={CHECKOUT_SESSION_ID}&payment_success=true&temp_session_id=${tempSessionId}&format=${format}&filename=${filename}`,
        cancelUrl: `${window.location.origin}/payment-canceled.html`,
        metadata: {
          toolId: toolId || '',
          format: format,
          filename: filename,
          title: title,
          temp_session_id: tempSessionId
        }
      });
      
      if (response.url) {
        // Redirect to Stripe Checkout
        setShowCheckoutLoading(false);
        window.location.href = response.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // Show more specific error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Payment Error: ${errorMessage}`);
      
      setIsProcessingPayment(false);
      setShowCheckoutLoading(false);
    }
  };

  const handleCleanExport = async (format: string) => {
    const baseFilename = generateFilename(filename, format);
    
    // Track export in Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'export_download', {
        'event_category': 'exports',
        'event_label': title,
        'value': 1,
        'format': format,
        'tool_id': toolId || 'unknown'
      });
    }
    
    try {
      switch (format) {
        case 'json':
          exportToJSON(data, baseFilename);
          break;
        case 'csv':
          if (csvData && csvData.length > 0) {
            exportToCSV(csvData, baseFilename);
          }
          break;
        case 'excel':
          if (csvData && csvData.length > 0) {
            exportToExcel(csvData, baseFilename);
          }
          break;
        case 'pdf':
          exportToPDF(data, baseFilename, title, csvData);
          break;
        case 'txt':
          exportToTXT(data, baseFilename, title);
          break;
        case 'png':
          await exportToPNG(elementId, baseFilename, title);
          break;
      }
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
    }
  };

  const exportOptions = [
    {
      format: 'pdf',
      label: 'PDF Report',
      icon: FileText,
      description: 'Professional formatted report',
      available: true
    },
    {
      format: 'csv',
      label: 'CSV Data',
      icon: Table,
      description: 'Spreadsheet-compatible data',
      available: csvData && csvData.length > 0
    },
    {
      format: 'excel',
      label: 'Excel Workbook',
      icon: FileSpreadsheet,
      description: 'Full Excel file with formatting',
      available: csvData && csvData.length > 0
    },
    {
      format: 'txt',
      label: 'Text File',
      icon: FileText,
      description: 'Plain text format',
      available: true
    },
    {
      format: 'json',
      label: 'JSON Data',
      icon: File,
      description: 'Structured data format',
      available: true
    },
    {
      format: 'png',
      label: 'PNG Image',
      icon: Image,
      description: 'Screenshot-style image',
      available: true
    }
  ].filter(option => option.available);

  return (
    <>
      <CheckoutLoadingState
        isVisible={showCheckoutLoading}
        productName={product.name}
        price={product.price}
      />
      
      <button
        onClick={() => setShowModal(true)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg transition-all duration-200 font-medium text-white shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-sm sm:text-base"
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        {isExporting ? 'Generating Preview...' : 'Export'}
      </button>
      
      {/* Export Format Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-white">Choose Export Format</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm">
              Select your preferred format to preview before download.
            </p>
            
            <div className="space-y-2 sm:space-y-3">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.format}
                    onClick={() => handlePreviewExport(option.format)}
                    disabled={isExporting}
                    className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
                  >
                    <div className="flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-blue-300 text-sm sm:text-base">
                        {option.label}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {option.description}
                      </div>
                    </div>
                    <div className="text-gray-500 group-hover:text-gray-400 text-lg">
                      →
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Watermarked Preview Modal */}
      {showPreview && preview && showPaywall && (
        <EnhancedExportPreview
          content={preview.content}
          format={preview.format}
          filename={preview.filename}
          onDownload={() => handlePayment(preview.format)}
          onClose={() => {
            setShowPreview(false);
            setShowPaywall(false);
          }}
        />
      )}
    </>
  );
};