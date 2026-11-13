/* --- Translations (English Only) --- */
const T = {
en: {
nav_listings:"Listings",nav_mortgage:"Calculator",nav_areas:"Neighborhoods",nav_about:"About",nav_reviews:"Reviews",nav_contact:"Get in touch",
hero_title:"Know your street before you buy on it.",
hero_desc:"Ten years of local sales, school runs and street-by-street knowledge, put to work for first-time buyers and sellers who want a fair price.",
btn_view:"See listings",btn_value:"Get a free home valuation",
st1:"years in the local market",st2:"homes sold",st3:"in total sales",st4:"of asking price achieved",
list_title:"Homes for sale and recently sold",f_all:"All",f_sale:"For sale",f_sold:"Sold",
h_all:"All neighborhoods",h_down:"Downtown",h_sub:"Suburbs",h_cen:"City Center",
beds:"beds",baths:"baths",sqft:"sq ft",btn_tour:"View Details",btn_details:"View Details",btn_schedule:"Schedule a tour",
sold_fast:"Sold in 9 days",sold_over:"Sold over asking",
empty:"No homes match these filters. Try another neighborhood.",
calc_title:"Mortgage Calculator",calc_price:"Property Price ($)",calc_down:"Down Payment (%)",calc_rate:"Interest Rate (%)",calc_years:"Loan Term (Years)",calc_monthly:"Estimated Monthly Payment",
areas_title:"Neighborhood guides",
a1:"Walk to cafes, offices and the tram. Best for people who want no car.",
a2:"Larger homes, quiet streets and parks. Best for growing families.",
a3:"Apartments close to everything. Best for first-time buyers and investors.",
avg:"Average price",schools:"Schools",transit:"Transit",t_high:"Excellent",t_mid:"Good",
about_title:"I grew up here, and I sell here.",
about_desc:"I started in real estate after helping my own family buy their first home. Since then I have helped over 150 households buy, sell and invest, and I answer my own phone.",
about_alt:"Julian Vance, real estate agent",
c1:"Top 1% of agents in the region",c2:"Licensed and certified buyer's agent",c3:"5-Star Client Satisfaction",
faq_title:"Frequently Asked Questions",
faq_q1:"How long does the buying process take?",faq_a1:"Typically 30-45 days from offer to closing.",
faq_q2:"Do I need a pre-approval?",faq_a2:"Yes, it strengthens your offer significantly.",
faq_q3:"What are the closing costs?",faq_a3:"Usually 2-5% of the purchase price, covering taxes, title fees and lender costs.",
sticky_cta:"Schedule a Consultation",
rev_title:"What clients say",
r1:'"We found our home in under a month. He answered every question, even at 10 pm."',r1s:"Bought a home",
r2:'"Sold above asking in two weeks. The photos and the pricing advice made the difference."',r2s:"Sold a home",
book_title:"Tell me what you need.",book_desc:"Choose buying or selling. I reply within one working day.",
tab_buy:"I'm buying",tab_sell:"I'm selling",f_name:"Full name",f_email:"Email",
f_budget:"Budget",f_beds:"Bedrooms",f_addr:"Property address",f_time:"When do you want to sell?",
tl1:"Within 3 months",tl2:"3 to 6 months",tl3:"Just curious",f_send:"Send request",
err:"Please fill in the highlighted fields.",sent:"Thanks! I will reply within one working day.",
news_title:"New listings in your inbox, once a month",news_btn:"Subscribe",
news_err:"Enter a valid email address.",news_ok:"You are subscribed. Check your inbox.",
rights:"© 2026 Julian Vance. All rights reserved."
}};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const t = k => T.en[k] || k;

const nav = $("#nav");
const header = $("#header"), bar = $("#progress"), stickyCta = $(".sticky-cta");
const hood = $("#hoodFilter");
const modal = $("#propModal");
const closeModal = $("#closeModal");
const calcPrice = $("#calcPrice"), calcDown = $("#calcDown"), calcRate = $("#calcRate"), calcYears = $("#calcYears"), calcMonthly = $("#calcMonthly");

/* --- Scroll Animations (Fade Up) --- */
const fadeUpElements = document.querySelectorAll(".fade-up");
const fadeUpObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      fadeUpObserver.unobserve(entry.target); // Only animate once
    }
  });
}, { threshold: 0.15 });

fadeUpElements.forEach(el => fadeUpObserver.observe(el));

/* --- Mortgage Calculator --- */
function updateMortgage() {
  const p = parseFloat(calcPrice.value) || 0;
  const downPct = parseFloat(calcDown.value) || 0;
  const r = (parseFloat(calcRate.value) || 0) / 100 / 12;
  const n = (parseFloat(calcYears.value) || 0) * 12;
  
  const principal = p - (p * (downPct / 100));
  if (principal <= 0 || r <= 0 || n <= 0) { calcMonthly.textContent = '$0'; return; }
  
  const monthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  calcMonthly.textContent = formatter.format(monthly);
}

/* --- Scroll Events --- */
function onScroll() {
  const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
  header.classList.toggle("scrolled", y > 20);
  bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
  stickyCta.classList.toggle("show", y > 600);
}
addEventListener("scroll", onScroll, { passive: true });

/* --- Dark Mode Toggle --- */
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>';
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    
    themeIcon.innerHTML = isDark 
        ? '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>'
        : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
});

/* --- Mobile Menu --- */
$("#menuToggle").addEventListener("click", () => nav.classList.toggle("open"));
$$("#nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

/* --- Animated Counters --- */
const counterIO = new IntersectionObserver((entries, o) => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count;
    o.unobserve(el);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = (el.dataset.prefix || "") + Math.round(end) + (el.dataset.suffix || ""); return; }
    const t0 = performance.now(), dur = 1600;
    (function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = (el.dataset.prefix || "") + Math.round(end * (1 - Math.pow(1 - p, 3))) + (el.dataset.suffix || "");
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  });
}, { threshold: 0.1 });
$$("[data-count]").forEach(el => counterIO.observe(el));

/* --- Listing Filters --- */
let status = "all";
function applyFilters() {
  let shown = 0;
  $$("#grid .card").forEach(c => {
    const ok = (status === "all" || c.dataset.status === status) && (hood.value === "all" || c.dataset.hood === hood.value);
    c.hidden = !ok;
    if (ok) shown++;
  });
  $("#empty").hidden = shown > 0;
}
$$("[data-f]").forEach(b => b.addEventListener("click", () => {
  status = b.dataset.f;
  $$("[data-f]").forEach(x => x.classList.toggle("on", x === b));
  applyFilters();
}));
hood.addEventListener("change", applyFilters);

/* --- Buyer / Seller Tabs --- */
$$("[data-tab]").forEach(b => b.addEventListener("click", () => {
  $$("[data-tab]").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
  $$("[data-pane]").forEach(p => { p.hidden = p.dataset.pane !== b.dataset.tab; });
}));

/* --- Property Modal --- */
$$(".open-modal").forEach(card => {
  card.addEventListener("click", () => {
    $("#modalImg").src = card.dataset.img;
    $("#modalThumb1").src = card.dataset.img1;
    $("#modalThumb2").src = card.dataset.img2;
    
    $("#modalThumb1").onclick = () => { let temp = $("#modalImg").src; $("#modalImg").src = $("#modalThumb1").src; $("#modalThumb1").src = temp; };
    $("#modalThumb2").onclick = () => { let temp = $("#modalImg").src; $("#modalImg").src = $("#modalThumb2").src; $("#modalThumb2").src = temp; };

    $("#modalPrice").textContent = card.dataset.price;
    $("#modalLoc").textContent = card.dataset.loc;
    $("#modalFeat").textContent = card.dataset.feat;
    
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
});

modal.addEventListener("click", (e) => { 
    if(e.target === modal) {
        modal.classList.remove("active"); 
        document.body.style.overflow = "";
    }
});

$("#modalTourBtn").addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
});

/* --- FAQ Accordion --- */
$$(".faq-q").forEach(q => {
  q.addEventListener("click", () => {
    const item = q.parentElement;
    $$(".faq-item").forEach(other => { if (other !== item) other.classList.remove("active"); });
    item.classList.toggle("active");
  });
});

[calcPrice, calcDown, calcRate, calcYears].forEach(el => el.addEventListener("input", updateMortgage));

/* --- Forms --- */
const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
$("#leadForm").addEventListener("submit", e => {
  e.preventDefault();
  const note = $("#formNote"), n = $("#n"), em = $("#e");
  n.classList.toggle("bad", !n.value.trim());
  em.classList.toggle("bad", !validEmail(em.value));
  if (!n.value.trim() || !validEmail(em.value)) { note.textContent = t("err"); return; }
  note.textContent = t("sent");
  e.target.reset();
});

$("#news").addEventListener("submit", e => {
  e.preventDefault();
  const ne = $("#ne"), note = $("#newsNote");
  if (!validEmail(ne.value)) { note.textContent = t("news_err"); return; }
  note.textContent = t("news_ok");
  ne.value = "";
});

/* --- Smooth Video Fade-in --- */
const heroVideo = document.getElementById("heroVideo");
const archContainer = document.querySelector(".arch");

if (heroVideo && archContainer) {
    if (heroVideo.readyState >= 2) {
        archContainer.classList.add("ready");
    } else {
        heroVideo.addEventListener("canplay", () => {
            archContainer.classList.add("ready");
        });
    }
}

/* --- Preload Modal Images --- */
window.addEventListener("load", () => {
    document.querySelectorAll(".open-modal").forEach(card => {
        if(card.dataset.img) { new Image().src = card.dataset.img; }
        if(card.dataset.img1) { new Image().src = card.dataset.img1; }
        if(card.dataset.img2) { new Image().src = card.dataset.img2; }
    });
});

/* --- Init --- */
updateMortgage();
onScroll();