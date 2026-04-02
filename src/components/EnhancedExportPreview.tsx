import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Download, Eye, Maximize2, Minimize2 } from 'lucide-react';

interface EnhancedExportPreviewProps {
  content: string;
  format: string;
  filename: string;
  onDownload: () => void;
  onClose: () => void;
}

export const EnhancedExportPreview: React.FC<EnhancedExportPreviewProps> = ({
  content,
  format,
  filename,
  onDownload,
  onClose
}) => {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 ${
      isFullscreen ? 'p-0' : ''
    }`}>
      <div className={`bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl ${
        isFullscreen ? 'w-full h-full rounded-none' : 'max-w-6xl w-full max-h-[90vh]'
      }`}>
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-750">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-white">
              Export Preview - {format.toUpperCase()}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Eye className="w-4 h-4" />
              <span>Preview Mode</span>
            </div>
          </div>
          
          {/* Preview Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-1 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-sm text-gray-300 min-w-[3rem] text-center">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="p-1 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              title="Close preview"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Enhanced Preview Content */}
        <div className="relative bg-white text-black overflow-auto" style={{ 
          height: isFullscreen ? 'calc(100vh - 140px)' : '400px',
          fontSize: `${zoom}%`
        }}>
          {/* Professional Watermark Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="text-gray-400 font-bold opacity-15 transform rotate-45 select-none"
                style={{ 
                  fontSize: 'clamp(2rem, 8vw, 4rem)',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                PREVIEW
              </div>
            </div>
            {/* Multiple watermark instances for better coverage */}
            <div className="absolute top-1/4 left-1/4 text-gray-400 text-2xl font-bold opacity-10 transform rotate-45 select-none">
              ToolsWeNeed.com
            </div>
            <div className="absolute bottom-1/4 right-1/4 text-gray-400 text-2xl font-bold opacity-10 transform rotate-45 select-none">
              ToolsWeNeed.com
            </div>
            <div className="absolute top-3/4 left-1/2 text-gray-400 text-xl font-bold opacity-8 transform rotate-45 select-none">
              PREVIEW
            </div>
          </div>
          
          {/* Actual Content */}
          <div className="relative z-0 p-6">
            <div className="mb-4 pb-4 border-b border-gray-300">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{filename}</h1>
              <p className="text-sm text-gray-600">
                Generated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
              <p className="text-xs text-gray-500">
                Created with ToolsWeNeed.com - Free Tools Forever
              </p>
            </div>
            
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {content}
            </pre>
          </div>
        </div>
        
        {/* Enhanced Footer with Value Proposition */}
        <div className="p-6 border-t border-gray-700 bg-gray-750">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Download className="w-5 h-5 text-yellow-400" />
              <h4 className="text-lg font-semibold text-white">
                Get the Clean, Professional Version
              </h4>
            </div>
            
            {/* Value highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-green-400 font-medium mb-1">✓ No Watermarks</div>
                <div className="text-gray-300">Clean, professional appearance</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-blue-400 font-medium mb-1">✓ High Quality</div>
                <div className="text-gray-300">Optimized formatting & layout</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-purple-400 font-medium mb-1">✓ Instant Download</div>
                <div className="text-gray-300">Ready to use immediately</div>
              </div>
            </div>
            
            <div className="text-3xl font-bold text-green-400 mb-2">$2.00</div>
            <p className="text-xs text-gray-400 mb-4">One-time payment • No subscription • Secure checkout</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onDownload}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg transition-all duration-200 font-medium text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              Download Clean Version
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors font-medium text-white"
            >
              Maybe Later
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              💳 Secure payment powered by Stripe • 🔒 Your data stays private
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};