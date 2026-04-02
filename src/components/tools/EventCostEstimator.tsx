import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

interface EventItem {
  id: string;
  category: string;
  item: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  notes: string;
}

const categories = [
  'Venue',
  'Food & Beverage',
  'Decorations',
  'Entertainment',
  'Equipment',
  'Staff',
  'Marketing',
  'Transportation',
  'Miscellaneous'
];

export const EventCostEstimator: React.FC = () => {
  const [items, setItems] = useState<EventItem[]>([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [expectedAttendees, setExpectedAttendees] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [attendeeBreakdown, setAttendeeBreakdown] = useState({
    adults: 0,
    children: 0,
    vip: 0
  });
  const [venueDetails, setVenueDetails] = useState({
    capacity: 0,
    location: '',
    setupTime: 0,
    cleanupTime: 0
  });
  const [newItem, setNewItem] = useState({
    category: 'Venue',
    item: '',
    quantity: 1,
    unitCost: 0,
    notes: ''
  });

  const addItem = () => {
    if (newItem.item) {
      const totalCost = newItem.quantity * newItem.unitCost;
      setItems([...items, {
        id: Date.now().toString(),
        ...newItem,
        totalCost
      }]);
      setNewItem({
        category: 'Venue',
        item: '',
        quantity: 1,
        unitCost: 0,
        notes: ''
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof EventItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitCost') {
          updatedItem.totalCost = updatedItem.quantity * updatedItem.unitCost;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const totalCost = items.reduce((sum, item) => sum + item.totalCost, 0);
    const costPerAttendee = expectedAttendees > 0 ? totalCost / expectedAttendees : 0;
    const totalRevenue = expectedAttendees * ticketPrice;
    const netProfit = totalRevenue - totalCost;

    const categoryTotals = categories.map(category => ({
      category,
      total: items
        .filter(item => item.category === category)
        .reduce((sum, item) => sum + item.totalCost, 0)
    })).filter(cat => cat.total > 0);

    // Advanced calculations
    const profitMargin = totalRevenue - totalCost;
    const profitPercentage = totalCost > 0 ? (profitMargin / totalCost) * 100 : 0;
    const breakevenAttendees = ticketPrice > 0 ? totalCost / ticketPrice : 0;

    return {
      totalCost,
      costPerAttendee,
      totalRevenue,
      netProfit,
      profitMargin,
      profitPercentage,
      breakevenAttendees,
      categoryTotals
    };
  };

  const totals = calculateTotals();
  const hasResults = items.length > 0;

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleSaveChanges = () => {
    setEditMode(false);
  };

  const exportData = {
    eventName,
    eventDate,
    expectedAttendees,
    ticketPrice,
    venueDetails,
    attendeeBreakdown,
    items,
    totals: {
      totalCost: items.reduce((sum, item) => sum + item.totalCost, 0),
      costPerAttendee: expectedAttendees > 0 ? items.reduce((sum, item) => sum + item.totalCost, 0) / expectedAttendees : 0,
      totalRevenue: expectedAttendees * ticketPrice,
      netProfit: (expectedAttendees * ticketPrice) - items.reduce((sum, item) => sum + item.totalCost, 0)
    },
    date: new Date().toISOString()
  };

  const csvData = items.map(item => ({
    Category: item.category,
    Item: item.item,
    Quantity: item.quantity,
    'Unit Cost': item.unitCost,
    'Total Cost': item.totalCost,
    Notes: item.notes
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="event-cost-estimate"
          title="Event Cost Estimator"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Event Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Expected Attendees"
            value={expectedAttendees || ''}
            onChange={(e) => setExpectedAttendees(parseInt(e.target.value) || 0)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Ticket Price ($)"
            value={ticketPrice || ''}
            onChange={(e) => setTicketPrice(parseFloat(e.target.value) || 0)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};