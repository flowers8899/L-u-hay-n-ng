let data = JSON.parse(localStorage.getItem("lhg_data") || "null") || DEFAULT_DATA;
let state = JSON.parse(localStorage.getItem("lhg_state") || "null") || {
  money: 6989700,
  day: 24,
  rating: 4.8,
  reviewsCount: 400,
  stock: {},
  selected: []
};

let currentOrder = null;

// Khởi tạo tồn kho mặc định nếu món chưa từng có trong kho
function initStockData() {
  let allItems = [...data.broth, ...data.topping];
  allItems.forEach(item => {
    if (state.stock[item.id] === undefined) {
      state.stock[item.id] = 5; // Cho sẵn 5 phần làm vốn ban đầu
    }
  });
}

function saveState() {
  localStorage.setItem("lhg_data", JSON.stringify(data));
  localStorage.setItem("lhg_state", JSON.stringify(state));
}

function updateHeader() {
  document.getElementById("dayTitle").textContent = `Ngày ${state.day}`;
  document.getElementById("moneyDisplay").textContent = (state.money / 1000).toFixed(1) + "k";
  document.getElementById("ratingDisplay").textContent = state.rating.toFixed(1);
}

function renderPrepStock() {
  const container = document.getElementById("stockBuyList");
  let allItems = [...data.broth, ...data.topping];
  
  container.innerHTML = allItems.map(item => `
    <div class="stock-card">
      <img src="${item.img}" class="item-thumb" alt="${item.name}">
      <div class="item-info">
        <b>${item.name}</b>
        <p>Bán: ${(item.price/1000).toFixed(1)}k • Nhập: ${(item.cost/1000).toFixed(1)}k</p>
        <small class="expiry-text">Trong kho: ${state.stock[item.id] || 0}</small>
      </div>
      <div class="qty-ctrl">
        <button onclick="changeStock('${item.id}', -1)">-</button>
        <span>${state.stock[item.id] || 0}</span>
        <button onclick="changeStock('${item.id}', 1)">+</button>
      </div>
    </div>
  `).join("");
}

function renderQuests() {
  const container = document.getElementById("questList");
  let quests = DEFAULT_QUESTS || [];
  container.innerHTML = quests.map(q => `
    <div class="quest-item">
      <div>
        <div>${q.desc}</div>
        <small>Thưởng: ${(q.reward/1000).toFixed(0)}k</small>
      </div>
      <span class="quest-status">${q.current}/${q.target}</span>
    </div>
  `).join("");
}

function changeStock(id, delta) {
  let allItems = [...data.broth, ...data.topping];
  let item = allItems.find(x => x.id === id);
  if (!item) return;

  if (delta > 0) {
    if (state.money < item.cost) {
      alert("Không đủ tiền nhập hàng!");
      return;
    }
    state.money -= item.cost;
    state.stock[id] = (state.stock[id] || 0) + 1;
  } else if (delta < 0 && (state.stock[id] || 0) > 0) {
    state.money += item.cost;
    state.stock[id] = Math.max(0, (state.stock[id] || 0) - 1);
  }
  
  saveState();
  updateHeader();
  renderPrepStock();
}

function startSellingDay() {
  document.getElementById("prepScreen").classList.remove("active");
  document.getElementById("sellScreen").classList.add("active");
  document.getElementById("dayStatus").textContent = "Đang bán hàng";
  generateCustomerOrder();
  renderSellGrid();
}

function generateCustomerOrder() {
  if (!data.broth.length || !data.topping.length) return;

  let b = data.broth[Math.floor(Math.random() * data.broth.length)];
  let t1 = data.topping[Math.floor(Math.random() * data.topping.length)];
  let t2 = data.topping[Math.floor(Math.random() * data.topping.length)];
  
  currentOrder = { broth: b, toppings: [t1, t2] };
  document.getElementById("customerDemand").innerHTML = `
    "Cho anh 1 nồi lẩu <b>${b.name}</b> thêm <b>${t1.name}</b>, <b>${t2.name}</b> nha!"
  `;
  state.selected = [];
  updateSelectedBar();
}

function renderSellGrid() {
  const grid = document.getElementById("gridItems");
  let allItems = [...data.broth, ...data.topping];
  
  grid.innerHTML = allItems.map(item => `
    <div class="grid-card ${state.selected.includes(item.id) ? 'selected' : ''}" onclick="toggleSelectItem('${item.id}')">
      <span class="badge-count">${state.stock[item.id] || 0}</span>
      <img src="${item.img}" class="grid-img" />
      <div class="grid-title">${item.name}</div>
    </div>
  `).join("");
}

function toggleSelectItem(id) {
  if ((state.stock[id] || 0) <= 0) {
    alert("Món này đã hết trong kho!");
    return;
  }
  let idx = state.selected.indexOf(id);
  if (idx >= 0) {
    state.selected.splice(idx, 1);
  } else {
    state.selected.push(id);
  }
  renderSellGrid();
  updateSelectedBar();
}

function updateSelectedBar() {
  let allItems = [...data.broth, ...data.topping];
  let names = state.selected.map(id => allItems.find(x => x.id === id)?.name).filter(Boolean);
  document.getElementById("selectedItemsText").textContent = names.length ? names.join(" + ") : "Chưa chọn món nào";
}

function serveCustomer() {
  if (!currentOrder) return;

  let required = [currentOrder.broth.id, ...currentOrder.toppings.map(t => t.id)].sort();
  let selected = [...state.selected].sort();

  let isCorrect = JSON.stringify(required) === JSON.stringify(selected);

  if (isCorrect) {
    selected.forEach(id => {
      if (state.stock[id]) state.stock[id]--;
    });

    let revenue = currentOrder.broth.price + currentOrder.toppings.reduce((a, b) => a + b.price, 0);
    state.money += revenue;
    alert(`🎉 Phục vụ chuẩn xác! Nhận ${(revenue/1000).toFixed(1)}k`);
  } else {
    alert("❌ Làm sai món rồi! Khách phàn nàn bỏ đi.");
  }

  saveState();
  updateHeader();
  generateCustomerOrder();
  renderSellGrid();
}

function endDay() {
  state.day++;
  document.getElementById("sellScreen").classList.remove("active");
  document.getElementById("prepScreen").classList.add("active");
  document.getElementById("dayStatus").textContent = "Chuẩn bị";
  saveState();
  updateHeader();
  renderPrepStock();
}

// Khởi chạy
initStockData();
updateHeader();
renderPrepStock();
renderQuests();
