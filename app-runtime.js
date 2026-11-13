const app = document.querySelector('#app');
import { generateSevenDayMenu, loadMealStore, saveMealPlan } from './meal-planner.js';

export const STORAGE_KEY = 'parrot-meal-planner';
export const SCHEMA_VERSION = 1;
const SPECIES_URL = './backend/species.json';
const FOOD_URL = './backend/seeds.json';
const DIET_LABELS = {
  group_grass_parakeet: '草食型鸚鵡',
  group_small_forager: '小型覓食型',
  group_neotropical_fruit: '新世界水果型',
};

export const state = { view: 'home', formReturnView: 'home', birds: [], speciesProfiles: [], speciesStatus: 'loading', foods: [], foodStatus: 'loading', mealPlans: {}, selectedBirdId: '', mealError: '', mealLoading: false, formDirty: false, formValues: {}, formErrors: {} };

export function emptyEnvelope() { return { schemaVersion: SCHEMA_VERSION, birds: [] }; }

export function loadStore(storage = window.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return emptyEnvelope();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== SCHEMA_VERSION || !Array.isArray(parsed.birds)) return emptyEnvelope();
    return { schemaVersion: SCHEMA_VERSION, birds: parsed.birds.filter((bird) => bird && typeof bird === 'object') };
  } catch { return emptyEnvelope(); }
}

export function saveStore(birds, storage = window.localStorage) {
  const envelope = { schemaVersion: SCHEMA_VERSION, birds };
  storage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  return envelope;
}

export async function loadSpecies(fetcher = fetch) {
  try {
    const response = await fetcher(SPECIES_URL);
    if (!response.ok) throw new Error(`Species request failed: ${response.status}`);
    const data = await response.json();
    const profiles = Array.isArray(data?.species_profiles) ? data.species_profiles : [];
    state.speciesProfiles = profiles.map((profile) => ({ ...profile, color: profile.diet_group === 'group_grass_parakeet' ? '#384D35' : '#B86A48' }));
    state.speciesStatus = state.speciesProfiles.length === 6 ? 'ready' : 'invalid';
  } catch { state.speciesProfiles = []; state.speciesStatus = 'error'; }
  return state.speciesProfiles;
}

export async function loadFoods(fetcher = fetch) {
  try {
    const response = await fetcher(FOOD_URL);
    if (!response.ok) throw new Error(`Food request failed: ${response.status}`);
    const data = await response.json();
    state.foods = Array.isArray(data?.food_items) ? data.food_items : [];
    state.foodStatus = state.foods.length ? 'ready' : 'invalid';
  } catch { state.foods = []; state.foodStatus = 'error'; }
  return state.foods;
}

export function weatherAlert({ temperature, humidity }) {
  if (temperature < 18) return '目前溫度偏低，請留意鳥寶保暖。';
  if (temperature > 30) return '目前溫度偏高，請留意鳥寶降溫。';
  if (humidity > 80) return '目前濕度偏高，請保持通風並留意環境。';
  return '';
}

function newId() { return globalThis.crypto?.randomUUID?.() || `bird-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function dietLabel(group) { return DIET_LABELS[group] || '尚未分類'; }

function renderWeatherCard() {
  return `<section class="card weather-card section" aria-labelledby="weather-title"><p class="eyebrow">今日環境</p><h2 id="weather-title">鳥寶居家小氣候</h2><div class="weather-empty"><strong>尚無氣溫與濕度資料</strong>目前沒有連接環境資料來源。取得數值後，這裡會顯示今日環境與照護提醒。</div></section>`;
}

function renderBirdCard(bird) {
  return `<article class="card bird-card" data-bird-id="${bird.bird_id}"><div class="bird-card-heading"><span class="species-swatch" style="background:${bird.species_color || '#384D35'}" aria-hidden="true"></span><div><p class="eyebrow">${bird.species_name}</p><h2>${bird.name}</h2></div></div><div class="bird-details"><span>體重 <strong>${bird.weight_g} 克</strong></span><span>${dietLabel(bird.diet_group)}</span></div><button class="primary-button meal-button" type="button" data-action="generate-menu" data-bird-id="${bird.bird_id}">為 ${bird.name} 生成七日菜單</button></article>`;
}

function renderHomeMenu() {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return `<div class="week-day${index === 0 ? ' is-today' : ''}" ${index === 0 ? 'aria-current="date"' : ''}><span>${index === 0 ? '今天' : new Intl.DateTimeFormat('zh-TW', { weekday: 'short' }).format(date)}</span><strong>${date.getDate()}</strong></div>`;
  }).join('');
  const menus = state.birds.map((bird) => {
    const plan = state.mealPlans[bird.bird_id];
    const todayKey = new Date().toLocaleDateString('en-CA');
    const firstDay = plan?.days?.find((day) => day.date === todayKey);
    return `<article class="card bird-card section"><div class="bird-card-heading"><span class="species-swatch" style="background:${bird.species_color || '#384D35'}" aria-hidden="true"></span><div><p class="eyebrow">${bird.species_name}</p><h2>${bird.name}</h2></div></div>${firstDay ? `<p class="muted">今日餐盤</p><ul class="home-food-list">${firstDay.items.map((item) => `<li><span aria-hidden="true">🌿</span><span>${item.name_zh}</span><strong>${item.unit}</strong></li>`).join('')}</ul><button class="secondary-button meal-button" type="button" data-action="open-menu" data-bird-id="${bird.bird_id}">查看七日菜單</button>` : `<div class="meal-empty card"><div class="meal-empty-icon" aria-hidden="true">🥣</div><p>尚未安排今日菜單</p><button class="secondary-button" type="button" data-action="go-profiles">到鸚鵡檔案建立菜單</button></div>`}</article>`;
  }).join('');
  return `<section class="section" aria-labelledby="week-title"><p class="eyebrow">本週照護安排</p><h2 id="week-title">七日營養菜單</h2><div class="week-strip" aria-label="從今天起七日">${days}</div>${state.birds.length ? menus : '<div class="card meal-empty"><div class="meal-empty-icon" aria-hidden="true">🥣</div><p>建立鳥寶後，就能安排專屬菜單。</p></div>'}</section>`;
}

function renderMealPage() {
  const bird = state.birds.find((item) => item.bird_id === state.selectedBirdId);
  const plan = bird ? state.mealPlans[bird.bird_id] : null;
  if (state.mealLoading) return `<main class="app-main" aria-labelledby="meal-title"><header class="app-header"><button class="secondary-button" type="button" data-action="back-profiles">← 返回</button><span class="brand">七日菜單</span><span aria-hidden="true"></span></header><section class="card empty-state"><h1 id="meal-title">正在檢查鳥寶資料</h1><p>先確認食性與安全食材，再產生菜單。</p></section></main>`;
  if (state.mealError) return `<main class="app-main" aria-labelledby="meal-title"><header class="app-header"><button class="secondary-button" type="button" data-action="back-profiles">← 返回</button><span class="brand">七日菜單</span><span aria-hidden="true"></span></header><section class="card empty-state" role="alert"><div class="empty-icon" aria-hidden="true">!</div><h1 id="meal-title">目前無法生成菜單</h1><p>${state.mealError}</p><button class="secondary-button" type="button" data-action="back-profiles">回到鸚鵡檔案</button></section></main>`;
  if (!bird || !plan) return `<main class="app-main" aria-labelledby="meal-title"><header class="app-header"><span class="brand">七日菜單</span></header><section class="card empty-state"><h1 id="meal-title">請先選擇鳥寶</h1><p>從鸚鵡檔案選擇指定鳥寶後，再生成七日菜單。</p></section></main>`;
  return `<main class="app-main" aria-labelledby="meal-title"><header class="app-header"><button class="secondary-button" type="button" data-action="back-profiles">← 返回</button><span class="brand">七日菜單</span><span class="muted">${bird.name}</span></header><section class="section"><p class="eyebrow">指定鳥寶</p><h1 id="meal-title">${bird.name} 的七日菜單</h1><p class="muted">份量以生活化單位呈現；需要判斷大小時，以 1 元硬幣為比例尺。</p></section><section class="meal-days section">${plan.days.map((day, index) => `<article class="card meal-day"><div class="meal-day-heading"><h2>第 ${index + 1} 天 <span class="muted">${day.date}</span></h2><span class="nutrition-badge ${day.nutrition.level}">${day.nutrition.label}</span></div><p class="muted">${day.nutrition.reason}</p><ul>${day.items.map((item) => `<li><strong>${item.meal}｜${item.name_zh}</strong><span>${item.grams}g・${item.unit}・${item.unit_scale_hint}</span></li>`).join('')}</ul></article>`).join('')}</section><footer class="disclaimer">營養綠燈是資料規則檢查結果，不是獸醫診斷。</footer></main>`;
}

function renderHome() {
  const hasBirds = state.birds.length > 0;
  return `<main class="app-main" aria-labelledby="page-title">
    <header class="app-header"><span class="brand">鸚鵡日常</span><span class="muted" aria-label="目前頁面">首頁</span></header>
    <section class="section home-heading">
      <div><p class="eyebrow">好好吃飯，好好生活</p><h1 id="page-title">${hasBirds ? '今天也照顧好鳥寶' : '先從鳥寶開始'}</h1></div>
    </section>
    ${hasBirds
      ? `<section class="card section bird-summary home-bird-card" aria-labelledby="home-bird-title"><p class="eyebrow">今日照護鳥寶</p><h2 id="home-bird-title">${state.birds[0].name}</h2><p class="muted">${state.birds.length > 1 ? `還有 ${state.birds.length - 1} 隻鳥寶，完整資料請到鸚鵡檔案查看` : '完整資料請到鸚鵡檔案查看'}</p><button class="secondary-button" type="button" data-action="go-profiles">查看鸚鵡檔案</button></section>`
      : '<section class="card empty-state" aria-labelledby="empty-title"><div class="empty-icon" aria-hidden="true">🦜</div><h2 id="empty-title">先建立鳥寶，才能產生專屬飲食建議</h2><p>填寫基本資料後，我們會把每日照顧資訊整理在這裡。</p><button class="primary-button" type="button" data-action="go-profiles">前往鸚鵡檔案</button></section>'}
    ${renderWeatherCard()}
    ${renderHomeMenu()}
    <footer class="disclaimer">僅供健康日常鮮食參考，病鳥請遵照獸醫指示</footer>
  </main>`;
}

function renderProfiles() {
  const hasBirds = state.birds.length > 0;
  return `<main class="app-main" aria-labelledby="profiles-title">
    <header class="app-header"><span class="brand">鸚鵡日常</span><span class="muted" aria-label="目前頁面">鸚鵡檔案</span></header>
    <section class="section home-heading">
      <div><p class="eyebrow">認識每一位鳥寶</p><h1 id="profiles-title">鸚鵡檔案</h1></div>
      ${hasBirds ? '<button class="secondary-button add-button" type="button" data-action="open-form">新增鳥寶</button>' : ''}
    </section>
    ${hasBirds
      ? `<section class="bird-list section" aria-label="鳥寶列表">${state.birds.map(renderBirdCard).join('')}</section>`
      : '<section class="card empty-state" aria-labelledby="profiles-empty-title"><div class="empty-icon" aria-hidden="true">🦜</div><h2 id="profiles-empty-title">還沒有鳥寶檔案</h2><p>先建立第一隻鳥寶，之後就能從這裡查看牠的資料。</p><button class="primary-button" type="button" data-action="open-form">建立第一隻鳥寶</button></section>'}
  </main>`;
}

function renderEmptyPage(view, title, description, icon) {
  return `<main class="app-main" aria-labelledby="${view}-title"><header class="app-header"><span class="brand">鸚鵡日常</span><span class="muted" aria-label="目前頁面">${title}</span></header><section class="card empty-state page-empty-state"><div class="empty-icon" aria-hidden="true">${icon}</div><p class="eyebrow">功能準備中</p><h1 id="${view}-title">${title}</h1><p>${description}</p><span class="status-pill">即將開放</span></section></main>`;
}

function renderBottomNav() {
  const items = [
    ['home', '⌂', '首頁'],
    ['profiles', '🦜', '鸚鵡檔案'],
    ['care', '♡', '照顧紀錄'],
    ['spots', '⌖', '鳥聚點'],
  ];
  const activeView = state.view === 'form' ? state.formReturnView : state.view;
  return `<nav class="bottom-nav" aria-label="主要導覽">${items.map(([view, icon, label]) => `<button class="bottom-nav-item${activeView === view ? ' is-active' : ''}" type="button" data-nav-view="${view}" aria-current="${activeView === view ? 'page' : 'false'}"><span class="bottom-nav-icon" aria-hidden="true">${icon}</span><span>${label}</span></button>`).join('')}</nav>`;
}

function formError(id, message) { return message ? `<p class="field-error" id="${id}-error" role="alert">${message}</p>` : ''; }

function renderSpeciesOptions(selected = '') {
  if (state.speciesStatus === 'loading') return '<option value="">品種資料載入中…</option>';
  if (state.speciesStatus !== 'ready') return '<option value="">品種資料暫時無法載入</option>';
  return `<option value="">請選擇品種</option>${state.speciesProfiles.map((profile) => `<option value="${profile.species_id}" ${profile.species_id === selected ? 'selected' : ''}>${profile.name_zh}</option>`).join('')}`;
}

function renderForm() {
  const values = state.formValues || {};
  const errors = state.formErrors || {};
  const selected = state.speciesProfiles.find((profile) => profile.species_id === values.species);
  return `<main class="app-main profile-create-page" aria-labelledby="form-title">
    <header class="app-header">
      <button class="secondary-button" type="button" data-action="back-form" aria-label="返回鸚鵡檔案">← 返回</button>
      <span class="brand">鸚鵡日常</span>
      <span class="muted profile-local-label">本機保存</span>
    </header>
    <section class="section profile-create-hero">
      <p class="profile-hero-tag">🌱 鳥寶專屬照護</p>
      <h1 id="form-title">建立鳥寶檔案</h1>
      <p>填寫基本資料，讓每份飲食建議都對應正確的鳥寶。</p>
      <span class="profile-count">已加入 ${state.birds.length} 隻</span>
    </section>
    <section class="section">
      <div class="profile-form-heading">
        <h2>基本資料</h2>
        <p>飲食類型會依照品種自動判斷。</p>
      </div>
      <form class="card form-card" data-profile-form novalidate>
        <div class="form-field">
          <label for="bird-name">鳥寶名字</label>
          <input id="bird-name" name="name" value="${values.name || ''}" placeholder="例如：小羽" autocomplete="off" aria-invalid="${Boolean(errors.name)}" aria-describedby="${errors.name ? 'bird-name-error' : ''}" />
          ${formError('bird-name', errors.name)}
        </div>
        <div class="form-field">
          <label for="bird-species">品種</label>
          <select id="bird-species" name="species" aria-invalid="${Boolean(errors.species)}" aria-describedby="${errors.species ? 'bird-species-error' : ''}">${renderSpeciesOptions(values.species)}</select>
          ${formError('bird-species', errors.species)}
        </div>
        <div class="form-field">
          <label for="bird-weight">體重（克）</label>
          <input id="bird-weight" name="weight" type="number" inputmode="decimal" step="0.1" min="0" value="${values.weight || ''}" placeholder="例如：85.5" aria-invalid="${Boolean(errors.weight)}" aria-describedby="${errors.weight ? 'bird-weight-error' : ''}" />
          ${formError('bird-weight', errors.weight)}
        </div>
        <div class="form-field">
          <label for="bird-diet">飲食類型</label>
          <input id="bird-diet" value="${selected ? dietLabel(selected.diet_group) : '選擇品種後自動分類'}" readonly aria-readonly="true" />
        </div>
        <div class="notice">品種會自動帶入適合的食性群組，避免誤選不適用的飲食類型。</div>
        <div class="form-actions">
          <button class="primary-button" type="submit" ${state.speciesStatus === 'ready' ? '' : 'disabled'}>確認建立鳥寶</button>
          <button class="secondary-button" type="button" data-action="back-form">返回鸚鵡檔案</button>
        </div>
      </form>
    </section>
    <footer class="disclaimer">僅供健康日常鮮食參考，病鳥請遵照獸醫指示</footer>
  </main>`;
}

function validateProfile(values) {
  const errors = {};
  const name = values.name.trim();
  const weight = Number(values.weight);
  if (!name) errors.name = '請輸入鳥寶名字。';
  if (state.birds.some((bird) => bird.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase())) errors.name = '這個名字已經使用過，請換一個名字。';
  if (!state.speciesProfiles.some((profile) => profile.species_id === values.species)) errors.species = '請選擇支援的品種。';
  if (!values.weight || !Number.isFinite(weight) || weight <= 0) errors.weight = '請輸入大於 0 的體重克數。';
  return errors;
}

function handleSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const values = { name: String(form.get('name') || ''), species: String(form.get('species') || ''), weight: String(form.get('weight') || '') };
  state.formValues = values;
  state.formErrors = validateProfile(values);
  if (Object.keys(state.formErrors).length) {
    render();
    focusFirstInvalid(app);
    return;
  }
  const profile = state.speciesProfiles.find((item) => item.species_id === values.species);
  const bird = { bird_id: newId(), name: values.name.trim(), species_id: profile.species_id, species_name: profile.name_zh, species_color: profile.color, weight_g: Number(values.weight), diet_group: profile.diet_group, created_at: new Date().toISOString() };
  state.birds = [...state.birds, bird];
  saveStore(state.birds);
  state.formValues = {}; state.formErrors = {}; state.formDirty = false; state.view = state.formReturnView; render();
}

function bindForm() {
  const form = app.querySelector('[data-profile-form]');
  if (!form) return;
  form.addEventListener('input', (event) => { state.formDirty = true; state.formValues = { ...state.formValues, [event.target.name]: event.target.value }; if (event.target.name === 'species') render(); });
  form.addEventListener('submit', handleSubmit);
}

function leaveForm() {
  if (state.formDirty && !window.confirm('表單尚未保存，確定要離開嗎？')) return;
  state.formDirty = false; state.formValues = {}; state.formErrors = {}; state.view = state.formReturnView; render();
}

export function focusFirstInvalid(root) {
  setTimeout(() => root.querySelector('[aria-invalid="true"]')?.focus(), 0);
}

export function render() {
  const page = state.view === 'home' ? renderHome() : state.view === 'profiles' ? renderProfiles() : state.view === 'meal' ? renderMealPage() : state.view === 'care' ? renderEmptyPage('care', '照顧紀錄', '之後可以在這裡記下每天的心情、飲食與活動量。', '♡') : state.view === 'spots' ? renderEmptyPage('spots', '鳥聚點', '附近的鸚鵡咖啡廳、鳥醫院與用品店會整理在這裡。', '⌖') : renderForm();
  app.innerHTML = `${page}${renderBottomNav()}`;
  app.querySelectorAll('[data-action="open-form"]').forEach((button) => button.addEventListener('click', () => { state.formReturnView = state.view; state.view = 'form'; state.formValues = {}; state.formErrors = {}; render(); }));
  app.querySelectorAll('[data-action="go-profiles"]').forEach((button) => button.addEventListener('click', () => { state.view = 'profiles'; render(); }));
  app.querySelectorAll('[data-action="open-menu"]').forEach((button) => button.addEventListener('click', () => { state.selectedBirdId = button.dataset.birdId || ''; state.view = 'meal'; render(); }));
  app.querySelectorAll('[data-action="back-profiles"]').forEach((button) => button.addEventListener('click', () => { state.view = 'profiles'; state.mealError = ''; render(); }));
  app.querySelectorAll('[data-action="generate-menu"]').forEach((button) => button.addEventListener('click', () => {
    state.selectedBirdId = button.dataset.birdId || ''; state.mealError = ''; state.mealLoading = true; state.view = 'meal'; render();
    const bird = state.birds.find((item) => item.bird_id === state.selectedBirdId);
    const species = state.speciesProfiles.find((item) => item.species_id === bird?.species_id);
    const result = generateSevenDayMenu({ bird, species, foods: state.foods });
    state.mealLoading = false;
    if (!result.ok) state.mealError = result.error.message;
    else { state.mealPlans[bird.bird_id] = result.plan; saveMealPlan(result.plan); }
    render();
  }));
  app.querySelectorAll('[data-action="back-form"]').forEach((button) => button.addEventListener('click', leaveForm));
  app.querySelectorAll('[data-nav-view]').forEach((button) => button.addEventListener('click', () => {
    const nextView = button.dataset.navView;
    if (state.view === 'form' && state.formDirty && !window.confirm('表單尚未保存，確定要離開嗎？')) return;
    state.formDirty = false; state.formValues = {}; state.formErrors = {}; state.view = nextView; render();
  }));
  bindForm();
}

export async function bootstrap() { state.birds = loadStore().birds; state.mealPlans = loadMealStore().plansByBirdId; await Promise.all([loadSpecies(), loadFoods()]); render(); return state; }

bootstrap();
