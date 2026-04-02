import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { getToolMetadata } from '../data/toolMetadata';
import { generateToolSchema } from '../utils/seoUtils'; 
import { FeedbackButton } from './FeedbackButton';
import { toolCategories } from '../data/tools';

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tags: string;
  usageCount?: number;
  exportCount?: number;
}

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
  isTrending?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, isTrending = false }) => {
  const Icon = tool.icon;
  const metadata = getToolMetadata(tool.id);
  const toolUrl = `https://toolsweneed.com/${tool.id}`;
  const toolSchema = generateToolSchema(tool, metadata, toolUrl);
  const category = toolCategories[tool.category];

  return (
    <div
      onClick={onClick}
      data-tags={tool.tags}
      className={`bg-gray-800 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105 border min-h-[160px] flex flex-col justify-center relative overflow-hidden ${
        isTrending 
          ? 'border-yellow-400/40 hover:border-yellow-400/60 shadow-lg shadow-yellow-500/5' 
          : 'border-gray-700 hover:border-blue-500/30'
      }`}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      <meta itemProp="name" content={tool.title} />
      <meta itemProp="url" content={toolUrl} />
      <meta itemProp="applicationCategory" content="WebApplication" />
      <meta itemProp="operatingSystem" content="Web Browser" />
      {metadata && <meta itemProp="description" content={metadata.metaDescription} />}
      
      {/* Add JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      
      {/* Modern Trending Badge */}
      {isTrending && (
        <div className="absolute top-0 right-0 overflow-hidden">
          {/* Animated gradient corner */}
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full opacity-20 animate-pulse"></div>
          
          {/* Main trending badge */}
          <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-3 py-1 rounded-bl-lg rounded-tr-2xl font-medium text-xs shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <span className="animate-bounce">🔥</span>
              <span className="font-bold tracking-wide">TRENDING</span>
            </div>
          </div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-bl-lg rounded-tr-2xl blur-sm"></div>
        </div>
      )}
      
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl ${tool.color} flex items-center justify-center mb-3 sm:mb-4 shadow-lg relative ${
          isTrending ? 'ring-2 ring-yellow-400/30 ring-offset-2 ring-offset-gray-800' : ''
        }`}>
          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          {category && (
            <span className="absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
              {category.name.split(' ')[0]}
            </span>
          )}
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight" itemProp="headline">{tool.title}</h3>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-3" itemProp="abstract">{tool.description}</p>
        {tool.usageCount && (
          <p className="text-xs text-gray-500 mt-1">
            Used by {tool.usageCount.toLocaleString()} users
          </p>
        )}
        {tool.exportCount && (
          <p className="text-xs text-gray-500 mt-1">
            Exported {tool.exportCount.toLocaleString()} times
          </p>
        )}
        {metadata && (
          <p className="text-xs text-gray-500 mt-2 sm:mt-3 leading-relaxed line-clamp-2" itemProp="additionalDescription">
            {metadata.toolDescription}
          </p>
        )}
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <FeedbackButton 
            toolId={tool.id} 
            toolName={tool.title} 
            variant="text" 
            label="Feedback" 
            className="text-xs"
            showIcon={false}
          />
        </div>
      </div>
    </div>
  );
};