const app = document.querySelector('#app');

const weather = Object.freeze({ temperature: 24, humidity: 62, updatedAt: '今天 09:00' });
const state = { view: 'home', birds: [] };

function weatherAlert({ temperature, humidity }) {
  if (temperature < 18) return '目前溫度偏低，請留意鳥寶保暖。';
  if (temperature > 30) return '目前溫度偏高，請留意鳥寶降溫。';
  if (humidity > 80) return '目前濕度偏高，請保持通風並留意環境。';
  return '';
}

function renderWeatherCard() {
  const alert = weatherAlert(weather);
  return `<section class="card weather-card section" aria-labelledby="weather-title">
    <p class="eyebrow">今日環境</p>
    <h2 id="weather-title">鳥寶居家小氣候</h2>
    <div class="weather-grid">
      <div class="metric"><span class="metric-label">氣溫</span><strong class="metric-value">${weather.temperature}°C</strong></div>
      <div class="metric"><span class="metric-label">濕度</span><strong class="metric-value">${weather.humidity}%</strong></div>
    </div>
    ${alert ? `<p class="alert" role="alert">${alert}</p>` : '<p class="weather-meta">環境數值在日常參考範圍內</p>'}
    <p class="weather-meta">資料更新：${weather.updatedAt} · 本地參考資料</p>
  </section>`;
}

function renderHome() {
  const hasBird = state.birds.length > 0;
  return `<main class="app-main" aria-labelledby="page-title">
    <header class="app-header"><span class="brand">鸚鵡日常</span><span class="muted" aria-label="目前頁面">首頁</span></header>
    <section class="section"><p class="eyebrow">好好吃飯，好好生活</p><h1 id="page-title">${hasBird ? '今天也照顧好鳥寶' : '先從鳥寶開始'}</h1></section>
    ${hasBird ? `<section class="card section bird-summary" aria-labelledby="bird-summary-title"><p class="eyebrow">目前鳥寶</p><h2 id="bird-summary-title">${state.birds[0].name}</h2><span class="muted">${state.birds[0].species || '尚未設定品種'} · ${state.birds[0].weight ? `${state.birds[0].weight} 克` : '尚未設定體重'}</span></section>` : `<section class="card empty-state" aria-labelledby="empty-title"><div class="empty-icon" aria-hidden="true">🦜</div><h2 id="empty-title">先建立鳥寶，才能產生專屬飲食建議</h2><p>填寫基本資料後，我們會把每日照顧資訊整理在這裡。</p><button class="primary-button" type="button" data-action="open-form">建立第一隻鳥寶</button></section>`}
    ${renderWeatherCard()}
    <footer class="disclaimer">僅供健康日常鮮食參考，病鳥請遵照獸醫指示</footer>
  </main>`;
}

function renderForm() {
  return `<main class="app-main" aria-labelledby="form-title">
    <header class="app-header"><button class="secondary-button" type="button" data-action="back-home" aria-label="返回首頁">← 返回</button><span class="brand">建立鳥寶</span><span aria-hidden="true"></span></header>
    <section class="section"><p class="eyebrow">第一步</p><h1 id="form-title">告訴我一些基本資料</h1></section>
    <form class="card form-card" data-profile-form>
      <div class="form-field"><label for="bird-name">鳥寶名字</label><input id="bird-name" name="name" placeholder="例如：小羽" autocomplete="off" /></div>
      <div class="form-field"><label for="bird-species">品種</label><select id="bird-species" name="species"><option value="">請選擇品種</option></select></div>
      <div class="form-field"><label for="bird-weight">體重（克）</label><input id="bird-weight" name="weight" type="number" inputmode="decimal" step="0.1" min="0" placeholder="例如：85.5" /></div>
      <div class="notice">建檔資料功能正在準備中。本頁先提供表單入口與版型，送出與資料保存會在後續任務完成。</div>
      <div class="form-actions"><button class="primary-button" type="button" disabled>儲存鳥寶資料</button><button class="secondary-button" type="button" data-action="back-home">先返回首頁</button></div>
    </form>
    <footer class="disclaimer">僅供健康日常鮮食參考，病鳥請遵照獸醫指示</footer>
  </main>`;
}

function render() {
  app.innerHTML = state.view === 'home' ? renderHome() : renderForm();
  app.querySelectorAll('[data-action="open-form"]').forEach((button) => button.addEventListener('click', () => { state.view = 'form'; render(); }));
  app.querySelectorAll('[data-action="back-home"]').forEach((button) => button.addEventListener('click', () => { state.view = 'home'; render(); }));
}

render();

export { weatherAlert, state, render };
