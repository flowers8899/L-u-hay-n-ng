let data=JSON.parse(localStorage.getItem("lhg_data")||"null")||DEFAULT_DATA;
let state=JSON.parse(localStorage.getItem("lhg_state")||"null")||{
 money:200000,level:1,rep:100,served:0,revenue:0,perfect:0,seats:2,kitchen:1,decor:1
};
let activeCat="broth", selected=[], order=null, timeLeft=45, timer=null;

const $=id=>document.getElementById(id);
const money=n=>n.toLocaleString("vi-VN")+"đ";
function save(){localStorage.setItem("lhg_data",JSON.stringify(data));localStorage.setItem("lhg_state",JSON.stringify(state));}
function unlocked(cat){return (data[cat]||[]).filter(x=>x.unlock<=state.level)}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function makeOrder(){
  const type=Math.random()<.55?"hotpot":"grill";
  if(type==="hotpot"){
    order={type,broth:pick(unlocked("broth")),tops:[pick(unlocked("topping")),pick(unlocked("topping"))],sauce:pick(unlocked("sauce")),drink:Math.random()<.45?pick(unlocked("drink")):null};
  }else{
    order={type,grills:[pick(unlocked("grill")),pick(unlocked("grill"))],sauce:pick(unlocked("sauce")),drink:Math.random()<.5?pick(unlocked("drink")):null};
  }
  selected=[];timeLeft=45;renderOrder();renderItems();startTimer();
}
function renderOrder(){
 const c=$("customer");
 const o=$("orderDetail");
 if(order.type==="hotpot"){
  c.innerHTML=`<div class="customer"><div class="avatar">👩🏻</div><div><b>“Cho mình một nồi lẩu nha!”</b><div class="order-pill">🍲 LẨU</div></div></div>`;
  o.innerHTML=`<div class="req"><span>Vị lẩu</span><b>${order.broth.emoji} ${order.broth.name}</b></div>
  <div class="req"><span>Topping</span><b>${order.tops.map(x=>x.emoji+" "+x.name).join(" + ")}</b></div>
  <div class="req"><span>Sốt</span><b>${order.sauce.emoji} ${order.sauce.name}</b></div>
  ${order.drink?`<div class="req"><span>Nước</span><b>${order.drink.emoji} ${order.drink.name}</b></div>`:""}`;
 }else{
  c.innerHTML=`<div class="customer"><div class="avatar">👨🏻</div><div><b>“Nay làm đồ nướng cho mình nhé!”</b><div class="order-pill">🔥 NƯỚNG</div></div></div>`;
  o.innerHTML=`<div class="req"><span>Món nướng</span><b>${order.grills.map(x=>x.emoji+" "+x.name).join(" + ")}</b></div>
  <div class="req"><span>Sốt</span><b>${order.sauce.emoji} ${order.sauce.name}</b></div>
  ${order.drink?`<div class="req"><span>Nước</span><b>${order.drink.emoji} ${order.drink.name}</b></div>`:""}`;
 }
}
function renderItems(){
 document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.cat===activeCat));
 const list=unlocked(activeCat);
 $("items").innerHTML=list.map(x=>`<button class="item ${selected.some(s=>s.id===x.id)?'selected':''}" onclick="toggle('${x.id}')">
 <div class="emoji">${x.emoji}</div><div class="item-name">${x.name}</div><div class="price">${money(x.price)}</div></button>`).join("");
 $("selected").textContent=selected.length?selected.map(x=>x.emoji+" "+x.name).join(" • "):"Chưa chọn gì";
}
function toggle(id){
 const x=data[activeCat].find(a=>a.id===id); if(!x)return;
 const i=selected.findIndex(a=>a.id===id);
 if(i>=0)selected.splice(i,1); else {
   if(selected.length>=2 && (activeCat==="topping"||activeCat==="grill")) selected.shift();
   else if(activeCat!=="topping"&&activeCat!=="grill") selected=[];
   selected.push(x);
 }
 renderItems();
}
function same(a,b){return a&&b&&a.id===b.id}
function serve(){
 if(!order)return;
 let ok=false;
 if(order.type==="hotpot"){
   const broth=selected.find(x=>data.broth.some(b=>b.id===x.id));
   const tops=selected.filter(x=>data.topping.some(t=>t.id===x.id));
   const sauce=selected.find(x=>data.sauce.some(s=>s.id===x.id));
   ok=same(broth,order.broth)&&tops.length===2&&tops.every(x=>order.tops.some(t=>same(t,x)))&&same(sauce,order.sauce);
 }else{
   const gs=selected.filter(x=>data.grill.some(g=>g.id===x.id));
   const sauce=selected.find(x=>data.sauce.some(s=>s.id===x.id));
   ok=gs.length===2&&gs.every(x=>order.grills.some(g=>same(g,x)))&&same(sauce,order.sauce);
 }
 if(ok){
   let reward=70000+state.level*7000+(timeLeft*500);
   state.money+=reward;state.revenue+=reward;state.served++;state.perfect++;
   if(state.served%5===0){state.level++;toast("🎉 Lên cấp! Mở thêm món mới.","good")}
   else toast("🔥 Khách thích quá! +"+money(reward),"good");
 }else{
   state.rep=Math.max(0,state.rep-5);state.money=Math.max(0,state.money-15000);
   toast("😵 Sai combo! Khách không hài lòng.","bad");
 }
 save();updateStats();makeOrder();
}
function startTimer(){
 clearInterval(timer);timer=setInterval(()=>{timeLeft--; $("patience").textContent="⏱️ "+timeLeft+"s";if(timeLeft<=0){clearInterval(timer);state.rep=Math.max(0,state.rep-8);toast("😤 Khách bỏ đi!");makeOrder()}},1000);
}
function upgrade(type){
 const costs={seats:80000*state.seats,kitchen:100000*state.kitchen,decor:70000*state.decor};
 if(state.money<costs[type])return toast("💸 Chưa đủ tiền!");
 state.money-=costs[type];state[type]++;save();updateStats();toast("✨ Nâng cấp thành công!","good");
}
function updateStats(){
 $("money").textContent=money(state.money);$("level").textContent=state.level;$("rep").textContent=state.rep;
 $("served").textContent=state.served;$("revenue").textContent=money(state.revenue);$("perfect").textContent=state.perfect;
 $("seats").textContent=state.seats;$("kitchenLevel").textContent=state.kitchen;$("decor").textContent=state.decor;
}
function toast(msg,cls=""){let d=document.createElement("div");d.className="toast "+cls;d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{activeCat=b.dataset.cat;selected=[];renderItems()}));
updateStats();makeOrder();renderItems();