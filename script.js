const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const nav = $("#nav");
const header = $("#header"), bar = $("#progress");
const hood = $("#hoodFilter");
const modal = $("#propModal");
const closeModal = $("#closeModal");
const emptyState = $("#emptyState");

function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("scrolled", y > 20);
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
}
window.addEventListener("scroll", onScroll, { passive: true });

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
$$(".fade-up").forEach(el => fadeObserver.observe(el));

const themeToggle = $("#themeToggle");
const themeIcon = $("#themeIcon");

// Added try/catch to prevent crash in private mode
let savedTheme = null;
try {
    savedTheme = localStorage.getItem("theme");
} catch (e) {
    console.warn("localStorage is not available.");
}

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>';
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (e) {}
    
    themeIcon.innerHTML = isDark 
        ? '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>'
        : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
});

$("#menuToggle").addEventListener("click", () => nav.classList.toggle("open"));
$$("#nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target, end = +el.dataset.count;
        obs.unobserve(el);
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
            el.textContent = (el.dataset.prefix || "") + Math.round(end) + (el.dataset.suffix || "");
            return;
        }
        let start = null;
        const dur = 1600;
        function step(ts) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / dur, 1);
            const val = end * (1 - Math.pow(1 - progress, 3));
            el.textContent = (el.dataset.prefix || "") + Math.round(val) + (el.dataset.suffix || "");
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    });
}, { threshold: 0.1 });
$$("[data-count]").forEach(el => counterObserver.observe(el));

let status = "all";
function applyFilters() {
    let shownCount = 0;
    const hoodVal = hood ? hood.value : "all";
    
    $$("#grid .card").forEach(c => {
        const ok = (status === "all" || c.dataset.status === status) && (hoodVal === "all" || c.dataset.hood === hoodVal);
        c.hidden = !ok;
        if (ok) shownCount++;
    });

    if (shownCount === 0) {
        emptyState.classList.add("show");
    } else {
        emptyState.classList.remove("show");
    }
}

$$("[data-f]").forEach(b => b.addEventListener("click", () => {
    status = b.dataset.f;
    $$("[data-f]").forEach(x => x.classList.toggle("on", x === b));
    applyFilters();
}));
if (hood) hood.addEventListener("change", applyFilters);

$$("[data-tab]").forEach(b => b.addEventListener("click", () => {
    $$("[data-tab]").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
    $$("[data-pane]").forEach(p => { p.hidden = p.dataset.pane !== b.dataset.tab; });
}));

$$(".open-modal").forEach(card => {
    card.addEventListener("click", () => {
        $("#modalImg").src = card.dataset.img;
        
        // Dynamically update alt text for SEO/Accessibility
        $("#modalImg").alt = card.querySelector("img").alt;
        
        $("#modalThumb1").src = card.dataset.img1;
        $("#modalThumb2").src = card.dataset.img2;
        
        $("#modalThumb1").onclick = () => { 
            let temp = $("#modalImg").src; 
            $("#modalImg").src = $("#modalThumb1").src; 
            $("#modalThumb1").src = temp; 
        };
        $("#modalThumb2").onclick = () => { 
            let temp = $("#modalImg").src; 
            $("#modalImg").src = $("#modalThumb2").src; 
            $("#modalThumb2").src = temp; 
        };

        $("#modalPrice").textContent = card.dataset.price;
        $("#modalLoc").textContent = card.dataset.loc;
        $("#modalFeat").textContent = card.dataset.feat;
        
        modal.showModal(); 
    });
});

closeModal.addEventListener("click", () => {
    modal.close();
});
$("#modalTourBtn").addEventListener("click", () => {
    modal.close();
});

modal.addEventListener("click", (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        modal.close();
    }
});

$$(".faq-q").forEach(q => {
    q.addEventListener("click", () => {
        const item = q.parentElement;
        const isActive = item.classList.contains("active");
        
        $$(".faq-item").forEach(other => {
            other.classList.remove("active");
            other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        });
        
        if (!isActive) {
            item.classList.add("active");
            q.setAttribute("aria-expanded", "true");
        }
    });
});

const calcPrice = $("#calcPrice"), calcDown = $("#calcDown"), calcRate = $("#calcRate"), calcYears = $("#calcYears"), calcMonthly = $("#calcMonthly");

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

[calcPrice, calcDown, calcRate, calcYears].forEach(el => el.addEventListener("input", updateMortgage));
updateMortgage();

const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
$("#leadForm").addEventListener("submit", e => {
    e.preventDefault();
    const note = $("#formNote"), n = $("#n"), em = $("#e");
    n.classList.toggle("bad", !n.value.trim());
    em.classList.toggle("bad", !validEmail(em.value));
    if (!n.value.trim() || !validEmail(em.value)) { note.textContent = "Please fill in the highlighted fields."; return; }
    
    note.textContent = "Demo Form: This data was not sent anywhere. In a real project, this connects to your CRM.";
    e.target.reset();
});

$("#news").addEventListener("submit", e => {
    e.preventDefault();
    const ne = $("#ne"), note = $("#newsNote");
    if (!validEmail(ne.value)) { note.textContent = "Enter a valid email address."; return; }
    
    note.textContent = "Demo Form: You are subscribed!";
    ne.value = "";
});

onScroll();