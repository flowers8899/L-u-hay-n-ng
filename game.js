// Dữ liệu mặc định ban đầu
const INITIAL_ITEMS = [
  { id: 'lau_mala', name: 'Lẩu Mala Tứ Xuyên', price: 38000, cost: 13000, stock: 5 },
  { id: 'lau_tieu', name: 'Lẩu Tiêu Xanh', price: 35000, cost: 12000, stock: 5 },
  { id: 'lau_ga', name: 'Lẩu Gà Lá É', price: 32000, cost: 10000, stock: 5 },
  { id: 'mi_rieu', name: 'Mì Cay Riêu Cua', price: 42000, cost: 15000, stock: 5 },
  { id: 'bo_my', name: 'Ba Chỉ Bò Mỹ', price: 15000, cost: 5000, stock: 10 },
  { id: 'pho_mai', name: 'Phô Mai Lát', price: 8000, cost: 2000, stock: 10 },
  { id: 'bach_tuoc', name: 'Bạch Tuộc Tươi', price: 12000, cost: 4000, stock: 10 }
];

let gameState = JSON.parse(localStorage.getItem('lhg_full_state') || 'null') || {
  money: 250000,
  day: 1,
  rating: 4.8,
  reviewsCount: 0,
  items: INITIAL_ITEMS,
  selectedIngredients: [],
  reviews: []
};

function saveGameState() {
  localStorage.setItem('lhg_full_state', JSON.stringify(gameState));
}

// KHỞI CHẠY MÀN HÌNH LOADING %
window.addEventListener('DOMContentLoaded', () => {
  let percent = 0;
  const bar = document.getElementById('loadingBar');
  const text = document.getElementById('loadingText');

  const timer = setInterval(() => {
    percent += 5;
    if (bar) bar.style.width = percent + '%';
    if (text) text.textContent = percent + '%';

    if (percent >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        showScreen('screenStart');
        updateStartScreenInfo();
      }, 300);
    }
  }, 40);
});

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');

  const header = document.getElementById('gameHeader');
  if (screenId === 'screenStart' || screenId === 'screenLoading') {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
}

function updateStartScreenInfo() {
  const info = document.getElementById('startShopInfo');
  if (info) {
    info.textContent = `Tiệm Lẩu Nhỏ • Ngày ${gameState.day} • ${(gameState.money / 1000).toFixed(1)}k`;
  }
}

function updateHeader() {
  document.getElementById('headerDay').textContent = `Ngày ${gameState.day}`;
  document.getElementById('headerMoney').textContent = (gameState.money / 1000).toFixed(1) + 'k';
  document.getElementById('headerRating').textContent = `${gameState.rating.toFixed(1)} • ${gameState.reviewsCount} đánh giá`;
}

function goToPrepScreen() {
  showScreen('screenPrep');
  updateHeader();
  renderStockList();
  renderPriceList();
  renderReviewList();
}

// THAY ĐỔI TAB CHUẨN BỊ
function switchPrepTab(tabName) {
  document.querySelectorAll('.tab-item').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.prep-tab-content').forEach(c => c.classList.remove('active'));

  event.target.classList.add('active');

  if (tabName === 'kho') document.getElementById('tabKho').classList.add('active');
  if (tabName === 'giaban') document.getElementById('tabGiaBan').classList.add('active');
  if (tabName === 'nangcap') document.getElementById('tabNangCap').classList.add('active');
  if (tabName === 'danhgia') document.getElementById('tabDanhGia').classList.add('active');
  if (tabName === 'tongket') document.getElementById('tabTongKet').classList.add('active');
}

// RENDER DANH SÁCH KHO HÀNG
function renderStockList() {
  const container = document.getElementById('stockListContainer');
  if (!container) return;

  container.innerHTML = gameState.items.map(item => `
    <div class="item-row">
      <div class="item-info">
        <b>${item.name}</b>
        <small>Giá nhập: ${(item.cost/1000).toFixed(1)}k | Trong kho: ${item.stock}</small>
      </div>
      <div class="qty-btn-group">
        <button onclick="adjustStock('${item.id}', -1)">-</button>
        <span>${item.stock}</span>
        <button onclick="adjustStock('${item.id}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

function adjustStock(id, delta) {
  const item = gameState.items.find(i => i.id === id);
  if (!item) return;

  if (delta > 0) {
    if (gameState.money < item.cost) return alert('Không đủ tiền trong két!');
    gameState.money -= item.cost;
    item.stock++;
  } else if (delta < 0 && item.stock > 0) {
    gameState.money += item.cost;
    item.stock--;
  }

  saveGameState();
  updateHeader();
  renderStockList();
}

// RENDER GIÁ BÁN
function renderPriceList() {
  const container = document.getElementById('priceListContainer');
  if (!container) return;

  container.innerHTML = gameState.items.map(item => `
    <div class="item-row">
      <div class="item-info">
        <b>${item.name}</b>
        <small>Vốn: ${(item.cost/1000).toFixed(1)}k | Lãi: ${((item.price - item.cost)/1000).toFixed(1)}k</small>
      </div>
      <div>
        <b style="color: #ffe66d;">${(item.price/1000).toFixed(0)}k</b>
      </div>
    </div>
  `).join('');
}

// RENDER ĐÁNH GIÁ
function renderReviewList() {
  const container = document.getElementById('reviewListContainer');
  if (!container) return;

  if (!gameState.reviews || gameState.reviews.length === 0) {
    container.innerHTML = `<p style="font-size: 12px; color: #aaa; text-align: center; padding: 20px;">Chưa có nhận xét nào từ khách hàng.</p>`;
    return;
  }

  container.innerHTML = gameState.reviews.map(r => `
    <div class="item-row" style="flex-direction: column; align-items: flex-start;">
      <div style="display: flex; justify-content: space-between; width: 100%;">
        <b>${r.name}</b>
        <span>⭐ ${r.stars}</span>
      </div>
      <small style="margin-top: 4px; color: #ddd;">"${r.comment}"</small>
    </div>
  `).join('');
}

// BẮT ĐẦU BÁN HÀNG
function startSellingGame() {
  showScreen('screenSell');
  document.getElementById('headerStatus').textContent = 'Đang bán hàng';
  renderIngredientsGrid();
}

function renderIngredientsGrid() {
  const grid = document.getElementById('ingredientGrid');
  if (!grid) return;

  grid.innerHTML = gameState.items.map(item => `
    <div class="grid-item ${gameState.selectedIngredients.includes(item.id) ? 'selected' : ''}" onclick="toggleIngredient('${item.id}')">
      <b>${item.name}</b>
      <div style="font-size: 9px; color: #ffb3c1;">Kho: ${item.stock}</div>
    </div>
  `).join('');
}

function toggleIngredient(id) {
  const idx = gameState.selectedIngredients.indexOf(id);
  if (idx >= 0) {
    gameState.selectedIngredients.splice(idx, 1);
  } else {
    gameState.selectedIngredients.push(id);
  }
  renderIngredientsGrid();
}

function serveOrder() {
  if (gameState.selectedIngredients.length === 0) {
    return alert('Chưa chọn nguyên liệu để làm món!');
  }

  // Trừ kho & tăng tiền
  gameState.selectedIngredients.forEach(id => {
    const item = gameState.items.find(i => i.id === id);
    if (item && item.stock > 0) {
      item.stock--;
      gameState.money += item.price;
    }
  });

  alert('🎉 Phục vụ khách thành công!');
  gameState.selectedIngredients = [];
  saveGameState();
  updateHeader();
  renderIngredientsGrid();
}

function finishSellingDay() {
  gameState.day++;
  // Thêm đánh giá ngẫu nhiên
  if (!gameState.reviews) gameState.reviews = [];
  gameState.reviews.unshift({
    name: 'Khách hàng #' + Math.floor(Math.random() * 1000),
    stars: 5,
    comment: 'Lẩu và Mì cay ngon tuyệt vời, giao hàng rất nhanh!'
  });
  gameState.reviewsCount++;

  saveGameState();
  showScreen('screenPrep');
  document.getElementById('headerStatus').textContent = 'Chuẩn bị';
  updateHeader();
  renderStockList();
  renderReviewList();
}

// MODAL CÀI ĐẶT
function toggleSettingsModal(show) {
  const modal = document.getElementById('settingsModal');
  if (modal) {
    if (show) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
  }
}

function resetGameData() {
  if (confirm('Bạn có chắc muốn chơi lại từ Ngày 1 không?')) {
    localStorage.removeItem('lhg_full_state');
    location.reload();
  }
}
