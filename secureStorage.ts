import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

export interface ExportData {
  [key: string]: any;
}

export const exportToJSON = (data: ExportData, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, `${filename}.json`);
};

export const exportToCSV = (data: ExportData[], filename: string) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

export const exportToExcel = (data: ExportData[], filename: string, sheetName: string = 'Data') => {
  if (!data || data.length === 0) return;
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  saveAs(blob, `${filename}.xlsx`);
};

export const exportToPDF = (data: ExportData, filename: string, title: string, csvData?: ExportData[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 20, 25);
  
  // Add subtitle
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 35);
  doc.text('Created with ToolsWeNeed.com', 20, 42);
  
  let yPosition = 55;
  
  // Add summary data if available
  if (data.summary || data.totals || data.results) {
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Summary', 20, yPosition);
    yPosition += 10;
    
    const summaryData = data.summary || data.totals || data.results;
    Object.entries(summaryData).forEach(([key, value]) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      const displayValue = typeof value === 'number' ? 
        (key.toLowerCase().includes('rate') || key.toLowerCase().includes('percentage') ? 
          `${value.toFixed(1)}%` : 
          key.toLowerCase().includes('cost') || key.toLowerCase().includes('income') || key.toLowerCase().includes('payment') ? 
            `$${value.toFixed(2)}` : 
            value.toString()) : 
        String(value);
      
      doc.text(`${displayKey}: ${displayValue}`, 20, yPosition);
      yPosition += 8;
    });
    
    yPosition += 10;
  }
  
  // Add table if CSV data is available
  if (csvData && csvData.length > 0) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Detailed Data', 20, yPosition);
    yPosition += 10;
    
    const headers = Object.keys(csvData[0]);
    const rows = csvData.map(row => headers.map(header => {
      const value = row[header];
      return typeof value === 'number' ? value.toFixed(2) : String(value);
    }));
    
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: yPosition,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 10, right: 20, bottom: 20, left: 20 },
    });
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10);
    doc.text('ToolsWeNeed.com - Free Tools Forever', 20, doc.internal.pageSize.height - 10);
  }
  
  doc.save(`${filename}.pdf`);
};

export const exportToTXT = (data: ExportData, filename: string, title: string) => {
  let content = `${title}\n`;
  content += `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;
  content += `Created with ToolsWeNeed.com\n`;
  content += '='.repeat(60) + '\n\n';
  
  // Add summary section
  if (data.summary || data.totals || data.results) {
    content += 'SUMMARY\n';
    content += '-'.repeat(20) + '\n';
    
    const summaryData = data.summary || data.totals || data.results;
    Object.entries(summaryData).forEach(([key, value]) => {
      const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      const displayValue = typeof value === 'number' ? 
        (key.toLowerCase().includes('rate') || key.toLowerCase().includes('percentage') ? 
          `${value.toFixed(1)}%` : 
          key.toLowerCase().includes('cost') || key.toLowerCase().includes('income') || key.toLowerCase().includes('payment') ? 
            `$${value.toFixed(2)}` : 
            value.toString()) : 
        String(value);
      
      content += `${displayKey}: ${displayValue}\n`;
    });
    content += '\n';
  }
  
  // Add detailed data
  Object.entries(data).forEach(([key, value]) => {
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
  content += 'Visit us for more free financial, health, and productivity tools!\n';
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  saveAs(blob, `${filename}.txt`);
};

export const exportToPNG = async (elementId: string, filename: string, title: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn('Element not found for PNG export, using document body');
    // Fallback to document body if specific element not found
    const fallbackElement = document.body;
    return generatePNGFromElement(fallbackElement, filename, title);
  }
  
  return generatePNGFromElement(element, filename, title);
};

const generatePNGFromElement = async (element: HTMLElement, filename: string, title: string) => {
  try {
    // Create a wrapper div with title and branding
    const wrapper = document.createElement('div');
    wrapper.style.padding = '20px';
    wrapper.style.backgroundColor = '#ffffff';
    wrapper.style.fontFamily = 'Arial, sans-serif';
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.style.width = 'auto';
    wrapper.style.minWidth = '800px';
    
    // Add title
    const titleElement = document.createElement('h1');
    titleElement.textContent = title;
    titleElement.style.color = '#333';
    titleElement.style.marginBottom = '10px';
    titleElement.style.fontSize = '24px';
    titleElement.style.fontWeight = 'bold';
    
    // Add subtitle
    const subtitleElement = document.createElement('p');
    subtitleElement.textContent = `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
    subtitleElement.style.color = '#666';
    subtitleElement.style.marginBottom = '20px';
    subtitleElement.style.fontSize = '12px';
    
    // Clone the original element
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.backgroundColor = '#ffffff';
    clonedElement.style.color = '#333333';
    
    // Add branding footer
    const footerElement = document.createElement('p');
    footerElement.textContent = 'Created with ToolsWeNeed.com - Free Tools Forever';
    footerElement.style.color = '#999';
    footerElement.style.marginTop = '20px';
    footerElement.style.fontSize = '10px';
    footerElement.style.textAlign = 'center';
    
    wrapper.appendChild(titleElement);
    wrapper.appendChild(subtitleElement);
    wrapper.appendChild(clonedElement);
    wrapper.appendChild(footerElement);
    
    document.body.appendChild(wrapper);
    
    const canvas = await html2canvas(wrapper, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });
    
    document.body.removeChild(wrapper);
    
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${filename}.png`);
      }
    }, 'image/png');
  } catch (error) {
    console.error('Error generating PNG:', error);
  }
};

export const generateFilename = (toolName: string, format: string) => {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-');
  return `toolsweneed-${toolName}-${timestamp}`;
};