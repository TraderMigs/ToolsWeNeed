import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  backgroundColor = '#374151',
  label,
  showPercentage = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-lg font-bold text-white">
            {Math.round(percentage)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-gray-400 text-center mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

interface PieChartProps {
  data: ChartData[];
  size?: number;
  showLabels?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  showLabels = true
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const center = size / 2;

  let cumulativePercentage = 0;
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
    
    const x1 = center + radius * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = center + radius * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = center + radius * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = center + radius * Math.sin((endAngle - 90) * Math.PI / 180);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    cumulativePercentage += percentage;

    return {
      ...item,
      pathData,
      percentage,
      color: item.color || colors[index % colors.length]
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size}>
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.pathData}
            fill={slice.color}
            className="hover:opacity-80 transition-opacity cursor-pointer"
            title={`${slice.label}: ${slice.percentage.toFixed(1)}%`}
          />
        ))}
      </svg>
      {showLabels && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-gray-300">
                {slice.label}: {slice.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface BarChartProps {
  data: ChartData[];
  height?: number;
  showValues?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  showValues = true
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          const color = item.color || colors[index % colors.length];
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative flex flex-col justify-end" style={{ height: height - 40 }}>
                {showValues && (
                  <div className="text-xs text-gray-300 mb-1 text-center">
                    {typeof item.value === 'number' && item.value > 1000 
                      ? `$${item.value.toLocaleString()}` 
                      : item.value}
                  </div>
                )}
                <div
                  className="w-full rounded-t transition-all duration-1000 ease-out hover:opacity-80"
                  style={{
                    height: barHeight,
                    backgroundColor: color,
                    minHeight: '4px'
                  }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-2 text-center">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface TrendLineProps {
  data: Array<{ label: string; value: number }>;
  height?: number;
  color?: string;
}

export const TrendLine: React.FC<TrendLineProps> = ({
  data,
  height = 100,
  color = '#3B82F6'
}) => {
  if (data.length < 2) return null;

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;
  const width = 300;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((item.value - minValue) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full">
      <svg width={width} height={height} className="w-full">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="transition-all duration-1000"
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((item.value - minValue) / range) * height;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className="hover:r-4 transition-all"
            />
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  );
};