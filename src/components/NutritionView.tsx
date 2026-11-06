import React, { useState } from 'react';
import {
  Utensils,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Droplets,
  Flame,
  Info,
  Clock,
  Sparkles,
  Plus,
  Edit2,
  Scale,
} from 'lucide-react';
import { Pet, NutritionPlan } from '../types';

interface NutritionViewProps {
  pets: Pet[];
  nutritionPlans: NutritionPlan[];
  onToggleMeal: (planId: string, mealId: string) => void;
  onUpdatePlan: (planId: string, updates: Partial<NutritionPlan>) => void;
}

const SPECIES_TIPS: Record<string, { guidelines: string[]; toxicFoods: string[]; hydration: string }> = {
  Dog: {
    guidelines: [
      'Balanced protein (22-28%) with essential fatty acids for coat luster and joint health.',
      'Portion control prevents obesity and extends life expectancy by up to 2.5 years.',
      'Avoid high-sodium table scraps; use freeze-dried liver or apple slices as training treats.',
    ],
    toxicFoods: [
      'Chocolate & Cocoa',
      'Xylitol / Birch Sugar (gum, baked goods)',
      'Grapes & Raisins',
      'Onions, Chives & Garlic',
      'Macadamia Nuts & Cooked Bones',
    ],
    hydration: 'Approx. 50-60 ml of fresh water per kg of bodyweight per day.',
  },
  Cat: {
    guidelines: [
      'Obligate carnivores: requires dietary taurine, arachidonic acid, and high moisture.',
      'Wet food helps prevent chronic feline lower urinary tract disease (FLUTD).',
      'Feed frequent small meals mimicking natural hunting behavior.',
    ],
    toxicFoods: [
      'Lilies (deadly even in pollen form)',
      'Onions, Garlic, Shallots',
      'Raw Bread Dough & Yeast',
      'Chocolate, Caffeine & Alcohol',
      'Human NSAIDs or Acetaminophen',
    ],
    hydration: 'Cats have a low thirst drive; clean recirculating water fountains increase fluid intake.',
  },
  Rabbit: {
    guidelines: [
      '80-85% of total diet must be continuous, uncompressed fresh grass hay (Timothy or Meadow).',
      'Daily green leafy vegetables (cilantro, parsley, romaine, dill, mint).',
      'Limit plain pellets to 20-25g per kg; avoid seed and muesli mixes.',
    ],
    toxicFoods: [
      'Avocado (persin toxicity)',
      'Apple or peach seeds (cyanide)',
      'Rhubarb & potato leaves',
      'High-sugar yogurt drops or corn',
      'Iceberg lettuce (lactucarium)',
    ],
    hydration: 'Always provide a heavy ceramic water dish cleaned daily; rabbits drink as much as small dogs.',
  },
};

export const NutritionView: React.FC<NutritionViewProps> = ({
  pets,
  nutritionPlans,
  onToggleMeal,
  onUpdatePlan,
}) => {
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);

  const currentPet = pets.find(p => p.id === selectedPetId) || pets[0];
  const currentPlan = nutritionPlans.find(p => p.petId === currentPet?.id) || nutritionPlans[0];

  const speciesData = currentPet ? (SPECIES_TIPS[currentPet.type] || SPECIES_TIPS.Dog) : SPECIES_TIPS.Dog;

  // Local edit states
  const [brand, setBrand] = useState(currentPlan?.brand || '');
  const [portionGrams, setPortionGrams] = useState(currentPlan?.portionGrams || 200);
  const [foodType, setFoodType] = useState(currentPlan?.foodType || 'Dry Kibble');
  const [calories, setCalories] = useState(currentPlan?.calorieTargetKcal || 1000);

  const handleSavePlan = () => {
    if (!currentPlan) return;
    onUpdatePlan(currentPlan.id, {
      brand,
      portionGrams: Number(portionGrams),
      foodType,
      calorieTargetKcal: Number(calories),
    });
    setIsEditing(false);
  };

  if (!currentPet) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        Please register a pet to configure and view nutrition plans.
      </div>
    );
  }

  const completedMealsCount = currentPlan?.meals.filter(m => m.completedToday).length || 0;
  const totalMealsCount = currentPlan?.meals.length || 0;
  const routineProgress = totalMealsCount > 0 ? Math.round((completedMealsCount / totalMealsCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header & Pet Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Utensils className="w-5 h-5 text-teal-600" />
            Food & Nutrition Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Balanced diet schedules, daily feeding checklist, species guidelines, and safety alerts
          </p>
        </div>

        {/* Pet Selector tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {pets.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPetId(p.id);
                setIsEditing(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPetId === p.id
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <img
                src={p.photoUrl}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded-full object-cover"
              />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Plan Details & Feeding Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Feeding Plan & Routine */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Feeding Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                  Daily Feeding Routine
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Today's Meals for {currentPet.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 tabular-nums">
                  {completedMealsCount}/{totalMealsCount} Completed ({routineProgress}%)
                </span>
                <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all duration-300"
                    style={{ width: `${routineProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {currentPlan?.meals.map(meal => (
                <div
                  key={meal.id}
                  onClick={() => onToggleMeal(currentPlan.id, meal.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    meal.completedToday
                      ? 'bg-teal-50/50 border-teal-200 text-slate-700'
                      : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="focus:outline-hidden text-teal-600 shrink-0"
                    >
                      {meal.completedToday ? (
                        <CheckCircle2 className="w-5 h-5 text-teal-600 fill-teal-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-semibold ${meal.completedToday ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {meal.title}
                        </h4>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono tabular-nums">
                          <Clock className="w-3 h-3" />
                          {meal.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {meal.portion}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                    meal.completedToday
                      ? 'bg-emerald-100/70 text-emerald-800'
                      : 'bg-slate-200/60 text-slate-700'
                  }`}>
                    {meal.completedToday ? 'Fed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 mt-3 italic text-right">
              Click meal card to toggle feeding status
            </p>
          </div>

          {/* Current Nutrition Plan & Portions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Veterinary Nutrition Formulation
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Recommended Formula & Portions
                </h3>
              </div>
              <button
                onClick={() => {
                  if (isEditing) {
                    handleSavePlan();
                  } else {
                    setBrand(currentPlan?.brand || '');
                    setPortionGrams(currentPlan?.portionGrams || 200);
                    setFoodType(currentPlan?.foodType || 'Dry Kibble');
                    setCalories(currentPlan?.calorieTargetKcal || 1000);
                    setIsEditing(true);
                  }
                }}
                className="py-1 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {isEditing ? 'Save Plan' : 'Adjust Plan'}
              </button>
            </div>

            {isEditing ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Food Category</label>
                    <select
                      value={foodType}
                      onChange={e => setFoodType(e.target.value as NutritionPlan['foodType'])}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md"
                    >
                      <option value="Dry Kibble">Dry Kibble</option>
                      <option value="Wet Food">Wet Food (Cans / Pouches)</option>
                      <option value="Raw Food">Raw / Fresh Frozen</option>
                      <option value="Prescription Diet">Prescription Veterinary Diet</option>
                      <option value="Custom Mix">Custom Hay & Mix</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Brand & Recipe</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={e => setBrand(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Total Daily Portion (grams)</label>
                    <input
                      type="number"
                      value={portionGrams}
                      onChange={e => setPortionGrams(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Target Calories (kcal/day)</label>
                    <input
                      type="number"
                      value={calories}
                      onChange={e => setCalories(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md tabular-nums"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePlan}
                    className="px-3 py-1 bg-teal-600 text-white rounded font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Food Type</span>
                  <span className="text-sm font-bold text-slate-800">{currentPlan?.foodType}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Daily Intake</span>
                  <span className="text-sm font-bold text-slate-800 font-mono tabular-nums">{currentPlan?.portionGrams}g / day</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Daily Energy</span>
                  <span className="text-sm font-bold text-teal-700 font-mono tabular-nums">{currentPlan?.calorieTargetKcal} kcal</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Frequency</span>
                  <span className="text-sm font-bold text-slate-800">{currentPlan?.frequencyTimesPerDay} meals / day</span>
                </div>
              </div>
            )}

            <div className="text-xs text-slate-600 space-y-1.5 pt-2">
              <div className="font-semibold text-slate-800">
                Primary Brand: <span className="text-teal-800 font-normal">{currentPlan?.brand}</span>
              </div>
              <div>
                <strong>Hydration Guidance:</strong> {currentPlan?.hydrationNotes}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Species Nutrition Tips & Toxic Foods */}
        <div className="space-y-6">
          {/* Species Guidelines */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-teal-600" />
              {currentPet.type} Nutrition Science
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {speciesData.guidelines.map((g, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-sky-800 bg-sky-50/70 p-3 rounded-xl border border-sky-200">
              <Droplets className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Hydration Target</span>
                {speciesData.hydration}
              </div>
            </div>
          </div>

          {/* Toxic Foods Warning */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              Toxic & Dangerous Foods for {currentPet.type}s
            </div>
            <p className="text-xs text-rose-700 mb-3">
              Strictly prevent ingestion. If consumed, contact your veterinarian immediately.
            </p>
            <ul className="space-y-1.5 text-xs text-rose-900">
              {speciesData.toxicFoods.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
