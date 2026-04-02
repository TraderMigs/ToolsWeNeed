import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  serving: string;
}

export const MacroMicronutrientTracker: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [dailyGoals, setDailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25,
    sugar: 50,
    sodium: 2300
  });
  const [newFood, setNewFood] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    serving: ''
  });

  const addFood = () => {
    if (newFood.name && newFood.calories > 0) {
      setFoods([...foods, {
        id: Date.now().toString(),
        ...newFood
      }]);
      setNewFood({
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        serving: ''
      });
    }
  };

  const removeFood = (id: string) => {
    setFoods(foods.filter(food => food.id !== id));
  };

  const calculateTotals = () => {
    return foods.reduce((totals, food) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat,
      fiber: totals.fiber + food.fiber,
      sugar: totals.sugar + food.sugar,
      sodium: totals.sodium + food.sodium
    }), {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    });
  };

  const totals = calculateTotals();

  const calculatePercentages = () => {
    return {
      calories: (totals.calories / dailyGoals.calories) * 100,
      protein: (totals.protein / dailyGoals.protein) * 100,
      carbs: (totals.carbs / dailyGoals.carbs) * 100,
      fat: (totals.fat / dailyGoals.fat) * 100,
      fiber: (totals.fiber / dailyGoals.fiber) * 100,
      sugar: (totals.sugar / dailyGoals.sugar) * 100,
      sodium: (totals.sodium / dailyGoals.sodium) * 100
    };
  };

  const percentages = calculatePercentages();

  const calculateMacroCalories = () => {
    return {
      proteinCals: totals.protein * 4,
      carbCals: totals.carbs * 4,
      fatCals: totals.fat * 9
    };
  };

  const macroCalories = calculateMacroCalories();

  const exportData = {
    foods,
    dailyGoals,
    totals,
    percentages,
    macroCalories,
    date: new Date().toISOString()
  };

  const csvData = foods.map(food => ({
    'Food Name': food.name,
    'Serving': food.serving,
    'Calories': food.calories,
    'Protein (g)': food.protein,
    'Carbs (g)': food.carbs,
    'Fat (g)': food.fat,
    'Fiber (g)': food.fiber,
    'Sugar (g)': food.sugar,
    'Sodium (mg)': food.sodium
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="nutrition-tracker"
          title="Macro & Micronutrient Tracker"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Goals</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Calories</label>
            <input
              type="number"
              value={dailyGoals.calories}
              onChange={(e) => setDailyGoals({...dailyGoals, calories: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Protein (g)</label>
            <input
              type="number"
              value={dailyGoals.protein}
              onChange={(e) => setDailyGoals({...dailyGoals, protein: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Carbs (g)</label>
            <input
              type="number"
              value={dailyGoals.carbs}
              onChange={(e) => setDailyGoals({...dailyGoals, carbs: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Fat (g)</label>
            <input
              type="number"
              value={dailyGoals.fat}
              onChange={(e) => setDailyGoals({...dailyGoals, fat: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Fiber (g)</label>
            <input
              type="number"
              value={dailyGoals.fiber}
              onChange={(e) => setDailyGoals({...dailyGoals, fiber: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Sugar (g)</label>
            <input
              type="number"
              value={dailyGoals.sugar}
              onChange={(e) => setDailyGoals({...dailyGoals, sugar: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Sodium (mg)</label>
            <input
              type="number"
              value={dailyGoals.sodium}
              onChange={(e) => setDailyGoals({...dailyGoals, sodium: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Macro Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray={`${(macroCalories.proteinCals / totals.calories) * 100 || 0}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">Protein</span>
              </div>
            </div>
            <p className="text-blue-400 font-bold">{totals.protein}g</p>
            <p className="text-sm text-gray-400">{((macroCalories.proteinCals / totals.calories) * 100 || 0).toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray={`${(macroCalories.carbCals / totals.calories) * 100 || 0}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">Carbs</span>
              </div>
            </div>
            <p className="text-green-400 font-bold">{totals.carbs}g</p>
            <p className="text-sm text-gray-400">{((macroCalories.carbCals / totals.calories) * 100 || 0).toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeDasharray={`${(macroCalories.fatCals / totals.calories) * 100 || 0}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">Fat</span>
              </div>
            </div>
            <p className="text-yellow-400 font-bold">{totals.fat}g</p>
            <p className="text-sm text-gray-400">{((macroCalories.fatCals / totals.calories) * 100 || 0).toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Food</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Food Name"
            value={newFood.name}
            onChange={(e) => setNewFood({...newFood, name: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Serving Size"
            value={newFood.serving}
            onChange={(e) => setNewFood({...newFood, serving: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Calories"
            value={newFood.calories || ''}
            onChange={(e) => setNewFood({...newFood, calories: parseInt(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={newFood.protein || ''}
            onChange={(e) => setNewFood({...newFood, protein: parseInt(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Carbs (g)"
            value={newFood.carbs || ''}
            onChange={(e) => setNewFood({...newFood, carbs: parseInt(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Fat (g)"
            value={newFood.fat || ''}
            onChange={(e) => setNewFood({...newFood, fat: parseInt(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Fiber (g)"
            value={newFood.fiber || ''}
            onChange={(e) => setNewFood({...newFood, fiber: parseInt(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Sugar (g)"
            value={newFood.sugar || ''}
            onChange={(e) => setNewFood({...newFood, sugar: parseInt(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Sodium (mg)"
            value={newFood.sodium || ''}
            onChange={(e) => setNewFood({...newFood, sodium: parseInt(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={addFood}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Food
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Progress</h3>
        <div className="space-y-4">
          {Object.entries(totals).map(([key, value]) => {
            const percentage = percentages[key as keyof typeof percentages];
            const goal = dailyGoals[key as keyof typeof dailyGoals];
            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="capitalize font-medium">{key}</span>
                  <span className="text-sm">
                    {value} / {goal} {key === 'calories' ? '' : key === 'sodium' ? 'mg' : 'g'}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentage > 100 ? 'bg-red-500' : 
                      percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        {foods.map((food) => (
          <div key={food.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{food.name}</h4>
                <p className="text-sm text-gray-400">{food.serving}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-sm">
                  <p>{food.calories} cal</p>
                  <p className="text-gray-400">P:{food.protein} C:{food.carbs} F:{food.fat}</p>
                </div>
                <button
                  onClick={() => removeFood(food.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
