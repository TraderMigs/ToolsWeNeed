import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

type Category = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'data';

const conversions: Record<Category, { label: string; units: { name: string; factor: number; offset?: number }[] }> = {
  length: {
    label: 'Length',
    units: [
      { name: 'Millimeter (mm)', factor: 0.001 },
      { name: 'Centimeter (cm)', factor: 0.01 },
      { name: 'Meter (m)', factor: 1 },
      { name: 'Kilometer (km)', factor: 1000 },
      { name: 'Inch (in)', factor: 0.0254 },
      { name: 'Foot (ft)', factor: 0.3048 },
      { name: 'Yard (yd)', factor: 0.9144 },
      { name: 'Mile (mi)', factor: 1609.344 },
      { name: 'Nautical Mile', factor: 1852 },
    ]
  },
  weight: {
    label: 'Weight / Mass',
    units: [
      { name: 'Milligram (mg)', factor: 0.000001 },
      { name: 'Gram (g)', factor: 0.001 },
      { name: 'Kilogram (kg)', factor: 1 },
      { name: 'Metric Ton (t)', factor: 1000 },
      { name: 'Ounce (oz)', factor: 0.0283495 },
      { name: 'Pound (lb)', factor: 0.453592 },
      { name: 'Stone (st)', factor: 6.35029 },
      { name: 'US Ton', factor: 907.185 },
    ]
  },
  temperature: {
    label: 'Temperature',
    units: [
      { name: 'Celsius (°C)', factor: 1 },
      { name: 'Fahrenheit (°F)', factor: 1 },
      { name: 'Kelvin (K)', factor: 1 },
    ]
  },
  area: {
    label: 'Area',
    units: [
      { name: 'Square Millimeter', factor: 0.000001 },
      { name: 'Square Centimeter', factor: 0.0001 },
      { name: 'Square Meter', factor: 1 },
      { name: 'Square Kilometer', factor: 1000000 },
      { name: 'Square Inch', factor: 0.00064516 },
      { name: 'Square Foot', factor: 0.092903 },
      { name: 'Square Yard', factor: 0.836127 },
      { name: 'Acre', factor: 4046.86 },
      { name: 'Hectare', factor: 10000 },
    ]
  },
  volume: {
    label: 'Volume',
    units: [
      { name: 'Milliliter (ml)', factor: 0.001 },
      { name: 'Liter (L)', factor: 1 },
      { name: 'Cubic Meter (m³)', factor: 1000 },
      { name: 'Teaspoon (US)', factor: 0.00492892 },
      { name: 'Tablespoon (US)', factor: 0.0147868 },
      { name: 'Fluid Ounce (US)', factor: 0.0295735 },
      { name: 'Cup (US)', factor: 0.236588 },
      { name: 'Pint (US)', factor: 0.473176 },
      { name: 'Quart (US)', factor: 0.946353 },
      { name: 'Gallon (US)', factor: 3.78541 },
    ]
  },
  speed: {
    label: 'Speed',
    units: [
      { name: 'Meter/second (m/s)', factor: 1 },
      { name: 'Kilometer/hour (km/h)', factor: 0.277778 },
      { name: 'Mile/hour (mph)', factor: 0.44704 },
      { name: 'Knot', factor: 0.514444 },
      { name: 'Foot/second (ft/s)', factor: 0.3048 },
    ]
  },
  data: {
    label: 'Data Storage',
    units: [
      { name: 'Bit (b)', factor: 1 },
      { name: 'Byte (B)', factor: 8 },
      { name: 'Kilobyte (KB)', factor: 8192 },
      { name: 'Megabyte (MB)', factor: 8388608 },
      { name: 'Gigabyte (GB)', factor: 8589934592 },
      { name: 'Terabyte (TB)', factor: 8796093022208 },
    ]
  },
};

const convertTemperature = (value: number, from: string, to: string): number => {
  let celsius = value;
  if (from.includes('Fahrenheit')) celsius = (value - 32) * 5 / 9;
  else if (from.includes('Kelvin')) celsius = value - 273.15;
  if (to.includes('Fahrenheit')) return celsius * 9 / 5 + 32;
  if (to.includes('Kelvin')) return celsius + 273.15;
  return celsius;
};

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('Meter (m)');
  const [toUnit, setToUnit] = useState('Foot (ft)');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const cats = conversions[category];

  const convert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) { setResult(''); return; }
    let output: number;
    if (category === 'temperature') {
      output = convertTemperature(val, fromUnit, toUnit);
    } else {
      const fromFactor = cats.units.find(u => u.name === fromUnit)?.factor ?? 1;
      const toFactor = cats.units.find(u => u.name === toUnit)?.factor ?? 1;
      output = (val * fromFactor) / toFactor;
    }
    const formatted = Math.abs(output) >= 0.001 && Math.abs(output) < 1e9
      ? parseFloat(output.toPrecision(8)).toString()
      : output.toExponential(4);
    setResult(formatted);
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult('');
    setInputValue(result || inputValue);
  };

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    const first = conversions[cat].units[0].name;
    const second = conversions[cat].units[1].name;
    setFromUnit(first);
    setToUnit(second);
    setInputValue('');
    setResult('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-wrap gap-2">
        {(Object.entries(conversions) as [Category, any][]).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === key ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 items-end">
          <div>
            <label className="block text-sm text-gray-400 mb-1">From</label>
            <select
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 mb-2"
            >
              {cats.units.map(u => <option key={u.name}>{u.name}</option>)}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button onClick={swap} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors self-end mb-0">
            <ArrowLeftRight className="w-5 h-5 text-white" />
          </button>

          <div>
            <label className="block text-sm text-gray-400 mb-1">To</label>
            <select
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 mb-2"
            >
              {cats.units.map(u => <option key={u.name}>{u.name}</option>)}
            </select>
            <div className="w-full px-4 py-3 bg-gray-800 border border-green-500/40 rounded-lg text-green-400 font-mono min-h-[50px]">
              {result || <span className="text-gray-500">Result</span>}
            </div>
          </div>
        </div>

        <button
          onClick={convert}
          disabled={!inputValue}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors"
        >
          Convert
        </button>
      </div>
    </div>
  );
};
