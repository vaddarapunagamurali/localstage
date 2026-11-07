// ===== 1. Paste your Supabase details here =====
const SUPABASE_URL = "https://daqthfssgembnvjfdvqn.supabase.co";
const SUPABASE_KEY = "sb_publishable_bkHf8-BjRczZ_UHAv6REfA_ASoJxTa2";
const online = !SUPABASE_URL.includes("YOUR_") && typeof supabase !== "undefined";
const db = online ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const performers = [
  { id: 1, name: "DJ Raghav", category: "DJ", city: "Ongole", price: 15000, rating: 4.8, reviews: 42, tags: ["Weddings", "College fests"], bio: "High-energy DJ with own sound system and lights. Plays Telugu, Hindi and English hits." },
  { id: 2, name: "DJ Kiran Beats", category: "DJ", city: "Nellore", price: 12000, rating: 4.6, reviews: 31, tags: ["Birthdays", "Parties"], bio: "Crowd-first DJ for birthdays and private parties. Flexible sets of 2 to 4 hours." },
  { id: 3, name: "Swarasagar Band", category: "Band", city: "Ongole", price: 25000, rating: 4.9, reviews: 58, tags: ["Live music", "Weddings"], bio: "Five-member live band playing film songs and folk. Full stage setup available." },
  { id: 4, name: "Rhythm Riders", category: "Band", city: "Nellore", price: 30000, rating: 4.7, reviews: 27, tags: ["Rock", "Fusion"], bio: "Rock and fusion band with drums, guitars and keyboard. Ideal for fests and concerts." },
  { id: 5, name: "Sravani Reddy", category: "Singer", city: "Ongole", price: 8000, rating: 4.8, reviews: 36, tags: ["Melody", "Classical"], bio: "Playback-style singer for weddings and cultural programs. Classical and light music." },
  { id: 6, name: "Karthik Voice", category: "Singer", city: "Nellore", price: 7000, rating: 4.5, reviews: 19, tags: ["Karaoke", "Small events"], bio: "Solo singer with karaoke tracks. Perfect for house functions and small gatherings." },
  { id: 7, name: "Nritya Dance Crew", category: "Dancer", city: "Ongole", price: 18000, rating: 4.9, reviews: 45, tags: ["Folk", "Film dance"], bio: "Group of six dancers performing folk, classical and film dance numbers." },
  { id: 8, name: "Mounika Dance Studio", category: "Dancer", city: "Nellore", price: 14000, rating: 4.7, reviews: 23, tags: ["Bharatanatyam", "Duets"], bio: "Bharatanatyam and semi-classical solo and duet performances." },
  { id: 9, name: "Suma Priya", category: "Anchor", city: "Ongole", price: 6000, rating: 4.8, reviews: 52, tags: ["Telugu", "English"], bio: "Professional anchor for weddings, college fests and corporate events." },
  { id: 10, name: "Vamsi Krishna", category: "Anchor", city: "Nellore", price: 5000, rating: 4.4, reviews: 17, tags: ["Games", "Fun hosting"], bio: "Fast-talking host who keeps the crowd involved with games and activities." },
  { id: 11, name: "Magic by Raju", category: "Other", city: "Ongole", price: 9000, rating: 4.6, reviews: 21, tags: ["Magic", "Kids"], bio: "Stage magician and kids entertainer with a 45-minute family show." },
  { id: 12, name: "Dappu Kalakarulu", category: "Other", city: "Nellore", price: 10000, rating: 4.7, reviews: 14, tags: ["Folk drums", "Festivals"], bio: "Traditional dappu drum troupe for processions and festival celebrations." }
];

const icons = {
  All: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>',
  DJ: '<path d="M4 14a8 8 0 0116 0"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  Band: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  Singer: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
  Dancer: '<circle cx="13" cy="5" r="2"/><path d="M12 8l-3 5 4 2-2 6M12 8l5 3M9 13l-4 1"/>',
  Anchor: '<path d="M3 11l15-6v14L3 13z"/><path d="M7 14v5"/>',
  Other: '<path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"/>'
};
const categories = ["All", "DJ", "Band", "Singer", "Dancer", "Anchor", "Other"];
const grads = {
  DJ: "linear-gradient(135deg,#5b3fd1,#8e6bff)", Band: "linear-gradient(135deg,#e0306e,#ff7a9c)",
  Singer: "linear-gradient(135deg,#0f8a8a,#35c2b5)", Dancer: "linear-gradient(135deg,#e5622b,#ffa257)",
  Anchor: "linear-gradient(135deg,#2a5db0,#5aa0f0)", Other: "linear-gradient(135deg,#6b7a1f,#a3b73c)"
};

let activeCat = "All", activeCity = "All cities", selected = null;
const $ = (id) => document.getElementById(id);
const rupee = (n) => "\u20B9" + n.toLocaleString("en-IN");
const initials = (n) => n.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const niceDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
function todayISO() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function uuid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16);
  });
}

function loadBookings() { try { return JSON.parse(localStorage.getItem("localstageBookings")) || []; } catch (e) { return []; } }
function saveBookings() { try { localStorage.setItem("localstageBookings", JSON.stringify(bookings)); } catch (e) {} }
function loadUser() { try { return JSON.parse(localStorage.getItem("localstageUser")) || {}; } catch (e) { return {}; } }
function saveUser(u) { try { localStorage.setItem("localstageUser", JSON.stringify(u)); } catch (e) {} }
let bookings = loadBookings();

// ===== 2. Booked dates from ALL users (shared database) =====
let sharedBooked = [];
async function loadShared() {
  if (!online) return;
  const res = await db.from("public_booked_dates").select("performer_id,event_date");
  if (!res.error && res.data) sharedBooked = res.data;
}
function bookedDates(performerId) {
  const mineSet = new Set(bookings.filter((b) => b.performerId === performerId).map((b) => b.date));
  const all = new Map();
  sharedBooked.filter((b) => b.performer_id === performerId).forEach((b) => all.set(b.event_date, mineSet.has(b.event_date)));
  mineSet.forEach((d) => all.set(d, true));
  return Array.from(all, ([date, mine]) => ({ date, mine })).sort((a, b) => a.date.localeCompare(b.date));
}
const clashInfo = (pid, date) => bookedDates(pid).find((b) => b.date === date);

function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2800); }
function setCategory(c) { activeCat = c; $("heroCat").value = c; renderChips(); renderGrid(); }

function renderControls() {
  $("heroCat").innerHTML = categories.map((c) => "<option>" + c + "</option>").join("");
  $("catTiles").innerHTML = categories.slice(1).map((c) => {
    const n = performers.filter((p) => p.category === c).length;
    return '<button class="tile" data-c="' + c + '"><svg viewBox="0 0 24 24">' + icons[c] + "</svg><strong>" + c + "</strong><span>" + n + " performers</span></button>";
  }).join("");
  document.querySelectorAll(".tile").forEach((t) => t.onclick = () => { setCategory(t.dataset.c); $("performers").scrollIntoView(); });
}

function renderChips() {
  $("chips").innerHTML = "";
  categories.forEach((c) => {
    const b = document.createElement("button");
    b.className = "chip" + (c === activeCat ? " active" : "");
    b.textContent = c;
    b.onclick = () => setCategory(c);
    $("chips").appendChild(b);
  });
}

function renderGrid() {
  const q = $("search").value.trim().toLowerCase();
  let list = performers.filter((p) =>
    (activeCat === "All" || p.category === activeCat) &&
    (activeCity === "All cities" || p.city === activeCity) &&
    p.name.toLowerCase().includes(q));
  const s = $("sort").value;
  list.sort((a, b) => s === "low" ? a.price - b.price : s === "high" ? b.price - a.price : b.rating - a.rating);
  $("count").textContent = list.length + (list.length === 1 ? " performer" : " performers") + " available";
  const grid = $("grid");
  if (!list.length) { grid.innerHTML = '<p class="empty">No performers match these filters. Try another category or city.</p>'; return; }
  grid.innerHTML = list.map((p) => {
    const n = bookedDates(p.id).length;
    return '<article class="card"><div class="card-top"><div class="avatar" style="background:' + grads[p.category] + '">' + initials(p.name) + "</div><div>" +
    "<h3>" + p.name + '<svg class="tick" viewBox="0 0 24 24"><path d="M12 2l2.4 2 3.1-.3 1 3 2.7 1.6-.9 3 .9 3-2.7 1.6-1 3-3.1-.3L12 22l-2.4-2-3.1.3-1-3L2.8 15.7l.9-3-.9-3L5.5 8l1-3 3.1.3z"/><path d="M8 12l3 3 5-6" stroke="#fff" stroke-width="2" fill="none"/></svg></h3>' +
    '<div class="rating"><svg viewBox="0 0 24 24"><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z"/></svg><b>' + p.rating + "</b> (" + p.reviews + " reviews)</div></div></div>" +
    '<p class="muted">' + p.category + " \u00B7 " + p.city + "</p>" +
    '<div class="tags">' + p.tags.map((t) => "<span>" + t + "</span>").join("") + "</div>" +
    (n ? '<p class="busy">Booked on ' + n + (n === 1 ? " date" : " dates") + "</p>" : "") +
    '<div class="card-foot"><div class="price"><small>Starting from</small><strong>' + rupee(p.price) + '</strong></div><button class="btn primary" data-id="' + p.id + '">View &amp; book</button></div></article>';
  }).join("");
  grid.querySelectorAll("button[data-id]").forEach((b) => b.onclick = () => openModal(+b.dataset.id));
}

const modal = $("modal"), form = $("bookForm");

function renderBookedDates() {
  const list = bookedDates(selected.id);
  $("mBooked").innerHTML = list.length
    ? '<span class="booked-title">Already booked dates</span>' + list.map((b) =>
        '<span class="bchip' + (b.mine ? " mine" : "") + '">' + niceDate(b.date) + (b.mine ? " \u00B7 Your booking" : " \u00B7 Booked") + "</span>").join("")
    : '<p class="free-note">All dates are free. Be the first to book.</p>';
}

function checkDate() {
  const msg = $("formMsg"), btn = form.querySelector("button[type=submit]");
  const hit = form.date.value ? clashInfo(selected.id, form.date.value) : null;
  if (hit) {
    msg.textContent = hit.mine ? "You already booked " + selected.name + " on this date." : selected.name + " is already booked by another organizer on this date. Please choose another date.";
    msg.className = "formMsg err"; btn.disabled = true;
  } else { msg.textContent = ""; msg.className = "formMsg"; btn.disabled = false; }
  return !hit;
}

async function openModal(id) {
  selected = performers.find((p) => p.id === id);
  $("mAvatar").style.background = grads[selected.category];
  $("mAvatar").textContent = initials(selected.name);
  $("mName").textContent = selected.name;
  $("mMeta").textContent = selected.category + " \u00B7 " + selected.city + " \u00B7 From " + rupee(selected.price);
  $("mBio").textContent = selected.bio;
  form.reset();
  const u = loadUser();
  if (u.organizer) form.organizer.value = u.organizer;
  if (u.phone) form.phone.value = u.phone;
  form.date.min = todayISO();
  renderBookedDates(); checkDate();
  modal.hidden = false;
  await loadShared();            // fetch the latest bookings from everyone
  renderBookedDates(); checkDate();
}
const closeModal = () => { modal.hidden = true; };
$("closeBtn").onclick = closeModal;
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
form.date.addEventListener("change", checkDate);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!checkDate()) return;
  const btn = form.querySelector("button[type=submit]"), msg = $("formMsg");
  const booking = {
    id: uuid(), performerId: selected.id, performer: selected.name,
    organizer: form.organizer.value.trim(), phone: form.phone.value,
    eventType: form.eventType.value, date: form.date.value
  };
  btn.disabled = true; msg.textContent = "Sending..."; msg.className = "formMsg";
  if (online) {
    const res = await db.from("bookings").insert({
      id: booking.id, performer_id: booking.performerId, performer_name: booking.performer,
      organizer: booking.organizer, phone: booking.phone, event_type: booking.eventType, event_date: booking.date
    });
    if (res.error) {
      if (res.error.code === "23505") {
        await loadShared(); renderBookedDates();
        msg.textContent = "Someone just booked " + selected.name + " on this date. Please choose another date.";
      } else { msg.textContent = "Could not send the request. Check your internet and try again."; }
      msg.className = "formMsg err"; btn.disabled = false; return;
    }
    await loadShared();
  }
  bookings.push(booking);
  saveBookings(); saveUser({ organizer: booking.organizer, phone: booking.phone });
  renderBookings(); renderGrid(); closeModal();
  toast("Booking request sent to " + selected.name);
});

function renderBookings() {
  const box = $("bookingList");
  $("navCount").hidden = !bookings.length; $("navCount").textContent = bookings.length;
  if (!bookings.length) { box.innerHTML = '<p class="empty">No bookings yet. Choose a performer above and tap View &amp; book.</p>'; return; }
  box.innerHTML = bookings.map((b) =>
    '<div class="booking"><div><strong>' + b.performer + "</strong><br><small>" + b.eventType + " on " + niceDate(b.date) + " \u00B7 Booked by " + b.organizer + " (" + b.phone + ')</small></div><button data-id="' + b.id + '">Cancel</button></div>').join("");
  box.querySelectorAll("button").forEach((btn) => btn.onclick = async () => {
    if (online) await db.rpc("cancel_booking", { b_id: btn.dataset.id });
    bookings = bookings.filter((x) => x.id !== btn.dataset.id);
    saveBookings(); await loadShared(); renderBookings(); renderGrid(); toast("Booking cancelled");
  });
}

$("heroSearch").addEventListener("submit", (e) => {
  e.preventDefault();
  activeCity = $("heroCity").value; setCategory($("heroCat").value);
  $("performers").scrollIntoView();
});
$("search").addEventListener("input", renderGrid);
$("sort").addEventListener("change", renderGrid);

renderControls(); renderChips(); renderGrid(); renderBookings();
loadShared().then(renderGrid);
