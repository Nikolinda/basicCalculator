let display = document.getElementById('display');
let historyList = document.getElementById('history-list');
let current = '0';
let prev = null;
let op = null;
let reset = false;
let history = [];


function update() { display.textContent = current; }

function input(n) {
  if (current.length > 9) return;
  if (reset) { current = n === '.' ? '0.' : n; reset = false; }
  else {
    if (n === '.' && current.includes('.')) return;
    current = current === '0' && n !== '.' ? n : current + n;
  }
  update();
  highlightKey(n);
}

function clearAll() { current = '0'; prev = null; op = null; update(); }

function setOp(o) { prev = parseFloat(current); op = o; reset = true; highlightKey(o); }

function calculate() {
  if (op === null || prev === null) return;
  let curr = parseFloat(current);
  let result = 0;
  let opSymbol = op;
  if (op === '+') result = prev + curr;
  if (op === '-') result = prev - curr;
  if (op === '*') { result = prev * curr; opSymbol = '×'; }
  if (op === '/') { result = curr === 0 ? 0 : prev / curr; opSymbol = '÷'; }
  
  let expression = `${prev} ${opSymbol} ${curr}`;
  addToHistory(expression, result);

  current = String(parseFloat(result.toFixed(8)));
  prev = null; op = null; reset = true;
  update();
  highlightKey('Enter');
}

function plusMinus() { current = String(-parseFloat(current)); update(); }
function percent() { current = String(parseFloat(current) / 100); update(); }

// HISTÓRIA
function addToHistory(expr, res) {
  history.unshift({ expr, res });
  if (history.length > 20) history.pop();
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = '<p class="empty">Zatiaľ žiadne výpočty</p>';
    return;
  }
  historyList.innerHTML = history.map(h => 
    `<div class="history-item" onclick="useHistory('${h.res}')"><span>${h.expr} =</span><strong>${h.res}</strong></div>`
  ).join('');
}

function useHistory(val) { current = val; update(); }
function clearHistory() { history = []; renderHistory(); }

function highlightKey(k) {
  const btn = document.querySelector(`[data-key="${k}"]`);
  if (btn) { btn.classList.add('active'); setTimeout(() => btn.classList.remove('active'), 150); }
}