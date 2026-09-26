const DEFAULT_DATA = {
  broth: [
    { id: "b1", name: "Lẩu Mala Tứ Xuyên", img: "https://cdn-icons-png.flaticon.com/512/3081/3081829.png", price: 38000, cost: 13000, unlock: 1, expiry: 2 },
    { id: "b2", name: "Lẩu Tiêu Xanh", img: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png", price: 35000, cost: 12000, unlock: 1, expiry: 1 },
    { id: "b3", name: "Lẩu Gà Lá É", img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png", price: 32000, cost: 10000, unlock: 1, expiry: 1 },
    { id: "b4", name: "Lẩu Tomyum Chùa Vàng", img: "https://cdn-icons-png.flaticon.com/512/3081/3081829.png", price: 36000, cost: 13000, unlock: 2, expiry: 1 },
    { id: "b5", name: "Lẩu Riêu Cua Đồng", img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png", price: 40000, cost: 15000, unlock: 2, expiry: 1 },
    { id: "b6", name: "Lẩu Phô Mai Béo Ngậy", img: "https://cdn-icons-png.flaticon.com/512/2153/2153786.png", price: 42000, cost: 16000, unlock: 2, expiry: 1 },
    { id: "b7", name: "Lẩu Bò Nhúng Dấm", img: "https://cdn-icons-png.flaticon.com/512/3143/3143643.png", price: 39000, cost: 14000, unlock: 3, expiry: 2 },
    { id: "b8", name: "Lẩu Nấm Thần Thánh", img: "https://cdn-icons-png.flaticon.com/512/2909/2909761.png", price: 34000, cost: 11000, unlock: 3, expiry: 2 },
    { id: "b9", name: "Lẩu Kim Chi Hàn Quốc", img: "https://cdn-icons-png.flaticon.com/512/2329/2329865.png", price: 35000, cost: 12000, unlock: 3, expiry: 1 },
    { id: "b10", name: "Lẩu Trường Thọ Herbal", img: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png", price: 45000, cost: 18000, unlock: 4, expiry: 2 }
  ],
  topping: [
    // Bò & Thịt các loại
    { id: "t1", name: "Ba Chỉ Bò Mỹ", img: "https://cdn-icons-png.flaticon.com/512/3143/3143643.png", price: 45000, cost: 20000, unlock: 1 },
    { id: "t2", name: "Bắp Bò Hoa", img: "https://cdn-icons-png.flaticon.com/512/3143/3143643.png", price: 48000, cost: 22000, unlock: 1 },
    { id: "t3", name: "Gù Bò Nướng", img: "https://cdn-icons-png.flaticon.com/512/3143/3143643.png", price: 50000, cost: 23000, unlock: 2 },
    { id: "t4", name: "Nọng Heo Cháy Cạnh", img: "https://cdn-icons-png.flaticon.com/512/3480/3480823.png", price: 35000, cost: 15000, unlock: 1 },
    
    // Hải sản
    { id: "t5", name: "Bạch Tuộc Sa Tế", img: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png", price: 52000, cost: 25000, unlock: 2 },
    { id: "t6", name: "Tôm Sú Tươi", img: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png", price: 48000, cost: 22000, unlock: 1 },
    { id: "t7", name: "Mực Trứng Nướng", img: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png", price: 50000, cost: 24000, unlock: 2 },
    { id: "t8", name: "Thanh Cua Nhật", img: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png", price: 25000, cost: 10000, unlock: 1 },

    // Viên thả lẩu & Xiên nướng
    { id: "t9", name: "Xiên Xúc Xích Đức", img: "https://cdn-icons-png.flaticon.com/512/3480/3480823.png", price: 22000, cost: 9000, unlock: 1 },
    { id: "t10", name: "Bò Viên Gân", img: "https://cdn-icons-png.flaticon.com/512/3480/3480823.png", price: 25000, cost: 10000, unlock: 1 },
    { id: "t11", name: "Tôm Viên Hoàng Kim", img: "https://cdn-icons-png.flaticon.com/512/833/833314.png", price: 28000, cost: 12000, unlock: 2 },
    { id: "t12", name: "Bánh Tráng Cuộn Nướng", img: "https://cdn-icons-png.flaticon.com/512/3480/3480823.png", price: 20000, cost: 7000, unlock: 1 },
    { id: "t13", name: "Đậu Hũ Phô Mai", img: "https://cdn-icons-png.flaticon.com/512/2153/2153786.png", price: 30000, cost: 12000, unlock: 2 },

    // Rau & Nấm ăn kèm
    { id: "t14", name: "Nấm Kim Châm", img: "https://cdn-icons-png.flaticon.com/512/2909/2909761.png", price: 15000, cost: 5000, unlock: 1 },
    { id: "t15", name: "Nấm Đùi Gà", img: "https://cdn-icons-png.flaticon.com/512/2909/2909761.png", price: 18000, cost: 6000, unlock: 1 },
    { id: "t16", name: "Rau Thảo Mộc Kèm", img: "https://cdn-icons-png.flaticon.com/512/2909/2909761.png", price: 12000, cost: 4000, unlock: 1 },
    { id: "t17", name: "Kim Chi Muối Chuẩn", img: "https://cdn-icons-png.flaticon.com/512/2329/2329865.png", price: 18000, cost: 6000, unlock: 1 }
  ]
};

const DEFAULT_QUESTS = [
  { id: "q1", desc: "Không để khách nào bỏ về", reward: 80000, target: 1, current: 0 },
  { id: "q2", desc: "Phục vụ 5 lượt khách đạt 5 sao", reward: 100000, target: 5, current: 0 },
  { id: "q3", desc: "Bán 3 phần Lẩu Mala Tứ Xuyên", reward: 90000, target: 3, current: 0 },
  { id: "q4", desc: "Bán 5 phần Ba Chỉ Bò Mỹ", reward: 120000, target: 5, current: 0 }
];
