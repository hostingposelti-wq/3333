// Простая логика тайкун-игры
const moneyEl = document.getElementById('money');
const reactorEl = document.getElementById('reactorLevel');
const workersEl = document.getElementById('workers');
const incomeEl = document.getElementById('incomePerSec');
const eventsEl = document.getElementById('events');

const collectBtn = document.getElementById('collectBtn');
const hireBtn = document.getElementById('hireBtn');
const upgradeBtn = document.getElementById('upgradeBtn');
const buyShieldBtn = document.getElementById('buyShieldBtn');

let state = {
  money: 50,
  reactorLevel: 1,
  workers: 0,
  hasShield: false,
  lastTick: Date.now()
};

function save() {
  localStorage.setItem('ct_state_v1', JSON.stringify(state));
}

function load() {
  const raw = localStorage.getItem('ct_state_v1');
  if (raw) {
    try {
      const s = JSON.parse(raw);
      state = Object.assign(state, s);
    } catch(e){}
  }
}

function addEvent(txt) {
  const li = document.createElement('li');
  const time = new Date().toLocaleTimeString();
  li.textContent = `[${time}] ${txt}`;
  eventsEl.prepend(li);
  // keep max 50
  while (eventsEl.children.length > 50) eventsEl.removeChild(eventsEl.lastChild);
}

function getIncomePerSec() {
  // базовый доход от реактора + рабочие дают
  return Math.floor(state.reactorLevel * 2 + state.workers * 1);
}

function render() {
  moneyEl.textContent = state.money;
  reactorEl.textContent = state.reactorLevel;
  workersEl.textContent = state.workers;
  incomeEl.textContent = getIncomePerSec();
  hireBtn.textContent = `Нанять рабочего (${100})`;
  upgradeBtn.textContent = `Улучшить реактор (${300 * state.reactorLevel})`;
  buyShieldBtn.textContent = state.hasShield ? 'Щит куплен' : `Купить щит (500)`;
  collectBtn.disabled = false;
}

collectBtn.addEventListener('click', () => {
  state.money += 1;
  addEvent('Собрал вручную +1');
  save();
  render();
});

hireBtn.addEventListener('click', () => {
  if (state.money >= 100) {
    state.money -= 100;
    state.workers += 1;
    addEvent('Нанят рабочий');
    save();
    render();
  } else addEvent('Не хватает денег на рабочего');
});

upgradeBtn.addEventListener('click', () => {
  const cost = 300 * state.reactorLevel;
  if (state.money >= cost) {
    state.money -= cost;
    state.reactorLevel += 1;
    addEvent('Реактор улучшен до ' + state.reactorLevel);
    save();
    render();
  } else addEvent('Не хватает денег на улучшение реактора');
});

buyShieldBtn.addEventListener('click', () => {
  if (state.hasShield) { addEvent('Щит уже есть'); return; }
  if (state.money >= 500) {
    state.money -= 500;
    state.hasShield = true;
    addEvent('Куплен защитный щит');
    save();
    render();
  } else addEvent('Не хватает денег на щит');
});

// игровой тик (каждую секунду)
function tick() {
  const income = getIncomePerSec();
  state.money += income;
  save();
  render();
}

// автотик каждые 1с
setInterval(tick, 1000);

// автозагрузка
load();
render();

// простая демо-вспомогалка: скидка при больших уровнях (необязательно)
