/* =========================================================
   Future Champs Academy — interactions
   ========================================================= */

// ----- Settings: change these to the academy's real data -----
const CONFIG = {
  whatsapp: "201000000000", // international format, no + or spaces
};

// Weekly schedule — edit freely
const SCHEDULE = [
  { day: "السبت",   sport: "football", group: "الناشئين 7–11", time: "4:00 – 5:00 م", place: "ملعب 1" },
  { day: "السبت",   sport: "swim",     group: "البراعم 4–6",   time: "5:00 – 5:45 م", place: "حمام السباحة" },
  { day: "السبت",   sport: "karate",   group: "كل الأعمار",    time: "6:00 – 7:00 م", place: "صالة الدوجو" },
  { day: "الأحد",   sport: "basket",   group: "الشباب 12–15",  time: "5:00 – 6:30 م", place: "الصالة المغطاة" },
  { day: "الأحد",   sport: "gym",      group: "البراعم 4–6",   time: "4:00 – 4:45 م", place: "صالة الجمباز" },
  { day: "الاثنين", sport: "football", group: "الشباب 12–15",  time: "6:00 – 7:30 م", place: "ملعب 2" },
  { day: "الاثنين", sport: "tennis",   group: "الناشئين 7–11", time: "4:30 – 5:30 م", place: "ملاعب التنس" },
  { day: "الثلاثاء", sport: "swim",    group: "الناشئين 7–11", time: "5:00 – 6:00 م", place: "حمام السباحة" },
  { day: "الثلاثاء", sport: "gym",     group: "الناشئين 7–11", time: "6:00 – 7:00 م", place: "صالة الجمباز" },
  { day: "الأربعاء", sport: "football", group: "النخبة 16–18", time: "7:00 – 9:00 م", place: "ملعب 1" },
  { day: "الأربعاء", sport: "basket",  group: "الناشئين 7–11", time: "4:00 – 5:00 م", place: "الصالة المغطاة" },
  { day: "الخميس",  sport: "tennis",   group: "الشباب 12–15",  time: "5:00 – 6:30 م", place: "ملاعب التنس" },
  { day: "الخميس",  sport: "karate",   group: "كل الأعمار",    time: "6:00 – 7:00 م", place: "صالة الدوجو" },
  { day: "الجمعة",  sport: "swim",     group: "الشباب 12–15",  time: "10:00 – 11:30 ص", place: "حمام السباحة" },
];
const SPORTS = {
  football: { name: "كرة القدم", color: "#c6ff3d" },
  swim:     { name: "السباحة",   color: "#3dd6ff" },
  basket:   { name: "كرة السلة", color: "#ff8a3d" },
  tennis:   { name: "التنس",     color: "#ffe03d" },
  gym:      { name: "الجمباز",   color: "#ff4d8d" },
  karate:   { name: "الكاراتيه", color: "#a78bfa" },
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ----- Header: scrolled state + mobile menu -----
const header = $("#header");
const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 20);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const burger = $("#burger");
const nav = $("#nav");
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", open);
});
$$("#nav a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
}));

// Active nav link while scrolling
const sections = $$("main section[id]");
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    $$("#nav a").forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => navObserver.observe(s));

// ----- Reveal on scroll -----
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 70 + "ms";
  revealObserver.observe(el);
});

// ----- Animated counters -----
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, start = performance.now(), dur = 1600;
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
$$("[data-count]").forEach(el => countObserver.observe(el));

// ----- Program tabs -----
$$(".tab").forEach(tab => tab.addEventListener("click", () => {
  $$(".tab").forEach(t => { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
  $$(".panel").forEach(p => { p.hidden = true; p.classList.remove("is-active"); });
  tab.classList.add("is-active");
  tab.setAttribute("aria-selected", "true");
  const panel = $("#" + tab.dataset.tab);
  panel.hidden = false;
  panel.classList.add("is-active");
}));

// ----- Schedule table + filter -----
const tbody = $("#schedTable tbody");
function renderSchedule(filter = "all") {
  const rows = SCHEDULE.filter(r => filter === "all" || r.sport === filter);
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td><b>${r.day}</b></td>
      <td><span class="dot" style="background:${SPORTS[r.sport].color}"></span>${SPORTS[r.sport].name}</td>
      <td>${r.group}</td>
      <td>${r.time}</td>
      <td>${r.place}</td>
    </tr>`).join("");
}
renderSchedule();
$$("#schedFilter .chip").forEach(chip => chip.addEventListener("click", () => {
  $$("#schedFilter .chip").forEach(c => c.classList.remove("is-active"));
  chip.classList.add("is-active");
  renderSchedule(chip.dataset.sport);
}));

// ----- Pricing toggle -----
$$(".toggle__btn").forEach(btn => btn.addEventListener("click", () => {
  $$(".toggle__btn").forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  const period = btn.dataset.period;
  $$(".plan__price b").forEach(b => { b.textContent = (+b.dataset[period]).toLocaleString("en-US"); });
  $$(".plan__price .per").forEach(p => { p.textContent = period === "month" ? "شهر" : "ترم"; });
}));

// Clicking a plan pre-selects it in the form
$$("[data-plan]").forEach(a => a.addEventListener("click", () => {
  $("#regForm select[name=plan]").value = a.dataset.plan;
}));

// ----- Registration form → WhatsApp -----
const form = $("#regForm");
const msg = $("#formMsg");
form.addEventListener("submit", e => {
  e.preventDefault();
  let valid = true;
  $$("input[required], select[required]", form).forEach(f => {
    const ok = f.checkValidity();
    f.classList.toggle("is-invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    msg.className = "form__msg err";
    msg.textContent = "من فضلك راجع الحقول المطلوبة (رقم الموبايل لازم يكون 11 رقم ويبدأ بـ 01).";
    return;
  }
  const d = Object.fromEntries(new FormData(form));
  const text =
`طلب حجز حصة تجريبية 🏅
ولي الأمر: ${d.parent}
الموبايل: ${d.phone}
اللاعب: ${d.child} (${d.age} سنة)
الرياضة: ${d.sport}
الباقة: ${d.plan}${d.notes ? "\nملاحظات: " + d.notes : ""}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  msg.className = "form__msg ok";
  msg.textContent = "تمام! كمّل الإرسال من واتساب وهنرد عليك في أقرب وقت ✅";
  form.reset();
});
$$("input, select", form).forEach(f => f.addEventListener("input", () => f.classList.remove("is-invalid")));

// ----- Misc -----
$("#waFloat").href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("السلام عليكم، عايز أستفسر عن الأكاديمية")}`;
$("#year").textContent = new Date().getFullYear();
