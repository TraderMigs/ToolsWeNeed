import React, { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hexToCmyk = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const rp = r / 255, gp = g / 255, bp = b / 255;
  const k = 1 - Math.max(rp, gp, bp);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round((1 - rp - k) / (1 - k) * 100),
    m: Math.round((1 - gp - k) / (1 - k) * 100),
    y: Math.round((1 - bp - k) / (1 - k) * 100),
    k: Math.round(k * 100),
  };
};

const getContrastColor = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

const colorNames: Record<string, string> = {
  '#ff0000': 'Red', '#00ff00': 'Lime', '#0000ff': 'Blue', '#ffff00': 'Yellow',
  '#ff00ff': 'Magenta', '#00ffff': 'Cyan', '#ffffff': 'White', '#000000': 'Black',
  '#808080': 'Gray', '#ffa500': 'Orange', '#800080': 'Purple', '#008000': 'Green',
  '#800000': 'Maroon', '#000080': 'Navy', '#ff69b4': 'Hot Pink', '#ffd700': 'Gold',
};

export const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#3b82f6');
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = hexToCmyk(color);
  const contrastColor = getContrastColor(color);
  const colorName = colorNames[color.toLowerCase()] || 'Custom';

  const copyValue = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const CopyRow = ({ label, value, id }: { label: string; value: string; id: string }) => (
    <div className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
      <div>
        <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
        <p className="text-white font-mono text-sm mt-0.5">{value}</p>
      </div>
      <button onClick={() => copyValue(value, id)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
        {copied === id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
      </button>
    </div>
  );

  const shades = [10, 20, 30, 40, 50, 60, 70, 80, 90].map(pct => {
    const { r, g, b } = hexToRgb(color);
    const blend = (c: number) => Math.round(c + (255 - c) * (1 - pct / 100));
    const nr = blend(r).toString(16).padStart(2, '0');
    const ng = blend(g).toString(16).padStart(2, '0');
    const nb = blend(b).toString(16).padStart(2, '0');
    return `#${nr}${ng}${nb}`;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
        <div className="h-40 w-full transition-colors duration-200" style={{ backgroundColor: color }}>
          <div className="h-full flex items-center justify-center">
            <span className="text-2xl font-bold font-mono" style={{ color: contrastColor }}>
              {color.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-400">Pick Color:</label>
            <input
              type="color" value={color}
              onChange={e => setColor(e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text" value={color}
              onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setColor(e.target.value); }}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-blue-500"
              maxLength={7}
            />
          </div>
          <p className="text-sm text-gray-400">Color name: <span className="text-white">{colorName}</span></p>
        </div>
      </div>

      <div className="space-y-2">
        <CopyRow label="HEX" value={color.toUpperCase()} id="hex" />
        <CopyRow label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} id="rgb" />
        <CopyRow label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} id="hsl" />
        <CopyRow label="CMYK" value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} id="cmyk" />
        <CopyRow label="CSS Variable" value={`--color-primary: ${color};`} id="css" />
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-3">Tint Scale</p>
        <div className="grid grid-cols-9 gap-1 rounded-xl overflow-hidden">
          {shades.map((shade, i) => (
            <button
              key={shade}
              onClick={() => setColor(shade)}
              title={shade}
              className="h-12 transition-transform hover:scale-105"
              style={{ backgroundColor: shade }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
