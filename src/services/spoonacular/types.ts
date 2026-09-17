export type SpoonacularNutrient = {
  name: string;
  amount: number;
  unit: string;
};

export type SpoonacularExtendedIngredient = {
  id: number;
  name: string;
  original: string;
  amount: number;
  unit: string;
};

export type SpoonacularAnalyzedInstructionStep = {
  number: number;
  step: string;
};

export type SpoonacularAnalyzedInstruction = {
  name: string;
  steps: SpoonacularAnalyzedInstructionStep[];
};

export type SpoonacularRecipe = {
  id: number;
  title: string;
  image?: string;
  readyInMinutes: number;
  servings: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dishTypes: string[];
  diets: string[];
  extendedIngredients: SpoonacularExtendedIngredient[];
  analyzedInstructions: SpoonacularAnalyzedInstruction[];
  nutrition?: {
    nutrients: SpoonacularNutrient[];
  };
};

export type SpoonacularComplexSearchResponse = {
  results: SpoonacularRecipe[];
  totalResults: number;
};
