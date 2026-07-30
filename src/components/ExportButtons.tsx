import React, { useState } from 'react';
import { Download, File, FileSpreadsheet, FileText, Image, Table, X } from 'lucide-react';
import { trackExport } from '../utils/exportAnalytics';
import {
  exportToCSV,
  exportToExcel,
  exportToJSON,
  exportToPDF,
  exportToPNG,
  exportToTXT,
  generateFilename,
  type ExportData,
} from '../utils/exportUtils';

interface ExportButtonsProps {
  data: ExportData;
  toolId?: string;
  filename: string;
  title: string;
  csvData?: Record<string, unknown>[];
  elementId?: string;
}

type ExportFormat = 'pdf' | 'csv' | 'excel' | 'txt' | 'json' | 'png';

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  data,
  toolId = '',
  filename,
  title,
  csvData,
  elementId = 'export-content',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');

  const exportOptions = [
    { format: 'pdf' as const, label: 'PDF Report', icon: FileText, description: 'Formatted local report' },
    ...(csvData?.length
      ? [
          { format: 'csv' as const, label: 'CSV Data', icon: Table, description: 'Spreadsheet-compatible data' },
          { format: 'excel' as const, label: 'Excel Workbook', icon: FileSpreadsheet, description: 'Local Excel workbook' },
        ]
      : []),
    { format: 'txt' as const, label: 'Text File', icon: FileText, description: 'Plain-text summary' },
    { format: 'json' as const, label: 'JSON Data', icon: File, description: 'Structured local data' },
    { format: 'png' as const, label: 'PNG Image', icon: Image, description: 'Image of the tool results' },
  ];

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setError('');
    const baseFilename = generateFilename(filename, format);

    try {
      switch (format) {
        case 'json':
          exportToJSON(data, baseFilename);
          break;
        case 'csv':
          exportToCSV(csvData ?? [], baseFilename);
          break;
        case 'excel':
          exportToExcel(csvData ?? [], baseFilename);
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

      trackExport(toolId || title, format, 'download');
      setShowModal(false);
    } catch (exportError) {
      console.error(`Error exporting ${format}:`, exportError);
      setError('The export could not be created. Your data remains on this device.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={isExporting}
        className="flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:from-green-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-base"
      >
        <Download className="h-5 w-5" aria-hidden="true" />
        {isExporting ? 'Exporting…' : 'Export free'}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowModal(false);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-gray-700 bg-gray-800 p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="export-dialog-title">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 id="export-dialog-title" className="text-xl font-bold text-white">Download your results</h3>
                <p className="mt-1 text-sm text-gray-400">Exports are free and generated on this device.</p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="flex min-h-[44px] min-w-[44px] items-center justify-center text-gray-400 hover:text-white" aria-label="Close export dialog">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    type="button"
                    key={option.format}
                    onClick={() => void handleExport(option.format)}
                    disabled={isExporting}
                    className="flex min-h-[60px] w-full items-center gap-4 rounded-lg bg-gray-700 p-4 text-left transition hover:bg-gray-600 disabled:opacity-50"
                  >
                    <Icon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                    <span>
                      <span className="block font-medium text-white">{option.label}</span>
                      <span className="block text-sm text-gray-400">{option.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {error && <p className="mt-4 text-sm text-red-300" role="alert">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
};
