
(() => {
  "use strict";

  const input = document.getElementById("car-input");
  if (!input) return;

  const list = document.getElementById("car-list");
  const out = document.getElementById("car-result");
  const MODEL_Y = "Tesla Model Y";
  const MODEL_Y_NEW = 41000;

  // name, extra words people might type, new price, used low, used high, note
  const RAW = [
    ["Tesla Model Y", "tesla my juniper", 41000, 26000, 36000, "New price is the base trim. Tesla changes prices a lot."],
    ["Tesla Model 3", "tesla m3", 37000, 20000, 30000, ""],
    ["Tesla Model S", "tesla ms plaid", 95000, 38000, 62000, "Plaid versions cost more."],
    ["Tesla Model X", "tesla mx plaid", 100000, 45000, 70000, ""],
    ["Tesla Cybertruck", "tesla truck ct", 80000, 55000, 70000, "Prices have moved a lot since launch."],
    ["Ford F-150 Raptor", "ford truck raptor f150 pickup", 83000, 41000, 75000, "Used range runs from 2018 trucks up to 2024. The Raptor R costs a lot more."],
    ["Ford F-150", "ford truck f150 pickup", 40000, 28000, 45000, ""],
    ["Ford Mustang GT", "ford mustang gt stang", 46000, 33000, 45000, ""],
    ["Ford Mustang Mach-E", "ford mustang mach e mache ev", 38000, 20000, 30000, ""],
    ["Ford Bronco", "ford bronco", 40000, 30000, 45000, ""],
    ["Ford GT", "ford gt supercar", 450000, 1000000, 1500000, "Limited run, so it sells for way more than it cost."],
    ["Chevrolet Corvette Stingray", "chevy corvette c8 vette", 70000, 55000, 68000, ""],
    ["Chevrolet Corvette Z06", "chevy corvette c8 z06 vette", 115000, 100000, 125000, ""],
    ["Toyota Camry", "toyota camry", 29000, 21000, 28000, ""],
    ["Toyota Corolla", "toyota corolla", 23000, 16000, 22000, ""],
    ["Toyota RAV4", "toyota rav4", 33000, 24000, 33000, ""],
    ["Toyota Supra", "toyota gr supra a90", 58000, 42000, 58000, ""],
    ["Toyota GR86", "toyota gr86 86 brz", 31000, 25000, 31000, ""],
    ["Toyota GR Corolla", "toyota grcorolla gr corolla", 39000, 32000, 42000, "Used ones sometimes sell above sticker."],
    ["Toyota Land Cruiser", "toyota land cruiser lc", 59000, 52000, 62000, ""],
    ["Toyota 4Runner", "toyota 4runner four runner", 44000, 33000, 45000, ""],
    ["Honda Civic", "honda civic", 25000, 18000, 24000, ""],
    ["Honda Civic Type R", "honda civic type r ctr", 47000, 38000, 50000, ""],
    ["Honda Accord", "honda accord", 29000, 21000, 28000, ""],
    ["Honda CR-V", "honda crv cr v", 31000, 22000, 30000, ""],
    ["Acura NSX", "acura honda nsx", 170000, 130000, 200000, ""],
    ["Nissan GT-R", "nissan gtr godzilla r35", 120000, 85000, 130000, "The last ones sold new around this price."],
    ["Nissan Z", "nissan z 400z", 45000, 35000, 45000, ""],
    ["Mazda MX-5 Miata", "mazda miata mx5", 31000, 22000, 30000, ""],
    ["Subaru WRX", "subaru wrx", 33000, 24000, 31000, ""],
    ["Volkswagen Golf R", "vw volkswagen golf r", 47000, 33000, 42000, ""],
    ["BMW M3", "bmw m3", 80000, 60000, 80000, ""],
    ["BMW M4", "bmw m4", 85000, 58000, 78000, ""],
    ["BMW 3 Series", "bmw 330i 3 series", 50000, 28000, 42000, ""],
    ["Mercedes-Benz G-Class", "mercedes benz g wagon gwagon g550 g63 g class", 150000, 120000, 170000, "G-Wagons hold their value really well."],
    ["Audi R8", "audi r8 v10", 160000, 130000, 190000, "The final years sold new near this price."],
    ["Audi RS6 Avant", "audi rs6 avant wagon", 125000, 100000, 130000, ""],
    ["Porsche 911 Carrera", "porsche 911 carrera", 125000, 85000, 130000, ""],
    ["Porsche 911 GT3", "porsche 911 gt3", 225000, 210000, 300000, "Used ones often sell above sticker."],
    ["Porsche Taycan", "porsche taycan ev", 100000, 50000, 80000, ""],
    ["Porsche Cayenne", "porsche cayenne suv", 95000, 45000, 70000, ""],
    ["Lamborghini Huracan", "lambo lamborghini huracan", 250000, 200000, 280000, ""],
    ["Lamborghini Urus", "lambo lamborghini urus suv", 240000, 170000, 220000, ""],
    ["Lamborghini Aventador", "lambo lamborghini aventador", 400000, 330000, 550000, "The SVJ and Ultimae cost a lot more."],
    ["Ferrari 488 GTB", "ferrari 488 gtb", 250000, 230000, 300000, ""],
    ["Ferrari F8 Tributo", "ferrari f8 tributo", 280000, 300000, 380000, ""],
    ["Ferrari Roma", "ferrari roma", 250000, 215000, 260000, ""],
    ["McLaren 720S", "mclaren 720s", 300000, 190000, 260000, ""],
    ["Bentley Continental GT", "bentley continental gt", 260000, 150000, 220000, ""],
    ["Rolls-Royce Cullinan", "rolls royce rr cullinan suv", 400000, 250000, 340000, ""],
    ["Bugatti Veyron", "bugatti veyron", 1700000, 1600000, 2500000, ""],
    ["Bugatti Chiron", "bugatti chiron", 3000000, 3000000, 4000000, ""],
    ["Koenigsegg Regera", "koenigsegg regera", 1900000, 2500000, 3800000, "Only 80 were built, and they sell for way more than they cost."],
    ["Lucid Air", "lucid air ev", 70000, 40000, 60000, ""],
    ["Rivian R1T", "rivian r1t truck ev", 70000, 40000, 58000, ""],
    ["Hyundai Ioniq 5", "hyundai ioniq 5 ev", 35000, 20000, 30000, ""],
    ["Jeep Wrangler", "jeep wrangler", 33000, 27000, 40000, ""],
    ["Land Rover Defender", "land rover range defender", 63000, 45000, 65000, ""],
    ["Cadillac Escalade", "cadillac escalade suv", 93000, 70000, 95000, ""]
  ];

  function norm(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  const CARS = RAW.map(([name, keys, price, lo, hi, note]) => {
    const nn = norm(name);
    return { name, nn, words: norm(name + " " + keys).split(" "), price, lo, hi, note };
  });

  function money(n) {
    if (n >= 1000000) {
      return "$" + (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    return "$" + n.toLocaleString("en-US");
  }

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function googleLink(query, label) {
    const a = el("a", "live", label);
    a.href = "https://www.google.com/search?q=" + encodeURIComponent(query);
    a.target = "_blank";
    a.rel = "noopener";
    return a;
  }

  /* Search: every word you type has to match the start of a word in the name */
  function search(q) {
    const nq = norm(q);
    if (!nq) return [];
    const toks = nq.split(" ");
    const found = [];
    for (const c of CARS) {
      if (!toks.every(t => c.words.some(w => w.startsWith(t)))) continue;
      const score = c.nn.startsWith(nq) ? 0 : c.nn.split(" ").some(w => w.startsWith(toks[0])) ? 1 : 2;
      found.push({ c, score });
    }
    found.sort((a, b) => a.score - b.score || a.c.name.localeCompare(b.c.name));
    return found.slice(0, 6).map(f => f.c);
  }

  /* Suggestions list */
  let matches = [];
  let active = -1;

  function mark(li, name, q) {
    const typed = q.trim().toLowerCase();
    const i = typed ? name.toLowerCase().indexOf(typed) : -1;
    if (i < 0) {
      li.textContent = name;
      return;
    }
    li.append(
      document.createTextNode(name.slice(0, i)),
      el("b", "", name.slice(i, i + typed.length)),
      document.createTextNode(name.slice(i + typed.length))
    );
  }

  function renderList() {
    list.replaceChildren();
    matches.forEach((c, i) => {
      const li = el("li");
      li.id = "car-opt-" + i;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", i === active ? "true" : "false");
      mark(li, c.name, input.value);
      li.addEventListener("mousedown", e => {
        e.preventDefault();
        pick(c);
      });
      list.append(li);
    });
    const has = matches.length > 0;
    list.hidden = !has;
    input.setAttribute("aria-expanded", String(has));
    if (active >= 0) input.setAttribute("aria-activedescendant", "car-opt-" + active);
    else input.removeAttribute("aria-activedescendant");
  }

  function closeList() {
    matches = [];
    active = -1;
    renderList();
  }

  /* Results */
  function priceBlock(label, num, sub) {
    const d = el("div", "price");
    d.append(el("div", "label", label), el("div", "num", num), el("div", "sub", sub));
    return d;
  }

  function bar(label, value, top, cls) {
    const row = el("div", "bar " + cls);
    const track = el("span", "track");
    const fill = el("span", "fill");
    track.append(fill);
    row.append(el("span", "", label), track);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fill.style.width = (value / top * 100) + "%";
    }));
    return row;
  }

  function show(car) {
    const mid = (car.lo + car.hi) / 2;
    const ratio = mid / car.price;
    const top = Math.max(car.price, car.hi);

    out.replaceChildren();
    out.append(el("h3", "", car.name));

    const prices = el("div", "prices");
    prices.append(
      priceBlock("New", money(car.price), "sticker price"),
      priceBlock("Used now", money(car.lo) + " to " + money(car.hi), "a typical one")
    );
    out.append(prices);

    const bars = el("div", "bars");
    bars.setAttribute("role", "img");
    bars.setAttribute("aria-label", "Bar chart comparing the new price with the used price");
    bars.append(bar("New", car.price, top, "new"), bar("Used", mid, top, "used"));
    out.append(bars);

    let verdict;
    if (ratio < 0.98) verdict = "A used one runs about " + Math.round(ratio * 100) + "% of the new price.";
    else if (ratio <= 1.02) verdict = "A used one costs about the same as a new one.";
    else verdict = "A used one sells for about " + ratio.toFixed(1) + "x the new price.";
    out.append(el("p", "verdict", verdict));

    if (car.name !== MODEL_Y) {
      const r = car.price / MODEL_Y_NEW;
      let vs;
      if (r >= 1.1) vs = "New, that’s about " + (r >= 10 ? Math.round(r) : r.toFixed(1)) + "x the price of a Model Y.";
      else if (r <= 0.9) vs = "New, that’s about " + Math.round(r * 100) + "% of the price of a Model Y.";
      else vs = "About the same price as a new Model Y.";
      out.append(el("p", "vs", vs));
    }

    if (car.note) out.append(el("p", "note", car.note));
    out.append(googleLink(car.name + " price new and used", "Check live prices on Google"));
  }

  function notFound(q) {
    out.replaceChildren();
    out.append(
      el("h3", "", "I don’t have “" + q + "” yet."),
      el("p", "", "Try a different spelling, or check live prices for it."),
      googleLink(q + " price new and used", "Search prices on Google")
    );
  }

  function pick(car) {
    input.value = car.name;
    closeList();
    show(car);
  }

  /* Events */
  input.addEventListener("input", () => {
    matches = search(input.value);
    active = -1;
    renderList();
  });

  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" && matches.length) {
      e.preventDefault();
      active = (active + 1) % matches.length;
      renderList();
    } else if (e.key === "ArrowUp" && matches.length) {
      e.preventDefault();
      active = active <= 0 ? matches.length - 1 : active - 1;
      renderList();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = matches[active >= 0 ? active : 0];
      if (c) pick(c);
      else if (input.value.trim()) notFound(input.value.trim());
    } else if (e.key === "Escape") {
      closeList();
    }
  });

  input.addEventListener("blur", closeList);

  document.querySelectorAll("[data-car]").forEach(btn => {
    btn.addEventListener("click", () => {
      const c = CARS.find(x => x.name === btn.dataset.car);
      if (c) pick(c);
    });
  });

  const rand = document.getElementById("random");
  if (rand) {
    rand.addEventListener("click", () => {
      pick(CARS[Math.floor(Math.random() * CARS.length)]);
    });
  }

  show(CARS[0]);
})();
/* Lamp: click or press Enter/Space to turn the light on and off */
(() => {
  const lamp = document.querySelector(".lamp");
  if (!lamp) return;

  const bell = lamp.querySelector(".bell-container");
  const intro = lamp.closest(".intro");

  function setLight(on) {
    bell.classList.toggle("off", !on);
    lamp.setAttribute("aria-pressed", String(on));
    if (intro) intro.classList.toggle("lit", on);
  }

  setLight(true);

  lamp.addEventListener("click", () => setLight(bell.classList.contains("off")));
  lamp.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      lamp.click();
    }
  });
})();
/* Now page: fade timeline entries in as they scroll into view */
(() => {
  const items = document.querySelectorAll(".log li");
  if (!items.length || !("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("seen");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(li => {
    li.classList.add("reveal");
    io.observe(li);
  });
})();