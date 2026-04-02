import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Calculator, Plus, Trash2 } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';
import { saveToolData, loadToolData, clearToolData, saveToolDataWithAnalytics } from '../../utils/storageUtils';
import { SmartSuggestions } from '../SmartSuggestions';
import { AutoSaveIndicator } from '../AutoSaveIndicator';

interface TradeData {
  assetType: 'forex' | 'metals' | 'commodities' | 'stocks' | 'futures' | 'options';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  leverage: number;
  tickSize: number;
  tickValue: number;
  commission: number;
  stopLoss: number;
  takeProfit: number;
  accountCurrency: string;
  contractSize: number;
}

const assetTypes = {
  forex: {
    name: 'Forex',
    quantityLabel: 'Lot Size',
    quantityUnit: 'lots',
    defaultTickSize: 0.0001,
    defaultTickValue: 1,
    defaultContractSize: 100000,
    supportsLeverage: true,
    description: 'Currency pairs (EUR/USD, GBP/JPY, etc.)'
  },
  metals: {
    name: 'Precious Metals',
    quantityLabel: 'Ounces',
    quantityUnit: 'oz',
    defaultTickSize: 0.01,
    defaultTickValue: 1,
    defaultContractSize: 100,
    supportsLeverage: true,
    description: 'Gold, Silver, Platinum, Palladium'
  },
  commodities: {
    name: 'Commodities',
    quantityLabel: 'Contracts',
    quantityUnit: 'contracts',
    defaultTickSize: 0.01,
    defaultTickValue: 10,
    defaultContractSize: 1000,
    supportsLeverage: true,
    description: 'Oil, Gas, Agricultural products'
  },
  stocks: {
    name: 'Stocks',
    quantityLabel: 'Shares',
    quantityUnit: 'shares',
    defaultTickSize: 0.01,
    defaultTickValue: 1,
    defaultContractSize: 1,
    supportsLeverage: false,
    description: 'Individual company stocks'
  },
  futures: {
    name: 'Futures',
    quantityLabel: 'Contracts',
    quantityUnit: 'contracts',
    defaultTickSize: 0.25,
    defaultTickValue: 12.5,
    defaultContractSize: 1,
    supportsLeverage: true,
    description: 'Index futures, commodity futures'
  },
  options: {
    name: 'Options',
    quantityLabel: 'Contracts',
    quantityUnit: 'contracts',
    defaultTickSize: 0.01,
    defaultTickValue: 1,
    defaultContractSize: 100,
    supportsLeverage: false,
    description: 'Call and Put options'
  }
};

export const TradeProfitRiskCalculator: React.FC = () => {
  const [trades, setTrades] = useState<(TradeData & { id: string; name: string })[]>([]);
  const [selectedTradeId, setSelectedTradeId] = useState<string>('');
  const [newTrade, setNewTrade] = useState<TradeData & { name: string }>({
    name: '',
    assetType: 'forex',
    entryPrice: 0,
    exitPrice: 0,
    quantity: 1,
    leverage: 100,
    tickSize: 0.0001,
    tickValue: 1,
    commission: 0,
    stopLoss: 0,
    takeProfit: 0,
    accountCurrency: 'USD',
    contractSize: 100000
  });
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    try {
      const savedData = loadToolData('trade_profit_risk_calculator');
      if (savedData) {
        if (savedData.trades) setTrades(savedData.trades);
        setHasSavedData(true);
      } else {
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Auto-save data when it changes
  useEffect(() => {
    try {
      if (trades.length > 0) {
        saveToolData('trade_profit_risk_calculator', { trades });
        setHasSavedData(true);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [trades]);

  const handleClearSavedData = () => {
    try {
      clearToolData('trade_profit_risk_calculator');
      setHasSavedData(false);
      setTrades([]);
      setSelectedTradeId('');
      setNewTrade({
        name: '',
        assetType: 'forex',
        entryPrice: 0,
        exitPrice: 0,
        quantity: 1,
        leverage: 100,
        tickSize: 0.0001,
        tickValue: 1,
        commission: 0,
        stopLoss: 0,
        takeProfit: 0,
        accountCurrency: 'USD',
        contractSize: 100000
      });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const handleUseSuggestions = (suggestions: any) => {
    try {
      setNewTrade(prev => ({ ...prev, ...suggestions }));
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error applying suggestions:', error);
    }
  };

  const addTrade = () => {
    try {
      if (newTrade.name && newTrade.entryPrice > 0 && newTrade.quantity > 0) {
        const trade = {
          id: Date.now().toString(),
          ...newTrade
        };
        setTrades([...trades, trade]);
        if (!selectedTradeId) setSelectedTradeId(trade.id);
        setNewTrade({
          name: '',
          assetType: 'forex',
          entryPrice: 0,
          exitPrice: 0,
          quantity: 1,
          leverage: 100,
          tickSize: 0.0001,
          tickValue: 1,
          commission: 0,
          stopLoss: 0,
          takeProfit: 0,
          accountCurrency: 'USD',
          contractSize: 100000
        });
      }
    } catch (error) {
      console.error('Error adding trade:', error);
    }
  };

  const removeTrade = (id: string) => {
    try {
      setTrades(trades.filter(t => t.id !== id));
      if (selectedTradeId === id) {
        setSelectedTradeId(trades.length > 1 ? trades.find(t => t.id !== id)?.id || '' : '');
      }
    } catch (error) {
      console.error('Error removing trade:', error);
    }
  };

  const updateTrade = (id: string, field: keyof TradeData, value: any) => {
    try {
      setTrades(trades.map(trade => 
        trade.id === id ? { ...trade, [field]: value } : trade
      ));
    } catch (error) {
      console.error('Error updating trade:', error);
    }
  };

  const handleAssetTypeChange = (newAssetType: keyof typeof assetTypes) => {
    try {
      const assetConfig = assetTypes[newAssetType];
      setNewTrade(prev => ({
        ...prev,
        assetType: newAssetType,
        tickSize: assetConfig.defaultTickSize,
        tickValue: assetConfig.defaultTickValue,
        contractSize: assetConfig.defaultContractSize,
        leverage: assetConfig.supportsLeverage ? prev.leverage : 1
      }));
    } catch (error) {
      console.error('Error changing asset type:', error);
    }
  };

  const calculateResults = (tradeData: TradeData) => {
    try {
      const { entryPrice, exitPrice, quantity, leverage, tickSize, tickValue, commission, stopLoss, takeProfit, contractSize } = tradeData;
      
      if (!entryPrice || !exitPrice || !quantity) {
        return null;
      }

      const assetConfig = assetTypes[tradeData.assetType];
      const isLong = exitPrice > entryPrice;
      
      // Calculate position size
      const positionSize = quantity * contractSize;
      const positionValue = positionSize * entryPrice;
      
      // Calculate P&L
      const priceDifference = exitPrice - entryPrice;
      const grossPnL = priceDifference * positionSize;
      const netPnL = grossPnL - (commission * 2); // Entry + Exit commission
      
      // Calculate percentage gain/loss
      const percentageGainLoss = (priceDifference / entryPrice) * 100;
      
      // Calculate pip/tick/point value
      const priceMovement = Math.abs(priceDifference);
      const ticksPoints = priceMovement / tickSize;
      const tickPointValue = ticksPoints * tickValue * quantity;
      
      // Calculate margin used
      const marginUsed = assetConfig.supportsLeverage ? positionValue / leverage : positionValue;
      
      // Calculate risk/reward ratio
      let riskRewardRatio = 0;
      if (stopLoss > 0 && takeProfit > 0) {
        const riskAmount = Math.abs(entryPrice - stopLoss) * positionSize;
        const rewardAmount = Math.abs(takeProfit - entryPrice) * positionSize;
        riskRewardRatio = rewardAmount / riskAmount;
      }
      
      // Calculate breakeven price
      const commissionPerUnit = (commission * 2) / positionSize;
      const breakevenPrice = entryPrice + commissionPerUnit;
      
      // Calculate stop loss and take profit P&L
      const stopLossPnL = stopLoss > 0 ? (stopLoss - entryPrice) * positionSize - (commission * 2) : 0;
      const takeProfitPnL = takeProfit > 0 ? (takeProfit - entryPrice) * positionSize - (commission * 2) : 0;

      return {
        positionSize,
        positionValue,
        grossPnL,
        netPnL,
        percentageGainLoss,
        ticksPoints,
        tickPointValue,
        marginUsed,
        riskRewardRatio,
        breakevenPrice,
        stopLossPnL,
        takeProfitPnL,
        isProfit: netPnL > 0
      };
    } catch (error) {
      console.error('Error calculating results:', error);
      return null;
    }
  };

  const selectedTrade = trades.find(t => t.id === selectedTradeId);
  const results = selectedTrade ? calculateResults(selectedTrade) : null;
  const assetConfig = assetTypes[newTrade.assetType];

  const smartSuggestions = {
    name: 'EUR/USD Long Trade',
    assetType: 'forex',
    entryPrice: 1.1250,
    exitPrice: 1.1350,
    quantity: 1,
    leverage: 100,
    stopLoss: 1.1200,
    takeProfit: 1.1400,
    commission: 7
  };

  const exportData = {
    trades: trades.map(trade => ({
      ...trade,
      results: calculateResults(trade)
    })),
    date: new Date().toISOString()
  };

  const csvData = trades.map(trade => {
    const tradeResults = calculateResults(trade);
    const config = assetTypes[trade.assetType];
    return {
      'Trade Name': trade.name,
      'Asset Type': config.name,
      'Entry Price': trade.entryPrice,
      'Exit Price': trade.exitPrice,
      'Quantity': `${trade.quantity} ${config.quantityUnit}`,
      'Position Size': tradeResults?.positionSize || 0,
      'Gross P&L': tradeResults?.grossPnL.toFixed(2) || '0.00',
      'Net P&L': tradeResults?.netPnL.toFixed(2) || '0.00',
      'Percentage Gain/Loss': `${tradeResults?.percentageGainLoss.toFixed(2) || '0.00'}%`,
      'Margin Used': tradeResults?.marginUsed.toFixed(2) || '0.00',
      'Risk/Reward Ratio': tradeResults?.riskRewardRatio > 0 ? `1:${tradeResults.riskRewardRatio.toFixed(2)}` : 'N/A',
      'Breakeven Price': tradeResults?.breakevenPrice.toFixed(4) || '0.0000'
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="trade-calculator"
          title="Multi-Asset Trading Calculator"
          elementId="trade-calculator-content"
        />
      </div>

      <div id="trade-calculator-content">
      <AutoSaveIndicator
        toolName="Trade Profit & Risk Calculator"
        hasData={hasSavedData}
        onClearData={handleClearSavedData}
      />

      <SmartSuggestions
        toolName="trade-profit-risk-calculator"
        suggestions={smartSuggestions}
        onUseSuggestion={handleUseSuggestions}
        onDismiss={() => setShowSuggestions(false)}
        visible={showSuggestions}
      />

      {/* Add New Trade */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Trade Scenario</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Trade Name (e.g., EUR/USD Long)"
            value={newTrade.name}
            onChange={(e) => setNewTrade({...newTrade, name: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={addTrade}
            disabled={!newTrade.name || newTrade.entryPrice <= 0 || newTrade.quantity <= 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Trade
          </button>
        </div>

        <h4 className="font-medium mb-3">Asset Type</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(assetTypes).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleAssetTypeChange(key as keyof typeof assetTypes)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                newTrade.assetType === key
                  ? 'border-blue-500 bg-blue-600/20'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-700'
              }`}
            >
              <div className="font-medium text-white">{config.name}</div>
              <div className="text-xs text-gray-400 mt-1">{config.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Trade Parameters */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h4 className="font-medium mb-3">Trade Parameters</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Entry Price
            </label>
            <input
              type="number"
              step="any"
              value={newTrade.entryPrice || ''}
              onChange={(e) => setNewTrade({...newTrade, entryPrice: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Exit Price
            </label>
            <input
              type="number"
              step="any"
              value={newTrade.exitPrice || ''}
              onChange={(e) => setNewTrade({...newTrade, exitPrice: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {assetConfig.quantityLabel}
            </label>
            <input
              type="number"
              step="any"
              value={newTrade.quantity || ''}
              onChange={(e) => setNewTrade({...newTrade, quantity: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder={`1 ${assetConfig.quantityUnit}`}
            />
          </div>
          
          {assetConfig.supportsLeverage && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Leverage
              </label>
              <select
                value={newTrade.leverage}
                onChange={(e) => setNewTrade({...newTrade, leverage: parseInt(e.target.value)})}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value={1}>1:1 (No Leverage)</option>
                <option value={10}>1:10</option>
                <option value={20}>1:20</option>
                <option value={50}>1:50</option>
                <option value={100}>1:100</option>
                <option value={200}>1:200</option>
                <option value={500}>1:500</option>
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tick/Pip Size
            </label>
            <input
              type="number"
              step="any"
              value={newTrade.tickSize || ''}
              onChange={(e) => setNewTrade({...newTrade, tickSize: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="0.0001"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tick/Pip Value
            </label>
            <input
              type="number"
              step="any"
              value={newTrade.tickValue || ''}
              onChange={(e) => setNewTrade({...newTrade, tickValue: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="1.00"
            />
          </div>
        </div>
      </div>

      {/* Risk Management */}
      <div className="mt-4">
        <h4 className="font-medium mb-3">Risk Management</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stop Loss Price
            </label>
            <input
              type="number"
              step="any"
              value={newTrade.stopLoss || ''}
              onChange={(e) => setNewTrade({...newTrade, stopLoss: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Take Profit Price
            </label>
            <input
              type="number"
              step="any"
              value={newTrade.takeProfit || ''}
              onChange={(e) => setNewTrade({...newTrade, takeProfit: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Commission (per trade)
            </label>
            <input
              type="number"
              step="any"
              value={newTrade.commission || ''}
              onChange={(e) => setNewTrade({...newTrade, commission: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Trade Scenarios List */}
      {trades.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Trade Scenarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trades.map((trade) => {
              const tradeResults = calculateResults(trade);
              const config = assetTypes[trade.assetType];
              return (
                <div 
                  key={trade.id} 
                  className={`rounded-lg p-4 border-2 cursor-pointer transition-all ${
                    selectedTradeId === trade.id 
                      ? 'border-blue-500 bg-blue-600/20' 
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                  }`}
                  onClick={() => setSelectedTradeId(trade.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{trade.name}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTrade(trade.id);
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-400">
                    <p>{config.name} • {trade.quantity} {config.quantityUnit}</p>
                    <p>Entry: {trade.entryPrice} → Exit: {trade.exitPrice}</p>
                    {tradeResults && (
                      <p className={`font-medium ${tradeResults.isProfit ? 'text-green-400' : 'text-red-400'}`}>
                        P&L: ${tradeResults.netPnL.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Trade Details */}
      {selectedTrade && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {selectedTrade.name} - Details
            </h3>
            <span className="text-sm text-gray-400">
              {assetTypes[selectedTrade.assetType].name}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Entry Price</label>
              <input
                type="number"
                step="any"
                value={selectedTrade.entryPrice}
                onChange={(e) => updateTrade(selectedTrade.id, 'entryPrice', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Exit Price</label>
              <input
                type="number"
                step="any"
                value={selectedTrade.exitPrice}
                onChange={(e) => updateTrade(selectedTrade.id, 'exitPrice', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
              <input
                type="number"
                step="any"
                value={selectedTrade.quantity}
                onChange={(e) => updateTrade(selectedTrade.id, 'quantity', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stop Loss</label>
              <input
                type="number"
                step="any"
                value={selectedTrade.stopLoss}
                onChange={(e) => updateTrade(selectedTrade.id, 'stopLoss', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit</label>
              <input
                type="number"
                step="any"
                value={selectedTrade.takeProfit}
                onChange={(e) => updateTrade(selectedTrade.id, 'takeProfit', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Commission</label>
              <input
                type="number"
                step="any"
                value={selectedTrade.commission}
                onChange={(e) => updateTrade(selectedTrade.id, 'commission', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results && selectedTrade && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`${results.isProfit ? 'bg-green-600' : 'bg-red-600'} rounded-lg p-4 text-center`}>
              <h3 className="text-sm font-medium text-white opacity-90">Net P&L</h3>
              <p className="text-2xl font-bold">${results.netPnL.toFixed(2)}</p>
              <p className="text-xs opacity-75">
                {results.percentageGainLoss > 0 ? '+' : ''}{results.percentageGainLoss.toFixed(2)}%
              </p>
            </div>
            <div className="bg-blue-600 rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-blue-100">Position Size</h3>
              <p className="text-2xl font-bold">{results.positionSize.toLocaleString()}</p>
              <p className="text-xs text-blue-200">{assetTypes[selectedTrade.assetType].quantityUnit}</p>
            </div>
            <div className="bg-purple-600 rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-purple-100">Margin Used</h3>
              <p className="text-2xl font-bold">${results.marginUsed.toFixed(2)}</p>
              <p className="text-xs text-purple-200">Required margin</p>
            </div>
            <div className="bg-orange-600 rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-orange-100">Risk/Reward</h3>
              <p className="text-2xl font-bold">
                {results.riskRewardRatio > 0 ? `1:${results.riskRewardRatio.toFixed(2)}` : 'N/A'}
              </p>
              <p className="text-xs text-orange-200">Ratio</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Position Value:</span>
                  <span className="font-medium">${results.positionValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Gross P&L:</span>
                  <span className={`font-medium ${results.grossPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${results.grossPnL.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Commission Cost:</span>
                  <span className="font-medium text-red-400">-${(selectedTrade.commission * 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-2">
                  <span className="text-gray-300">Net P&L:</span>
                  <span className={`font-bold ${results.netPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${results.netPnL.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Breakeven Price:</span>
                  <span className="font-medium">{results.breakevenPrice.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Ticks/Pips Moved:</span>
                  <span className="font-medium">{results.ticksPoints.toFixed(1)}</span>
                </div>
                {selectedTrade.stopLoss > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Stop Loss P&L:</span>
                    <span className="font-medium text-red-400">${results.stopLossPnL.toFixed(2)}</span>
                  </div>
                )}
                {selectedTrade.takeProfit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Take Profit P&L:</span>
                    <span className="font-medium text-green-400">${results.takeProfitPnL.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Comparison Table */}
      {trades.length > 1 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Trade Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2">Trade Name</th>
                  <th className="text-center py-2">Asset</th>
                  <th className="text-center py-2">Entry → Exit</th>
                  <th className="text-center py-2">Net P&L</th>
                  <th className="text-center py-2">% Gain/Loss</th>
                  <th className="text-center py-2">Risk/Reward</th>
                  <th className="text-center py-2">Margin Used</th>
                </tr>
              </thead>
              <tbody>
                {trades.map(trade => {
                  const tradeResults = calculateResults(trade);
                  const config = assetTypes[trade.assetType];
                  return (
                    <tr 
                      key={trade.id} 
                      className={`border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                        selectedTradeId === trade.id ? 'bg-blue-600/20' : ''
                      }`}
                      onClick={() => setSelectedTradeId(trade.id)}
                    >
                      <td className="py-2 font-medium">{trade.name}</td>
                      <td className="text-center py-2">{config.name}</td>
                      <td className="text-center py-2">{trade.entryPrice} → {trade.exitPrice}</td>
                      <td className={`text-center py-2 font-medium ${
                        tradeResults?.isProfit ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ${tradeResults?.netPnL.toFixed(2) || '0.00'}
                      </td>
                      <td className={`text-center py-2 ${
                        tradeResults?.percentageGainLoss >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {tradeResults?.percentageGainLoss.toFixed(2) || '0.00'}%
                      </td>
                      <td className="text-center py-2">
                        {tradeResults?.riskRewardRatio > 0 ? `1:${tradeResults.riskRewardRatio.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="text-center py-2">${tradeResults?.marginUsed.toFixed(2) || '0.00'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-300 mb-1">Important Disclaimer</h4>
            <p className="text-sm text-yellow-200">
              This calculator is for educational and estimation purposes only. Trading involves substantial risk of loss. 
              Always consult your broker for exact values, margin requirements, and trading conditions. 
              Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};