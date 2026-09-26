let data = JSON.parse(localStorage.getItem("lhg_data") || "null") || DEFAULT_DATA;
let state = JSON.parse(localStorage.getItem("lhg_state") || "null") || {
  money: 250000,
  day: 1,
  rating: 0,
  reviewsCount: 0,
  reviews: [], // Danh sách bình luận của khách
  stock: {},
  selected: [],
  dayServed: 0,
  dayCorrect: 0
};

let currentOrder = null;

function initStockData() {
  let allItems = [...data.broth, ...data.topping];
  allItems.forEach(item => {
    if (state.stock[item.id] === undefined) {
      state.stock[item.id] = 3; // Cho sẵn 3 phần làm vốn Ngày 1
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
  document.getElementById("ratingDisplay").textContent = state.reviewsCount > 0 ? state.rating.toFixed(1) : "Chưa có";
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

function renderReviews() {
  const container = document.getElementById("reviewsList");
  if (!container) return;

  if (!state.reviews || state.reviews.length === 0) {
    container.innerHTML = `<div style="color: #888; font-size: 13px; text-align: center; padding: 12px;">Quán chưa có đánh giá nào. Hãy hoàn thành ngày bán hàng đầu tiên nhé!</div>`;
    return;
  }

  container.innerHTML = state.reviews.map((rev, index) => `
    <div class="review-card">
      <div class="review-header">
        <b>${rev.name}</b>
        <span class="review-stars">${'⭐'.repeat(rev.stars)}</span>
      </div>
      <div class="review-comment">"${rev.comment}"</div>
      <small style="color: #888; font-size: 11px;">Ngày ${rev.day}</small>
      
      ${rev.reply ? `
        <div class="owner-reply">
          <b>Chủ quán phản hồi:</b> ${rev.reply}
        </div>
      ` : `
        <div class="reply-box">
          <input type="text" id="replyInput_${index}" placeholder="Nhập câu trả lời cho khách..." class="reply-input">
          <button onclick="sendReply(${index})" class="btn-reply">Gửi</button>
        </div>
      `}
    </div>
  `).join("");
}

function sendReply(index) {
  const input = document.getElementById(`replyInput_${index}`);
  let replyText = input ? input.value.trim() : "";
  if (!replyText) return alert("Vui lòng nhập nội dung phản hồi!");

  state.reviews[index].reply = replyText;
  saveState();
  renderReviews();
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

function switchPrepTab(tabName) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.style.display = "none");

  if (tabName === 'stock') {
    document.getElementById("tabBtnStock").classList.add("active");
    document.getElementById("tabStock").style.display = "block";
  } else if (tabName === 'reviews') {
    document.getElementById("tabBtnReviews").classList.add("active");
    document.getElementById("tabReviews").style.display = "block";
    renderReviews();
  }
}

function startSellingDay() {
  document.getElementById("prepScreen").classList.remove("active");
  document.getElementById("sellScreen").classList.add("active");
  document.getElementById("dayStatus").textContent = "Đang bán hàng";
  state.dayServed = 0;
  state.dayCorrect = 0;
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

  state.dayServed++;

  if (isCorrect) {
    state.dayCorrect++;
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

function generateDayReview() {
  const customerNames = ["Minh Anh", "Bảo Nam", "Thùy Trang", "Quốc Bảo", "Thu Hà", "Đức Anh", "Phương Thảo"];
  const goodComments = [
    "Đồ ăn ngon tuyệt vời, nước lẩu đậm đà!",
    "Topping tươi ngon, phục vụ rất nhanh nhẹn.",
    "Lẩu siêu chất lượng, nhất định sẽ quay lại!",
    "Quán làm món chuẩn xác, không chê vào đâu được 5 sao!"
  ];
  const badComments = [
    "Làm nhầm món của tôi rồi, phục vụ chưa chuẩn lắm.",
    "Chờ đợi hơi lâu và mang sai topping.",
    "Nước lẩu tạm ổn nhưng làm sai yêu cầu của khách."
  ];

  let randomName = customerNames[Math.floor(Math.random() * customerNames.length)];
  let stars = 5;
  let comment = "";

  if (state.dayServed === 0) {
    stars = 3;
    comment = "Hôm nay quán không phục vụ tôi được món nào cả!";
  } else {
    let ratio = state.dayCorrect / state.dayServed;
    if (ratio >= 0.8) {
      stars = 5;
      comment = goodComments[Math.floor(Math.random() * goodComments.length)];
    } else if (ratio >= 0.5) {
      stars = 3;
      comment = "Chất lượng tạm ổn nhưng vẫn còn làm nhầm món.";
    } else {
      stars = 1 + Math.floor(Math.random() * 2);
      comment = badComments[Math.floor(Math.random() * badComments.length)];
    }
  }

  // Cập nhật rating trung bình
  let oldTotal = state.rating * state.reviewsCount;
  state.reviewsCount++;
  state.rating = (oldTotal + stars) / state.reviewsCount;

  if (!state.reviews) state.reviews = [];
  state.reviews.unshift({
    name: randomName,
    stars: stars,
    comment: comment,
    day: state.day,
    reply: null
  });
}

function endDay() {
  generateDayReview();
  state.day++;
  document.getElementById("sellScreen").classList.remove("active");
  document.getElementById("prepScreen").classList.add("active");
  document.getElementById("dayStatus").textContent = "Chuẩn bị";
  saveState();
  updateHeader();
  renderPrepStock();
  renderReviews();
}

// Khởi chạy
initStockData();
updateHeader();
renderPrepStock();
renderQuests();
renderReviews();
