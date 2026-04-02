import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  description: string;
  color: string;
}

const categories = [
  { name: 'Work', color: 'bg-blue-500' },
  { name: 'Personal', color: 'bg-green-500' },
  { name: 'Health', color: 'bg-red-500' },
  { name: 'Learning', color: 'bg-purple-500' },
  { name: 'Social', color: 'bg-yellow-500' },
  { name: 'Break', color: 'bg-gray-500' }
];

export const TimeBlockingScheduler: React.FC = () => {
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newBlock, setNewBlock] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    category: 'Work',
    description: ''
  });

  const addBlock = () => {
    if (newBlock.title && newBlock.startTime && newBlock.endTime) {
      const category = categories.find(cat => cat.name === newBlock.category);
      setBlocks([...blocks, {
        id: Date.now().toString(),
        ...newBlock,
        color: category?.color || 'bg-gray-500'
      }]);
      setNewBlock({
        title: '',
        startTime: '09:00',
        endTime: '10:00',
        category: 'Work',
        description: ''
      });
    }
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const updateBlock = (id: string, field: keyof TimeBlock, value: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === id) {
        const updatedBlock = { ...block, [field]: value };
        if (field === 'category') {
          const category = categories.find(cat => cat.name === value);
          updatedBlock.color = category?.color || 'bg-gray-500';
        }
        return updatedBlock;
      }
      return block;
    }));
  };

  const sortedBlocks = [...blocks].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 24; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(timeString);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getBlocksForTime = (time: string) => {
    return sortedBlocks.filter(block => {
      const blockStart = block.startTime;
      const blockEnd = block.endTime;
      return time >= blockStart && time < blockEnd;
    });
  };

  const exportData = {
    date: selectedDate,
    blocks: sortedBlocks,
    summary: {
      totalBlocks: blocks.length,
      categories: categories.map(cat => ({
        name: cat.name,
        count: blocks.filter(block => block.category === cat.name).length
      }))
    },
    exportDate: new Date().toISOString()
  };

  const csvData = sortedBlocks.map(block => ({
    Title: block.title,
    'Start Time': block.startTime,
    'End Time': block.endTime,
    Category: block.category,
    Description: block.description
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename={`schedule-${selectedDate}`}
          title="Time Blocking Schedule"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Schedule Date</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Time Block</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Block Title"
            value={newBlock.title}
            onChange={(e) => setNewBlock({...newBlock, title: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="time"
            value={newBlock.startTime}
            onChange={(e) => setNewBlock({...newBlock, startTime: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="time"
            value={newBlock.endTime}
            onChange={(e) => setNewBlock({...newBlock, endTime: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <select
            value={newBlock.category}
            onChange={(e) => setNewBlock({...newBlock, category: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            {categories.map(category => (
              <option key={category.name} value={category.name}>{category.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Description"
            value={newBlock.description}
            onChange={(e) => setNewBlock({...newBlock, description: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={addBlock}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Block
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Visual Schedule</h3>
          <div className="space-y-1">
            {timeSlots.map(time => {
              const blocksAtTime = getBlocksForTime(time);
              return (
                <div key={time} className="flex items-center gap-2 min-h-[40px]">
                  <div className="w-16 text-sm text-gray-400 font-mono">
                    {time}
                  </div>
                  <div className="flex-1">
                    {blocksAtTime.map(block => (
                      <div
                        key={block.id}
                        className={`${block.color} text-white p-2 rounded mb-1 text-sm`}
                      >
                        <div className="font-medium">{block.title}</div>
                        <div className="text-xs opacity-90">
                          {block.startTime} - {block.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Time Blocks</h3>
          <div className="space-y-2">
            {sortedBlocks.map(block => (
              <div key={block.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${block.color}`}></div>
                    <span className="font-medium">{block.title}</span>
                  </div>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={block.startTime}
                    onChange={(e) => updateBlock(block.id, 'startTime', e.target.value)}
                    className="px-2 py-1 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:outline-none text-sm"
                  />
                  <input
                    type="time"
                    value={block.endTime}
                    onChange={(e) => updateBlock(block.id, 'endTime', e.target.value)}
                    className="px-2 py-1 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:outline-none text-sm"
                  />
                  <select
                    value={block.category}
                    onChange={(e) => updateBlock(block.id, 'category', e.target.value)}
                    className="px-2 py-1 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:outline-none text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.name} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={block.description}
                    onChange={(e) => updateBlock(block.id, 'description', e.target.value)}
                    className="px-2 py-1 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:outline-none text-sm"
                    placeholder="Description"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Category Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(category => {
            const count = blocks.filter(block => block.category === category.name).length;
            return (
              <div key={category.name} className="text-center">
                <div className={`w-8 h-8 rounded mx-auto mb-2 ${category.color}`}></div>
                <p className="text-sm font-medium">{category.name}</p>
                <p className="text-xs text-gray-400">{count} blocks</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};