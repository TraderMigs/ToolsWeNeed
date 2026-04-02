import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

interface PackingItem {
  id: string;
  item: string;
  category: string;
  quantity: number;
  packed: boolean;
  notes: string;
}

const destinations = {
  'Beach Vacation': ['Swimwear', 'Sunscreen', 'Beach towel', 'Flip flops', 'Sunglasses', 'Beach bag', 'Water bottle'],
  'Business Trip': ['Business attire', 'Laptop', 'Chargers', 'Business cards', 'Documents', 'Dress shoes', 'Belt'],
  'Camping': ['Tent', 'Sleeping bag', 'Flashlight', 'First aid kit', 'Insect repellent', 'Camping stove', 'Water filter'],
  'City Break': ['Comfortable walking shoes', 'Camera', 'City map', 'Portable charger', 'Day pack', 'Umbrella'],
  'Ski Trip': ['Ski gear', 'Thermal underwear', 'Warm jacket', 'Gloves', 'Goggles', 'Ski boots', 'Hand warmers'],
  'Road Trip': ['Snacks', 'Entertainment', 'Car charger', 'Maps', 'Emergency kit', 'Cooler', 'Travel pillow']
};

const categories = ['Clothing', 'Electronics', 'Toiletries', 'Documents', 'Gear', 'Miscellaneous'];

export const PackingChecklistGenerator: React.FC = () => {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [destination, setDestination] = useState('Beach Vacation');
  const [duration, setDuration] = useState(7);
  const [newItem, setNewItem] = useState({
    item: '',
    category: 'Clothing',
    quantity: 1,
    notes: ''
  });

  const generateChecklist = () => {
    const baseItems = destinations[destination as keyof typeof destinations] || [];
    const generatedItems: PackingItem[] = baseItems.map((item, index) => ({
      id: `generated-${index}`,
      item,
      category: 'Miscellaneous',
      quantity: 1,
      packed: false,
      notes: ''
    }));

    // Add duration-based clothing items
    if (duration > 0) {
      const clothingItems = [
        { item: 'Underwear', quantity: duration + 2 },
        { item: 'Socks', quantity: duration + 2 },
        { item: 'T-shirts', quantity: Math.ceil(duration / 2) },
        { item: 'Pants/Shorts', quantity: Math.ceil(duration / 3) },
        { item: 'Pajamas', quantity: Math.ceil(duration / 4) }
      ];

      clothingItems.forEach((clothingItem, index) => {
        generatedItems.push({
          id: `clothing-${index}`,
          item: clothingItem.item,
          category: 'Clothing',
          quantity: clothingItem.quantity,
          packed: false,
          notes: ''
        });
      });
    }

    setItems(generatedItems);
  };

  const addItem = () => {
    if (newItem.item) {
      setItems([...items, {
        id: Date.now().toString(),
        ...newItem,
        packed: false
      }]);
      setNewItem({
        item: '',
        category: 'Clothing',
        quantity: 1,
        notes: ''
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const togglePacked = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  const updateItem = (id: string, field: keyof PackingItem, value: string | number | boolean) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateProgress = () => {
    const totalItems = items.length;
    const packedItems = items.filter(item => item.packed).length;
    const percentage = totalItems > 0 ? (packedItems / totalItems) * 100 : 0;

    return {
      totalItems,
      packedItems,
      percentage
    };
  };

  const progress = calculateProgress();

  const exportData = {
    destination,
    duration,
    items,
    progress,
    date: new Date().toISOString()
  };

  const csvData = items.map(item => ({
    Category: item.category,
    Item: item.item,
    Quantity: item.quantity,
    Packed: item.packed ? 'Yes' : 'No',
    Notes: item.notes
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="packing-checklist"
          title="Packing Checklist"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Trip Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            {Object.keys(destinations).map(dest => (
              <option key={dest} value={dest}>{dest}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Trip Duration (days)"
            value={duration || ''}
            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={generateChecklist}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Generate Checklist
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Packing Progress</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 bg-gray-700 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{progress.percentage.toFixed(0)}%</span>
        </div>
        <p className="text-sm text-gray-400">
          {progress.packedItems} of {progress.totalItems} items packed
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Custom Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Item"
            value={newItem.item}
            onChange={(e) => setNewItem({...newItem, item: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
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
            type="number"
            placeholder="Quantity"
            value={newItem.quantity || ''}
            onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
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

          const categoryPacked = categoryItems.filter(item => item.packed).length;

          return (
            <div key={category} className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{category}</h3>
                <span className="text-sm text-gray-400">
                  {categoryPacked}/{categoryItems.length} packed
                </span>
              </div>
              <div className="space-y-2">
                {categoryItems.map(item => (
                  <div key={item.id} className={`rounded-lg p-4 border-2 ${
                    item.packed 
                      ? 'bg-green-600/20 border-green-500' 
                      : 'bg-gray-700 border-gray-600'
                  }`}>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => togglePacked(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          item.packed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-400 hover:border-green-400'
                        }`}
                      >
                        {item.packed && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <span className={`font-medium ${item.packed ? 'line-through text-gray-400' : ''}`}>
                            {item.item}
                          </span>
                          <span className="text-sm text-gray-400">Qty: {item.quantity}</span>
                          {item.notes && (
                            <span className="text-sm text-blue-400">{item.notes}</span>
                          )}
                        </div>
                      </div>
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
    </div>
  );
};