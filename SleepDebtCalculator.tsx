import React, { useState } from 'react';
import { Plus, Trash2, Edit, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

interface WeddingItem {
  id: string;
  category: string;
  item: string;
  vendor: string;
  budgeted: number;
  actual: number;
  paid: number;
  notes: string;
}

const categories = [
  'Venue',
  'Food & Catering',
  'Photography',
  'Videography',
  'Flowers',
  'Music/DJ',
  'Attire',
  'Rings',
  'Transportation',
  'Invitations',
  'Decorations',
  'Miscellaneous'
];

export const WeddingBudgetPlanner: React.FC = () => {
  const [items, setItems] = useState<WeddingItem[]>([]);
  const [totalBudget, setTotalBudget] = useState(25000);
  const [weddingDetails, setWeddingDetails] = useState({
    date: '',
    venue: '',
    guestCount: 0,
    style: 'Traditional'
  });
  const [editMode, setEditMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newItem, setNewItem] = useState({
    category: 'Venue',
    item: '',
    vendor: '',
    budgeted: 0,
    actual: 0,
    paid: 0,
    notes: ''
  });

  const addItem = () => {
    if (newItem.item) {
      setItems([...items, {
        id: Date.now().toString(),
        ...newItem
      }]);
      setNewItem({
        category: 'Venue',
        item: '',
        vendor: '',
        budgeted: 0,
        actual: 0,
        paid: 0,
        notes: ''
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof WeddingItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotals = () => {
    const totalBudgeted = items.reduce((sum, item) => sum + item.budgeted, 0);
    const totalActual = items.reduce((sum, item) => sum + item.actual, 0);
    const totalPaid = items.reduce((sum, item) => sum + item.paid, 0);
    const remaining = totalBudget - totalActual;
    const outstanding = totalActual - totalPaid;
    const percentageUsed = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;
    const averageCostPerGuest = weddingDetails.guestCount > 0 ? totalActual / weddingDetails.guestCount : 0;

    return {
      totalBudgeted,
      totalActual,
      totalPaid,
      remaining,
      outstanding,
      percentageUsed,
      averageCostPerGuest
    };
  };

  const totals = calculateTotals();

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleSaveChanges = () => {
    setEditMode(false);
  };

  const exportData = {
    totalBudget,
    weddingDetails,
    items,
    totals,
    categories: categories.map(category => ({
      category,
      items: items.filter(item => item.category === category),
      budgeted: items.filter(item => item.category === category).reduce((sum, item) => sum + item.budgeted, 0),
      actual: items.filter(item => item.category === category).reduce((sum, item) => sum + item.actual, 0),
      paid: items.filter(item => item.category === category).reduce((sum, item) => sum + item.paid, 0)
    })),
    date: new Date().toISOString()
  };

  const csvData = items.map(item => ({
    Category: item.category,
    Item: item.item,
    Vendor: item.vendor,
    Budgeted: item.budgeted,
    Actual: item.actual,
    Paid: item.paid,
    Outstanding: item.actual - item.paid,
    Notes: item.notes
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="wedding-budget"
          title="Wedding Budget Planner"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Total Wedding Budget</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Total Budget</label>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-xl font-bold"
              placeholder="Enter total budget"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Wedding Date</label>
            <input
              type="date"
              value={weddingDetails.date}
              onChange={(e) => setWeddingDetails({...weddingDetails, date: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        
        {/* Advanced Wedding Details */}
        <div className="mt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            + Wedding Details
          </button>
          
          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Guest Count</label>
                <input
                  type="number"
                  value={weddingDetails.guestCount || ''}
                  onChange={(e) => setWeddingDetails({...weddingDetails, guestCount: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Number of guests"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Venue Name</label>
                <input
                  type="text"
                  value={weddingDetails.venue}
                  onChange={(e) => setWeddingDetails({...weddingDetails, venue: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Wedding venue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Wedding Style</label>
                <select
                  value={weddingDetails.style}
                  onChange={(e) => setWeddingDetails({...weddingDetails, style: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Traditional">Traditional</option>
                  <option value="Modern">Modern</option>
                  <option value="Rustic">Rustic</option>
                  <option value="Beach">Beach</option>
                  <option value="Garden">Garden</option>
                  <option value="Destination">Destination</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-blue-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-blue-100">Total Budget</h3>
          <p className="text-2xl font-bold">${totalBudget.toFixed(2)}</p>
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-green-100">Budgeted</h3>
          <p className="text-2xl font-bold">${totals.totalBudgeted.toFixed(2)}</p>
        </div>
        <div className="bg-orange-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-orange-100">Actual Cost</h3>
          <p className="text-2xl font-bold">${totals.totalActual.toFixed(2)}</p>
          <p className="text-xs text-orange-200">{totals.percentageUsed.toFixed(1)}% of budget</p>
        </div>
        <div className="bg-purple-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-purple-100">Paid</h3>
          <p className="text-2xl font-bold">${totals.totalPaid.toFixed(2)}</p>
        </div>
        <div className={`${totals.remaining >= 0 ? 'bg-teal-600' : 'bg-red-600'} rounded-lg p-4 text-center`}>
          <h3 className="text-sm font-medium text-teal-100">Remaining</h3>
          <p className="text-2xl font-bold">${totals.remaining.toFixed(2)}</p>
        </div>
        {showAdvanced && weddingDetails.guestCount > 0 && (
          <div className="bg-indigo-600 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-indigo-100">Per Guest</h3>
            <p className="text-2xl font-bold">${totals.averageCostPerGuest.toFixed(2)}</p>
            <p className="text-xs text-indigo-200">average cost</p>
          </div>
        )}
      </div>

      {/* Edit Mode Button */}
      {items.length > 0 && !editMode && (
        <div className="flex justify-center">
          <button
            onClick={handleEditMode}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Wedding Details
          </button>
        </div>
      )}

      {editMode && (
        <div className="flex justify-center">
          <button
            onClick={handleSaveChanges}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Item"
            value={newItem.item}
            onChange={(e) => setNewItem({...newItem, item: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Vendor"
            value={newItem.vendor}
            onChange={(e) => setNewItem({...newItem, vendor: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Budgeted Amount"
            value={newItem.budgeted || ''}
            onChange={(e) => setNewItem({...newItem, budgeted: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Actual Amount"
            value={newItem.actual || ''}
            onChange={(e) => setNewItem({...newItem, actual: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Paid Amount"
            value={newItem.paid || ''}
            onChange={(e) => setNewItem({...newItem, paid: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Notes"
            value={newItem.notes}
            onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={addItem}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(category => {
          const categoryItems = items.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          const categoryBudgeted = categoryItems.reduce((sum, item) => sum + item.budgeted, 0);
          const categoryActual = categoryItems.reduce((sum, item) => sum + item.actual, 0);
          const categoryPaid = categoryItems.reduce((sum, item) => sum + item.paid, 0);

          return (
            <div key={category} className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{category}</h3>
                <div className="flex gap-4 text-sm">
                  <span>Budgeted: ${categoryBudgeted.toFixed(2)}</span>
                  <span>Actual: ${categoryActual.toFixed(2)}</span>
                  <span>Paid: ${categoryPaid.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                {categoryItems.map(item => (
                  <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                      <div>
                        <h4 className="font-medium">{item.item}</h4>
                        <p className="text-sm text-gray-400">{item.vendor}</p>
                      </div>
                      <input
                        type="number"
                        value={item.budgeted}
                        onChange={(e) => updateItem(item.id, 'budgeted', parseFloat(e.target.value) || 0)}
                        className="px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                        placeholder="Budgeted"
                      />
                      <input
                        type="number"
                        value={item.actual}
                        onChange={(e) => updateItem(item.id, 'actual', parseFloat(e.target.value) || 0)}
                        className="px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                        placeholder="Actual"
                      />
                      <input
                        type="number"
                        value={item.paid}
                        onChange={(e) => updateItem(item.id, 'paid', parseFloat(e.target.value) || 0)}
                        className="px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                        placeholder="Paid"
                      />
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                        className="px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                        placeholder="Notes"
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {totals.outstanding > 0 && (
        <div className="bg-orange-600 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-orange-100">Outstanding Payments</h3>
          <p className="text-2xl font-bold">${totals.outstanding.toFixed(2)}</p>
          <p className="text-sm text-orange-200">Amount still owed to vendors</p>
        </div>
      )}

      {/* Wedding Timeline */}
      {showAdvanced && weddingDetails.date && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Wedding Timeline</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Wedding Date:</span>
              <span className="font-medium">{new Date(weddingDetails.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Days Until Wedding:</span>
              <span className="font-medium">
                {Math.max(0, Math.ceil((new Date(weddingDetails.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
              </span>
            </div>
            {weddingDetails.venue && (
              <div className="flex justify-between">
                <span>Venue:</span>
                <span className="font-medium">{weddingDetails.venue}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Wedding Style:</span>
              <span className="font-medium">{weddingDetails.style}</span>
            </div>
            {weddingDetails.guestCount > 0 && (
              <div className="flex justify-between">
                <span>Guest Count:</span>
                <span className="font-medium">{weddingDetails.guestCount}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};