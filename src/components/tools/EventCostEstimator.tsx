import React, { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

interface EventItem {
  id: string;
  category: string;
  item: string;
  quantity: number;
  unitCost: number;
  notes: string;
}

const categories = ['Venue', 'Food & Beverage', 'Decorations', 'Entertainment', 'Equipment', 'Staff', 'Marketing', 'Transportation', 'Miscellaneous'];

export const EventCostEstimator: React.FC = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [expectedAttendees, setExpectedAttendees] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [items, setItems] = useState<EventItem[]>([]);
  const [newItem, setNewItem] = useState({ category: 'Venue', item: '', quantity: 1, unitCost: 0, notes: '' });

  const totals = useMemo(() => {
    const totalCost = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
    const totalRevenue = expectedAttendees * ticketPrice;
    const netProfit = totalRevenue - totalCost;
    return {
      totalCost,
      totalRevenue,
      netProfit,
      costPerAttendee: expectedAttendees > 0 ? totalCost / expectedAttendees : 0,
      profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
      breakEvenAttendees: ticketPrice > 0 ? Math.ceil(totalCost / ticketPrice) : 0,
    };
  }, [items, expectedAttendees, ticketPrice]);

  const addItem = () => {
    if (!newItem.item.trim() || newItem.quantity <= 0 || newItem.unitCost < 0) return;
    setItems((current) => [...current, { id: crypto.randomUUID(), ...newItem, item: newItem.item.trim() }]);
    setNewItem({ category: 'Venue', item: '', quantity: 1, unitCost: 0, notes: '' });
  };

  const updateItem = (id: string, patch: Partial<EventItem>) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  };

  const exportData = { eventName, eventDate, expectedAttendees, ticketPrice, items, totals, generatedAt: new Date().toISOString() };
  const csvData = items.map((item) => ({ Category: item.category, Item: item.item, Quantity: item.quantity, 'Unit Cost': item.unitCost, 'Total Cost': item.quantity * item.unitCost, Notes: item.notes }));

  return (
    <div id="event-cost-content" className="space-y-6">
      <div className="flex justify-center"><ExportButtons data={exportData} csvData={csvData} filename="event-cost-estimate" title="Event Cost Estimate" elementId="event-cost-content" /></div>

      <section className="rounded-xl bg-gray-800 p-6" aria-labelledby="event-details-heading">
        <h2 id="event-details-heading" className="mb-4 text-xl font-semibold">Event details</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm text-gray-300">Event name<input className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white" value={eventName} onChange={(event) => setEventName(event.target.value)} /></label>
          <label className="text-sm text-gray-300">Event date<input type="date" className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white" value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></label>
          <label className="text-sm text-gray-300">Expected attendees<input type="number" min="0" className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white" value={expectedAttendees || ''} onChange={(event) => setExpectedAttendees(Math.max(0, Number(event.target.value)))} /></label>
          <label className="text-sm text-gray-300">Ticket price<input type="number" min="0" step="0.01" className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white" value={ticketPrice || ''} onChange={(event) => setTicketPrice(Math.max(0, Number(event.target.value)))} /></label>
        </div>
      </section>

      <section className="rounded-xl bg-gray-800 p-6" aria-labelledby="event-cost-line-heading">
        <h2 id="event-cost-line-heading" className="mb-4 text-xl font-semibold">Add a cost line</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <label className="text-sm text-gray-300">Category<select className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white" value={newItem.category} onChange={(event) => setNewItem({ ...newItem, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="text-sm text-gray-300">Item<input className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white" value={newItem.item} onChange={(event) => setNewItem({ ...newItem, item: event.target.value })} /></label>
          <label className="text-sm text-gray-300">Quantity<input type="number" min="1" className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white" value={newItem.quantity} onChange={(event) => setNewItem({ ...newItem, quantity: Math.max(1, Number(event.target.value)) })} /></label>
          <label className="text-sm text-gray-300">Unit cost<input type="number" min="0" step="0.01" className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white" value={newItem.unitCost || ''} onChange={(event) => setNewItem({ ...newItem, unitCost: Math.max(0, Number(event.target.value)) })} /></label>
          <button type="button" onClick={addItem} disabled={!newItem.item.trim()} className="mt-6 flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500 disabled:opacity-40"><Plus className="h-4 w-4" aria-hidden="true" />Add cost</button>
        </div>
      </section>

      {items.length > 0 && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Event totals">
            {[
              ['Total cost', totals.totalCost], ['Projected revenue', totals.totalRevenue], ['Net profit', totals.netProfit],
              ['Cost per attendee', totals.costPerAttendee], ['Profit margin', totals.profitMargin, '%'], ['Break-even attendees', totals.breakEvenAttendees, ' people'],
            ].map(([label, value, suffix]) => <div key={String(label)} className="rounded-xl bg-gray-800 p-4 text-center"><p className="text-sm text-gray-400">{label}</p><p className="mt-1 text-2xl font-bold text-blue-300">{suffix === '%' ? `${Number(value).toFixed(1)}%` : suffix === ' people' ? `${value}${suffix}` : `$${Number(value).toFixed(2)}`}</p></div>)}
          </section>

          <section className="space-y-3" aria-labelledby="event-costs-heading">
            <h2 id="event-costs-heading" className="text-xl font-semibold">Cost lines</h2>
            {items.map((item) => (
              <div key={item.id} className="grid items-end gap-3 rounded-xl border border-gray-700 bg-gray-800 p-4 md:grid-cols-[1fr_1fr_110px_130px_auto]">
                <label className="text-xs text-gray-400">Category<select value={item.category} onChange={(event) => updateItem(item.id, { category: event.target.value })} className="mt-1 w-full rounded bg-gray-700 p-2 text-sm text-white">{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                <label className="text-xs text-gray-400">Item<input value={item.item} onChange={(event) => updateItem(item.id, { item: event.target.value })} className="mt-1 w-full rounded bg-gray-700 p-2 text-sm text-white" /></label>
                <label className="text-xs text-gray-400">Quantity<input type="number" min="1" value={item.quantity} onChange={(event) => updateItem(item.id, { quantity: Math.max(1, Number(event.target.value)) })} className="mt-1 w-full rounded bg-gray-700 p-2 text-sm text-white" /></label>
                <label className="text-xs text-gray-400">Unit cost<input type="number" min="0" step="0.01" value={item.unitCost} onChange={(event) => updateItem(item.id, { unitCost: Math.max(0, Number(event.target.value)) })} className="mt-1 w-full rounded bg-gray-700 p-2 text-sm text-white" /></label>
                <button type="button" onClick={() => setItems((current) => current.filter((candidate) => candidate.id !== item.id))} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-red-300 hover:bg-red-500/10" aria-label={`Remove ${item.item}`}><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
};
