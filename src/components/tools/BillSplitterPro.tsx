import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

interface Person {
  id: string;
  name: string;
  email: string;
}

interface BillItem {
  id: string;
  description: string;
  amount: number;
  sharedBy: string[];
}

export const BillSplitterPro: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [tipPercentage, setTipPercentage] = useState(18);
  const [taxPercentage, setTaxPercentage] = useState(8.5);
  const [newPerson, setNewPerson] = useState({ name: '', email: '' });
  const [newItem, setNewItem] = useState({ description: '', amount: 0 });

  const addPerson = () => {
    if (newPerson.name) {
      setPeople([...people, {
        id: Date.now().toString(),
        ...newPerson
      }]);
      setNewPerson({ name: '', email: '' });
    }
  };

  const addBillItem = () => {
    if (newItem.description && newItem.amount > 0) {
      setBillItems([...billItems, {
        id: Date.now().toString(),
        ...newItem,
        sharedBy: people.map(p => p.id)
      }]);
      setNewItem({ description: '', amount: 0 });
    }
  };

  const removePerson = (id: string) => {
    setPeople(people.filter(person => person.id !== id));
    setBillItems(billItems.map(item => ({
      ...item,
      sharedBy: item.sharedBy.filter(personId => personId !== id)
    })));
  };

  const removeBillItem = (id: string) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const updateItemSharing = (itemId: string, personId: string, isShared: boolean) => {
    setBillItems(billItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          sharedBy: isShared 
            ? [...item.sharedBy, personId]
            : item.sharedBy.filter(id => id !== personId)
        };
      }
      return item;
    }));
  };

  const calculateSplit = () => {
    const subtotal = billItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * (taxPercentage / 100);
    const tip = subtotal * (tipPercentage / 100);
    const total = subtotal + tax + tip;

    const personTotals = people.map(person => {
      const personSubtotal = billItems
        .filter(item => item.sharedBy.includes(person.id))
        .reduce((sum, item) => sum + (item.amount / item.sharedBy.length), 0);
      
      const personTax = personSubtotal * (taxPercentage / 100);
      const personTip = personSubtotal * (tipPercentage / 100);
      const personTotal = personSubtotal + personTax + personTip;

      return {
        person,
        subtotal: personSubtotal,
        tax: personTax,
        tip: personTip,
        total: personTotal
      };
    });

    return {
      subtotal,
      tax,
      tip,
      total,
      personTotals
    };
  };

  const results = calculateSplit();

  const exportData = {
    people,
    billItems,
    tipPercentage,
    taxPercentage,
    results,
    date: new Date().toISOString()
  };

  const csvData = results.personTotals.map(personTotal => ({
    Name: personTotal.person.name,
    Email: personTotal.person.email,
    Subtotal: personTotal.subtotal.toFixed(2),
    Tax: personTotal.tax.toFixed(2),
    Tip: personTotal.tip.toFixed(2),
    Total: personTotal.total.toFixed(2)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="bill-split"
          title="Bill Split Results"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* People */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">People</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Name"
                value={newPerson.name}
                onChange={(e) => setNewPerson({...newPerson, name: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={newPerson.email}
                onChange={(e) => setNewPerson({...newPerson, email: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={addPerson}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors md:col-span-2"
              >
                <Plus className="w-4 h-4" />
                Add Person
              </button>
            </div>
            <div className="space-y-2">
              {people.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">{person.name}</h4>
                    {person.email && <p className="text-sm text-gray-400">{person.email}</p>}
                  </div>
                  <button
                    onClick={() => removePerson(person.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bill Items */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Bill Items</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newItem.amount || ''}
                onChange={(e) => setNewItem({...newItem, amount: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={addBillItem}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors md:col-span-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>
            <div className="space-y-2">
              {billItems.map((item) => (
                <div key={item.id} className="p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{item.description}</h4>
                      <p className="text-green-400">${item.amount.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeBillItem(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {people.map((person) => (
                      <label key={person.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={item.sharedBy.includes(person.id)}
                          onChange={(e) => updateItemSharing(item.id, person.id, e.target.checked)}
                          className="rounded"
                        />
                        {person.name}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tax and Tip */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Tax & Tip</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tax %</label>
            <input
              type="number"
              value={taxPercentage}
              onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tip %</label>
            <input
              type="number"
              value={tipPercentage}
              onChange={(e) => setTipPercentage(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Split Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-400">Subtotal</p>
            <p className="text-xl font-bold">${results.subtotal.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Tax</p>
            <p className="text-xl font-bold">${results.tax.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Tip</p>
            <p className="text-xl font-bold">${results.tip.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-xl font-bold text-blue-400">${results.total.toFixed(2)}</p>
          </div>
        </div>
        <div className="space-y-2">
          {results.personTotals.map((personTotal) => (
            <div key={personTotal.person.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium">{personTotal.person.name}</h4>
                <p className="text-sm text-gray-400">
                  Subtotal: ${personTotal.subtotal.toFixed(2)} + Tax: ${personTotal.tax.toFixed(2)} + Tip: ${personTotal.tip.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-400">${personTotal.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};