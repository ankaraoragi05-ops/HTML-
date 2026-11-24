const ROOMS = [
{id:1, name:"Standard Queen", price:4800, cap:2, size:24, bed:"1 queen bed", view:
"City view", feats:["Free cancellation","Work desk"], c:["#3E6B7A","#1F3F4B"]},
{id:2, name:"Deluxe King", price:6900, cap:3, size:32, bed:"1 king bed", view:"Gard
en view", feats:["Balcony","Breakfast included","Free cancellation"], c:["#4A7A5B","#2
64A36"]},
{id:3, name:"Family Twin", price:7800, cap:4, size:40, bed:"2 double beds", view:"P
ool view", feats:["Balcony","Breakfast included","Sofa area"], c:["#8A6A3C","#4D3A1F
"]},
{id:4, name:"Executive Suite", price:11500, cap:3, size:55, bed:"1 king bed + lounge
", view:"Skyline view", feats:["Balcony","Bathtub","Breakfast included","Lounge access
"], c:["#6A4E7A","#3A2A47"]},
{id:5, name:"Presidential Suite", price:22000, cap:4, size:95, bed:"2 king beds + di
ning room", view:"Panoramic view", feats:["Balcony","Bathtub","Breakfast included","P
rivate butler","Free cancellation"], c:["#8B3E4A","#4A1F28"]}
];
const FACILITIES = [
{i:"🏊", n:"Rooftop pool", d:"Heated innity pool with loungers and a poolside bar.", t
:"0600–2200"},
{i:"💆", n:"Spa and wellness", d:"Massage, steam room and sauna. Treatments by a
ppointment.", t:"0900–2100"},
{i:"🏋", n:"Fitness centre", d:"Cardio, free weights and a yoga studio with daily class
es.", t:"24 hours"},
{i:"🍽", n:"Two restaurants", d:"All-day dining and a ne-dining room serving region
a
l menus.", t:"0700–2330"},
{i:"
", n:"Meeting rooms", d:"Four rooms for 8 to 120 people, with projectors and c
atering.", t:"Book ahead"},
{i:"🚗", n:"Parking and transfers", d:"Covered parking, EV charging and airport picku
p on request.", t:"24 hours"}
];
const AMEN = ["High-speed Wi-Fi","Air conditioning","Smart TV","In-room safe","Mini 
bar","Tea and co ee maker","Rain shower","Daily housekeeping","Room service","Iron 
and board","Hairdryer","Blackout curtains"];
const ADDONS = [
{id:"bf", n:"Breakfast bu et", p:900, per:"person per night"},
{id:"tr", n:"Airport transfer", p:1800, per:"one way"},
{id:"sp", n:"Spa credit", p:2500, per:"per stay"}
];
const TAX = 0.12;
const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'
"':"&quot;","'":"&#39;"}[c]));
const iso = d => d.toISOString().slice(0,10);
const today = new Date(); today.setHours(0,0,0,0);
const addDays = (d,n) => { const x = new Date(d); x.setDate(x.getDate()+n); retur
n x; };
$("cin").min = iso(today); $("cin").value = iso(addDays(today,1));
$("cout").min = iso(addDays(today,1)); $("cout").value = iso(addDays(today,3));
$("cin").onchange = () => {
const min = addDays(new Date($("cin").value),1);
$("cout").min = iso(min);
if (new Date($("cout").value) < min) $("cout").value = iso(min);
};
const nights = () => Math.round((new Date($("cout").value) - new Date($("cin").val
ue)) / 864e5);
const guests = () => +$("adults").value + +$("kids").value;
const booked = new Set();
function validDates(){
  const n = nights();
  if (!$("cin").value || !$("cout").value || isNaN(n) || n < 1){
    $("serr").textContent = "Check-out must be at least one day after check-in."; retu
rn false;
  }
  $("serr").textContent = ""; return true;
}
function renderRooms(){
  const n = nights(), g = guests();
  const need = [...document.querySelectorAll(".bar input:checked")].map(i => i.data
set.f);
  let list = ROOMS. lter(r => r.cap >= g && need.every(f => r.feats.includes(f)));
  const s = $("sort").value;
  list.sort((a,b) => s==="asc" ? a.price-b.price : s==="desc" ? b.price-a.price : b.size
a.size);
  $("roomsub").textContent = n > 0
    ? `${n} night${n>1?"s":""} for ${g} guest${g>1?"s":""}. Prices include no taxes yet; 
12% is added at checkout.`
    : "Choose your dates to see prices for your stay.";
  $("roomList").innerHTML = list.length ? list.map(r => {
    const sold = booked.has(r.id);
    return `<article class="room">
      <div class="pic" style="background:linear-gradient(135deg,${r.c[0]},${r.c[1]})">
${esc(r.view)}</div>
      <div class="info"><h3>${esc(r.name)}</h3>
        <div class="meta">${r.size} m² · ${esc(r.bed)} · up to ${r.cap} guests</div>
        <div class="tags">${r.feats.map(f=>`<span>${esc(f)}</span>`).join("")}</div
></div>
      <div class="buy"><div class="price"><b>${inr(r.price)}</b><small>per night${
n>0?` · ${inr(r.price*n)} total`:""}</small></div>
        <button class="btn" data-r="${r.id}" ${sold?"disabled":""}>${sold?"Booked":"Res
erve"}</button></div>
    </article>`;}).join("")
    : `<div class="none">No rooms match these lters for ${g} guests. Remove a lt
er or reduce the guest count.</div>`;
  document.querySelectorAll("[data-r]").forEach(b => b.onclick = () => openBookin
g(+b.dataset.r));
}
$("search").onsubmit = e => { e.preventDefault(); if (validDates()){ renderRooms();
 $("rooms").scrollIntoView(); } };
document.querySelectorAll(".bar input,#sort,#adults,#kids").forEach(el => el.onch
ange = () => { if (validDates()) renderRooms(); });
/* booking dialog */
function openBooking(id){
  const r = ROOMS. nd(x => x.id === id), n = nights(), g = guests();
  $("dbody").innerHTML = `
    <button class="close" aria-label="Close" onclick="dlg.close()">×</button>
    <h3 id="dtitle">${esc(r.name)}</h3>
    <div class="meta">${$("cin").value} to ${$("cout").value} · ${n} night${n>1?"s":""} 
· ${g} guest${g>1?"s":""}</div>
    <div class="opts" role="group" aria-label="Add-ons">${ADDONS.map(a =>
      `<label><span><input type="checkbox" data-a="${a.id}"> ${a.n} <small style="
color:var(--muted)">(${inr(a.p)} ${a.per})</small></span></label>`).join("")}</div
>
    <div id="sum"></div>
    <div class="two">
      <div class="f"><label for="gn">Full name</label><input id="gn" autocomplete="
name"></div>
      <div class="f"><label for="ge">Email</label><input id="ge" type="email" autoco
mplete="email"></div>
    </div>
    <div class="f" style="margin-top:12px"><label for="gr">Special requests (optional
)</label><input id="gr" placeholder="Late check-in, extra pillows..."></div>
    <div class="err" id="derr" role="alert"></div>
    <button class="btn" id="pay" style="width:100%;margin-top:8px">Con rm booki
ng</button>`;
  const calc = () => {
    const picked = [...$("dbody").querySelectorAll("[data-a]:checked")].map(i => i.da
taset.a);
    let add = 0;
    if (picked.includes("bf")) add += 900 * g * n;
    if (picked.includes("tr")) add += 1800;
    if (picked.includes("sp")) add += 2500;
    const base = r.price * n, tax = (base + add) * TAX, total = base + add + tax;
    $("sum").innerHTML = `<div class="row"><span>${inr(r.price)} × ${n} night${n
>1?"s":""}</span><span>${inr(base)}</span></div>
      <div class="row"><span>Add-ons</span><span>${inr(add)}</span></div>
      <div class="row"><span>Taxes (12%)</span><span>${inr(tax)}</span></div>
      <div class="row total"><span>Total</span><span>${inr(total)}</span></div>
`;
    return total;
  };
  calc();
  $("dbody").querySelectorAll("[data-a]").forEach(i => i.onchange = calc);
  $("pay").onclick = () => {
    const name = $("gn").value.trim(), mail = $("ge").value.trim();
    if (!name) return $("derr").textContent = "Enter the guest's full name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) return $("derr").textContent = "
Enter a valid email, like name@example.com.";
    const total = calc(), ref = "MG-" + Math.random().toString(36).slice(2,8).toUpper
Case();
    booked.add(r.id);
    $("dbody").innerHTML = `<div class="ok" role="status"><div class="tick" aria-hid
den="true">✓</div>
      <h3>Booking con rmed</h3>
      <p class="sub" style="margin:10px auto">${esc(name)}, your ${esc(r.name)} is r
eserved from ${$("cin").value} to ${$("cout").value}. A con rmation for ${inr(total)} 
was sent to ${esc(mail)}.</p>
<p><b>Reference ${ref}</b></p><br><button class="btn alt" onclick="dlg.clo
se()">Close</button></div>`;
renderRooms();
};
dlg.showModal();
}
/* static sections */
le>`).join("");
$("facGrid").innerHTML = FACILITIES.map(f => `<article><span class="ic" aria-hid
den="true">${f.i}</span><h3>${f.n}</h3><p>${f.d}</p><em>${f.t}</em></arti
c
$("amenList").innerHTML = AMEN.map(a => `<li>${a}</li>`).join("");
const dlg = $("dlg");
renderRooms();
