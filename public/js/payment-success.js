// Payment Success Page JavaScript
// This file handles the download process after successful Stripe payment

// Global variables
let exportData = null;
let urlParams = null;
let debugMode = false;

// Debug logging
function debugLog(message, data = null) {
  console.log('[Payment Success]', message, data);
  if (debugMode) {
    const debugSection = document.getElementById('debug-section');
    const debugInfo = document.getElementById('debug-info');
    if (debugSection && debugInfo) {
      debugSection.style.display = 'block';
      debugInfo.textContent += `${new Date().toISOString()}: ${message}\n${data ? JSON.stringify(data, null, 2) : ''}\n\n`;
    }
  }
}

// Show error with details
function showError(message, details = null) {
  debugLog('Error occurred', { message, details });
  
  const loadingSection = document.getElementById('loading-section');
  const downloadSection = document.getElementById('download-section');
  const errorSection = document.getElementById('error-section');
  const errorMessage = document.getElementById('error-message');
  
  if (loadingSection) loadingSection.style.display = 'none';
  if (downloadSection) downloadSection.style.display = 'none';
  if (errorSection) errorSection.style.display = 'block';
  if (errorMessage) errorMessage.textContent = message;
  
  // Enable debug mode on error
  debugMode = true;
  debugLog('Error details', details);
}

// Show download ready
function showDownloadReady() {
  debugLog('Download ready');
  
  const loadingSection = document.getElementById('loading-section');
  const downloadSection = document.getElementById('download-section');
  
  if (loadingSection) loadingSection.style.display = 'none';
  if (downloadSection) downloadSection.style.display = 'block';
}

// Generate and download file
function generateAndDownloadFile(exportData, format, filename) {
  try {
    debugLog('Generating file', { format, filename, hasData: !!exportData });
    
    if (!exportData || !exportData.data) {
      throw new Error('No export data available');
    }
    
    let content = '';
    let mimeType = '';
    let fileExtension = format;
    
    switch (format) {
      case 'json':
        content = JSON.stringify(exportData.data, null, 2);
        mimeType = 'application/json';
        break;
        
      case 'csv':
        if (exportData.csvData && exportData.csvData.length > 0) {
          const headers = Object.keys(exportData.csvData[0]);
          content = [
            headers.join(','),
            ...exportData.csvData.map(row => 
              headers.map(header => {
                const value = row[header];
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                  return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
              }).join(',')
            )
          ].join('\n');
          mimeType = 'text/csv';
        } else {
          throw new Error('No CSV data available for this export');
        }
        break;
        
      case 'txt':
        content = `${exportData.title || filename}\n`;
        content += `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;
        content += `Created with ToolsWeNeed.com - Free Tools Forever\n`;
        content += '='.repeat(60) + '\n\n';
        
        if (exportData.data.summary || exportData.data.totals || exportData.data.results) {
          content += 'SUMMARY\n';
          content += '-'.repeat(20) + '\n';
          
          const summaryData = exportData.data.summary || exportData.data.totals || exportData.data.results;
          Object.entries(summaryData).forEach(([key, value]) => {
            const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            content += `${displayKey}: ${value}\n`;
          });
          content += '\n';
        }
        
        // Add detailed data
        Object.entries(exportData.data).forEach(([key, value]) => {
          if (key === 'summary' || key === 'totals' || key === 'results') return;
          
          const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          content += `${displayKey.toUpperCase()}\n`;
          content += '-'.repeat(displayKey.length) + '\n';
          
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              content += `${index + 1}. `;
              if (typeof item === 'object' && item !== null) {
                Object.entries(item).forEach(([itemKey, itemValue]) => {
                  const itemDisplayKey = itemKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  content += `${itemDisplayKey}: ${itemValue} | `;
                });
                content = content.slice(0, -3); // Remove last " | "
              } else {
                content += String(item);
              }
              content += '\n';
            });
          } else if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([subKey, subValue]) => {
              const subDisplayKey = subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              content += `  ${subDisplayKey}: ${subValue}\n`;
            });
          } else {
            content += String(value);
          }
          content += '\n\n';
        });
        
        content += '\n' + '='.repeat(60) + '\n';
        content += 'Generated with ToolsWeNeed.com - Free Tools Forever\n';
        mimeType = 'text/plain';
        break;
        
      case 'pdf':
        // For PDF, we'll generate a text version since we can't generate actual PDFs in the browser easily
        content = `PDF Export: ${exportData.title || filename}\n\n`;
        content += `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;
        content += `Created with ToolsWeNeed.com\n\n`;
        
        if (exportData.data.summary || exportData.data.totals || exportData.data.results) {
          content += 'SUMMARY\n';
          content += '========\n';
          
          const summaryData = exportData.data.summary || exportData.data.totals || exportData.data.results;
          Object.entries(summaryData).forEach(([key, value]) => {
            const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            content += `${displayKey}: ${value}\n`;
          });
          content += '\n';
        }
        
        content += 'This is a text version of your PDF export.\n';
        content += 'For a formatted PDF, please contact support.\n';
        mimeType = 'text/plain';
        fileExtension = 'txt';
        break;
        
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    
    if (!content) {
      throw new Error('No content generated for download');
    }
    
    debugLog('File content generated', { contentLength: content.length, mimeType });
    
    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${fileExtension}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    debugLog('Download triggered successfully');
    
    // Update UI
    const downloadButton = document.getElementById('download-button');
    if (downloadButton) {
      downloadButton.textContent = 'Download Complete ✓';
      downloadButton.disabled = true;
      downloadButton.style.backgroundColor = '#10B981';
    }
    
    return true;
  } catch (error) {
    debugLog('Error generating file', error);
    throw error;
  }
}

// Retry download function
function retryDownload() {
  debugLog('Retrying download');
  const loadingSection = document.getElementById('loading-section');
  const errorSection = document.getElementById('error-section');
  
  if (loadingSection) loadingSection.style.display = 'block';
  if (errorSection) errorSection.style.display = 'none';
  
  // Retry the download process
  setTimeout(processDownload, 1000);
}

// Main download processing function
function processDownload() {
  try {
    debugLog('Processing download', urlParams);
    
    const stripeSessionId = urlParams.get('session_id');
    const dataSessionId = urlParams.get('temp_session_id');
    const format = urlParams.get('format') || 'pdf';
    const filename = urlParams.get('filename') || 'export';
    
    if (!stripeSessionId) {
      throw new Error('No Stripe session ID found in URL');
    }
    
    if (!dataSessionId) {
      throw new Error('No data session ID found in URL');
    }
    
    debugLog('URL parameters', { stripeSessionId, dataSessionId, format, filename });
    
    // ✅ TRY TO FETCH FROM SUPABASE SERVER FIRST
    fetchFromServer(dataSessionId, format, filename)
      .then(() => {
        debugLog('Successfully downloaded from server');
        showDownloadReady();
      })
      .catch(serverError => {
        debugLog('Server fetch failed, trying localStorage fallback', serverError);
        
        // Fallback to localStorage
        // Try multiple localStorage key patterns
        const possibleKeys = [
          `export_data_${dataSessionId}`,
          dataSessionId,
          urlParams.get('export_key')
        ].filter(Boolean);
        
        let foundData = null;
        let usedKey = null;
        
        for (const key of possibleKeys) {
          const storedData = localStorage.getItem(key);
          if (storedData) {
            try {
              foundData = JSON.parse(storedData);
              usedKey = key;
              break;
            } catch (parseError) {
              debugLog(`Error parsing localStorage data for key ${key}`, parseError);
            }
          }
        }
        
        if (foundData) {
          exportData = foundData;
          debugLog('Export data retrieved from localStorage fallback', { usedKey });
          generateAndDownloadFile(exportData, format, filename);
          showDownloadReady();
          if (usedKey) localStorage.removeItem(usedKey);
        } else {
          debugLog('No export data found in localStorage', { triedKeys: possibleKeys });
          throw new Error('Export data not found in server or localStorage');
        }
      });
    
  } catch (error) {
    debugLog('Error in processDownload', error);
    showError(error.message, error);
  }
}

// ✅ FETCH FROM SUPABASE SERVER
async function fetchFromServer(dataSessionId, format, filename) {
  // 🔥 NUCLEAR FIX: Get export_key from URL instead of temp_session_id
  const urlParams = new URLSearchParams(window.location.search);
  const exportKey = urlParams.get('export_key');
  const sessionId = urlParams.get('session_id');
  
  if (!exportKey || !sessionId) {
    throw new Error('Missing export_key or session_id in URL parameters');
  }
  
  // Use the actual Supabase URL from environment
  const supabaseUrl = 'https://your-project-ref.supabase.co'; // Replace with actual URL
  const supabaseAnonKey = 'your-anon-key'; // Replace with actual key
  
  debugLog('Fetching from server', { exportKey, sessionId, supabaseUrl: supabaseUrl.substring(0, 20) + '...' });
  
  // 🔥 NUCLEAR FIX: Query export_sessions table to get export data
  const response = await fetch(`${supabaseUrl}/rest/v1/export_sessions?session_id=eq.${sessionId}&status=eq.paid`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    debugLog('Server error response', { status: response.status, statusText: response.statusText, errorText });
    throw new Error(`Server responded with ${response.status}: ${response.statusText}. ${errorText}`);
  }
  
  const sessions = await response.json();
  
  if (!sessions || sessions.length === 0) {
    throw new Error('Export session not found or payment not confirmed');
  }
  
  const exportSession = sessions[0];
  
  // Now fetch the actual export data using the export_key
  const exportResponse = await fetch(`${supabaseUrl}/functions/v1/generate-secure-export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`
    },
    body: JSON.stringify({
      exportKey: exportSession.export_key,
      format: exportSession.format,
      filename: exportSession.filename,
      sessionId: sessionId
    })
  });
  
  if (!exportResponse.ok) {
    const errorText = await exportResponse.text();
    debugLog('Export generation error', { status: exportResponse.status, errorText });
    throw new Error(`Export generation failed: ${exportResponse.status}`);
  }
  
  const blob = await exportResponse.blob();
  
  if (blob.size === 0) {
    throw new Error('Empty file received from server');
  }
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${format}`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  debugLog('File downloaded successfully from server');
}

// Setup download button click handler
function setupDownloadButton() {
  const downloadButton = document.getElementById('download-button');
  if (downloadButton) {
    downloadButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (exportData) {
        const format = urlParams.get('format') || 'pdf';
        const filename = urlParams.get('filename') || 'export';
        
        try {
          generateAndDownloadFile(exportData, format, filename);
        } catch (error) {
          showError('Download failed: ' + error.message, error);
        }
      } else {
        showError('Export data not available');
      }
    });
  }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
  debugLog('Payment success page loaded');
  
  // Get URL parameters
  urlParams = new URLSearchParams(window.location.search);
  
  // Check if we're in debug mode
  debugMode = urlParams.get('debug') === 'true' || window.location.hostname === 'localhost';
  
  debugLog('URL parameters', Object.fromEntries(urlParams.entries()));
  
  // Setup download button
  setupDownloadButton();
  
  // Start processing download after a short delay
  setTimeout(processDownload, 2000);
  
  // Auto-trigger download after 5 seconds if everything is ready
  setTimeout(() => {
    const downloadButton = document.getElementById('download-button');
    if (downloadButton && !downloadButton.disabled && exportData) {
      debugLog('Auto-triggering download');
      downloadButton.click();
    }
  }, 5000);
});