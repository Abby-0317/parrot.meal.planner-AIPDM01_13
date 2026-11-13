export const MEAL_STORAGE_KEY = 'parrot-meal-plans';
export const TOXIC_FOOD_IDS = new Set(['avocado', 'chocolate', 'coffee', 'caffeine', 'alcohol', 'onion', 'garlic', 'xylitol']);
export const TOXIC_FOOD_WORDS = ['酪梨', '巧克力', '咖啡', '咖啡因', '酒精', '洋蔥', '大蒜', '木糖醇'];

function isToxic(food) {
  const text = `${food.food_id || ''} ${food.name_zh || ''}`.toLowerCase();
  return TOXIC_FOOD_IDS.has(food.food_id) || TOXIC_FOOD_WORDS.some((word) => text.includes(word));
}

export function emptyMealStore() { return { schemaVersion: 1, plansByBirdId: {} }; }

export function loadMealStore(storage = window.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(MEAL_STORAGE_KEY) || 'null');
    if (!parsed || parsed.schemaVersion !== 1 || !parsed.plansByBirdId || typeof parsed.plansByBirdId !== 'object') return emptyMealStore();
    return parsed;
  } catch { return emptyMealStore(); }
}

export function saveMealPlan(plan, storage = window.localStorage) {
  const store = loadMealStore(storage);
  store.plansByBirdId[plan.bird_id] = plan;
  storage.setItem(MEAL_STORAGE_KEY, JSON.stringify(store));
  return plan;
}

export function preflightMeal({ bird, species, foods }) {
  if (!bird) return { ok: false, code: 'NO_BIRD', message: '請先從鸚鵡檔案選擇一隻鳥寶。' };
  if (!species || !bird.species_id || !bird.diet_group) return { ok: false, code: 'INCOMPLETE_BIRD', message: '鳥寶的品種或食性資料不完整，請先回到檔案補齊資料。' };
  if (!Array.isArray(foods) || foods.length === 0) return { ok: false, code: 'NO_FOOD_DATA', message: '目前讀不到可用食材，請稍後再試。' };
  if (species.diet_group === 'group_nectar' || species.species_id === 'honey_eater') return { ok: false, code: 'NECTAR_RULE_DATA_MISSING', message: '吸蜜鳥的限鐵資料尚未完成，為了安全目前先不生成菜單。' };
  return { ok: true };
}

export function buildCandidates({ species, foods }) {
  const allowed = foods.filter((food) => !isToxic(food) && !species.banned_categories?.includes(food.category));
  const priority = allowed.filter((food) => species.priority_categories?.includes(food.category));
  return priority.length >= 2 ? priority : allowed;
}

export function nutritionStatus(items) {
  const total = items.reduce((sum, item) => sum + item.grams, 0);
  const vegetables = items.filter((item) => item.category.startsWith('cat_veg')).length;
  if (total <= 0) return { level: 'not-met', label: '未通過', reason: '目前沒有可計算的食材份量。' };
  if (vegetables >= 1) return { level: 'green', label: '營養綠燈', reason: '今天有蔬果與可追蹤份量，符合目前資料規則。' };
  return { level: 'caution', label: '需留意', reason: '今天的蔬果比例不足，請檢查食材搭配。' };
}

export function generateSevenDayMenu({ bird, species, foods, now = new Date() }) {
  const preflight = preflightMeal({ bird, species, foods });
  if (!preflight.ok) return { ok: false, error: preflight };
  const candidates = buildCandidates({ species, foods });
  if (candidates.length < 2) return { ok: false, error: { code: 'NO_SAFE_CANDIDATES', message: '找不到足夠的安全食材，這次不建立半成品菜單。' } };
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now); date.setDate(date.getDate() + index);
    const items = [0, 1].map((mealIndex) => {
      const food = candidates[(index + mealIndex) % candidates.length];
      const grams = Number(food.grams_per_unit);
      return { food_id: food.food_id, name_zh: food.name_zh, category: food.category, meal: mealIndex === 0 ? '上午' : '下午', grams, unit: food.unit_label || '小塊', unit_scale_hint: species.unit_scale_hint || '以 1 元硬幣為比例尺', prep_note: food.prep_note || '' };
    });
    return { date: date.toISOString().slice(0, 10), items, nutrition: nutritionStatus(items) };
  });
  return { ok: true, plan: { plan_id: `menu-${bird.bird_id}-${Date.now()}`, bird_id: bird.bird_id, species_id: bird.species_id, created_at: now.toISOString(), days } };
}
