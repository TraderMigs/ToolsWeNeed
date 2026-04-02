// Comprehensive food database with nutritional information
export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sugar_per_100g: number;
  sodium_per_100g: number;
  low_glycemic: boolean;
  heart_healthy: boolean;
  diet_suitability: string[];
  common_serving_size: string;
  serving_size_grams: number;
}

export const foodDatabase: FoodItem[] = [
  // Proteins
  {
    id: "chicken-breast",
    name: "Chicken Breast (skinless)",
    category: "Protein",
    calories_per_100g: 165,
    protein_per_100g: 31,
    carbs_per_100g: 0,
    fat_per_100g: 3.6,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 74,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["keto", "paleo", "low-carb"],
    common_serving_size: "1 breast (174g)",
    serving_size_grams: 174
  },
  {
    id: "salmon",
    name: "Atlantic Salmon",
    category: "Protein",
    calories_per_100g: 208,
    protein_per_100g: 25,
    carbs_per_100g: 0,
    fat_per_100g: 12,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 59,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["keto", "paleo", "mediterranean"],
    common_serving_size: "1 fillet (150g)",
    serving_size_grams: 150
  },
  {
    id: "eggs",
    name: "Large Eggs",
    category: "Protein",
    calories_per_100g: 155,
    protein_per_100g: 13,
    carbs_per_100g: 1.1,
    fat_per_100g: 11,
    fiber_per_100g: 0,
    sugar_per_100g: 1.1,
    sodium_per_100g: 124,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["keto", "paleo", "vegetarian"],
    common_serving_size: "2 large eggs (100g)",
    serving_size_grams: 100
  },
  
  // Vegetables
  {
    id: "avocado",
    name: "Avocado",
    category: "Vegetables",
    calories_per_100g: 160,
    protein_per_100g: 2,
    carbs_per_100g: 9,
    fat_per_100g: 15,
    fiber_per_100g: 7,
    sugar_per_100g: 0.7,
    sodium_per_100g: 7,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["keto", "paleo", "vegan", "mediterranean"],
    common_serving_size: "1 medium (150g)",
    serving_size_grams: 150
  },
  {
    id: "spinach",
    name: "Fresh Spinach",
    category: "Vegetables",
    calories_per_100g: 23,
    protein_per_100g: 2.9,
    carbs_per_100g: 3.6,
    fat_per_100g: 0.4,
    fiber_per_100g: 2.2,
    sugar_per_100g: 0.4,
    sodium_per_100g: 79,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["keto", "paleo", "vegan", "vegetarian"],
    common_serving_size: "1 cup (30g)",
    serving_size_grams: 30
  },
  {
    id: "broccoli",
    name: "Broccoli",
    category: "Vegetables",
    calories_per_100g: 34,
    protein_per_100g: 2.8,
    carbs_per_100g: 7,
    fat_per_100g: 0.4,
    fiber_per_100g: 2.6,
    sugar_per_100g: 1.5,
    sodium_per_100g: 33,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["keto", "paleo", "vegan", "vegetarian"],
    common_serving_size: "1 cup chopped (91g)",
    serving_size_grams: 91
  },
  
  // Fruits
  {
    id: "blueberries",
    name: "Blueberries",
    category: "Fruits",
    calories_per_100g: 57,
    protein_per_100g: 0.7,
    carbs_per_100g: 14,
    fat_per_100g: 0.3,
    fiber_per_100g: 2.4,
    sugar_per_100g: 10,
    sodium_per_100g: 1,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["paleo", "vegan", "vegetarian"],
    common_serving_size: "1 cup (148g)",
    serving_size_grams: 148
  },
  {
    id: "apple",
    name: "Apple (with skin)",
    category: "Fruits",
    calories_per_100g: 52,
    protein_per_100g: 0.3,
    carbs_per_100g: 14,
    fat_per_100g: 0.2,
    fiber_per_100g: 2.4,
    sugar_per_100g: 10,
    sodium_per_100g: 1,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["paleo", "vegan", "vegetarian"],
    common_serving_size: "1 medium (182g)",
    serving_size_grams: 182
  },
  
  // Grains
  {
    id: "quinoa",
    name: "Quinoa (cooked)",
    category: "Grains",
    calories_per_100g: 120,
    protein_per_100g: 4.4,
    carbs_per_100g: 22,
    fat_per_100g: 1.9,
    fiber_per_100g: 2.8,
    sugar_per_100g: 0.9,
    sodium_per_100g: 7,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["vegan", "vegetarian", "gluten-free"],
    common_serving_size: "1 cup cooked (185g)",
    serving_size_grams: 185
  },
  {
    id: "brown-rice",
    name: "Brown Rice (cooked)",
    category: "Grains",
    calories_per_100g: 111,
    protein_per_100g: 2.6,
    carbs_per_100g: 23,
    fat_per_100g: 0.9,
    fiber_per_100g: 1.8,
    sugar_per_100g: 0.4,
    sodium_per_100g: 5,
    low_glycemic: false,
    heart_healthy: true,
    diet_suitability: ["vegan", "vegetarian", "gluten-free"],
    common_serving_size: "1 cup cooked (195g)",
    serving_size_grams: 195
  },
  
  // Nuts & Seeds
  {
    id: "almonds",
    name: "Almonds",
    category: "Nuts & Seeds",
    calories_per_100g: 579,
    protein_per_100g: 21,
    carbs_per_100g: 22,
    fat_per_100g: 50,
    fiber_per_100g: 12,
    sugar_per_100g: 4.4,
    sodium_per_100g: 1,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["keto", "paleo", "vegan", "vegetarian"],
    common_serving_size: "1 oz (28g)",
    serving_size_grams: 28
  },
  {
    id: "chia-seeds",
    name: "Chia Seeds",
    category: "Nuts & Seeds",
    calories_per_100g: 486,
    protein_per_100g: 17,
    carbs_per_100g: 42,
    fat_per_100g: 31,
    fiber_per_100g: 34,
    sugar_per_100g: 0,
    sodium_per_100g: 16,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["keto", "paleo", "vegan", "vegetarian"],
    common_serving_size: "1 tbsp (12g)",
    serving_size_grams: 12
  },
  
  // Dairy
  {
    id: "greek-yogurt",
    name: "Greek Yogurt (plain, nonfat)",
    category: "Dairy",
    calories_per_100g: 59,
    protein_per_100g: 10,
    carbs_per_100g: 3.6,
    fat_per_100g: 0.4,
    fiber_per_100g: 0,
    sugar_per_100g: 3.6,
    sodium_per_100g: 36,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["vegetarian", "low-carb"],
    common_serving_size: "1 cup (245g)",
    serving_size_grams: 245
  },
  
  // Beverages
  {
    id: "green-tea",
    name: "Green Tea (brewed)",
    category: "Beverages",
    calories_per_100g: 1,
    protein_per_100g: 0,
    carbs_per_100g: 0,
    fat_per_100g: 0,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 1,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["keto", "paleo", "vegan", "vegetarian"],
    common_serving_size: "1 cup (240ml)",
    serving_size_grams: 240
  },
  
  // Fast-breaking foods
  {
    id: "bone-broth",
    name: "Bone Broth",
    category: "Beverages",
    calories_per_100g: 31,
    protein_per_100g: 6,
    carbs_per_100g: 0.5,
    fat_per_100g: 1.2,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 343,
    low_glycemic: true,
    heart_healthy: true,
    diet_suitability: ["keto", "paleo"],
    common_serving_size: "1 cup (240ml)",
    serving_size_grams: 240
  }
];

export const getFastBreakingFoods = (): FoodItem[] => {
  return foodDatabase.filter(food => 
    food.low_glycemic && 
    (food.heart_healthy || food.category === "Protein" || food.name.includes("Broth"))
  );
};

export const searchFoods = (query: string): FoodItem[] => {
  if (!query.trim()) return foodDatabase;
  
  const lowercaseQuery = query.toLowerCase();
  return foodDatabase.filter(food =>
    food.name.toLowerCase().includes(lowercaseQuery) ||
    food.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getFoodsByCategory = (category: string): FoodItem[] => {
  return foodDatabase.filter(food => food.category === category);
};

export const getCategories = (): string[] => {
  return [...new Set(foodDatabase.map(food => food.category))];
};