
(() => {
  "use strict";

  const topBar = document.querySelector(".top");
  const nav = document.getElementById("site-nav");
  const navToggle = document.querySelector(".nav-toggle");

  if (topBar && nav && navToggle) {
    const closeNav = () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    };

    const openNav = () => {
      nav.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.classList.add("is-open");
      document.body.classList.add("nav-open");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      if (isOpen) closeNav();
      else openNav();
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 760) closeNav();
      });
    });

    document.addEventListener("click", (event) => {
      if (window.innerWidth > 760) return;
      if (!topBar.contains(event.target)) closeNav();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
      }
    });

    const updateScrollState = () => {
      topBar.classList.toggle("is-scrolled", window.scrollY > 18);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeNav();
      updateScrollState();
    }, { passive: true });
  }

  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    const root = document.documentElement;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    let isDark = false;
    try {
      isDark = localStorage.getItem("color-theme") === "dark";
    } catch (error) {
      // Keep the theme usable when storage is unavailable.
    }

    const setTheme = (dark, save = false) => {
      isDark = dark;
      root.dataset.theme = dark ? "dark" : "light";
      themeToggle.setAttribute("aria-pressed", String(dark));
      themeToggle.textContent = dark ? "Light" : "Dark";
      if (themeColor) themeColor.content = dark ? "#101653" : "#2b2bff";

      if (save) {
        try {
          localStorage.setItem("color-theme", dark ? "dark" : "light");
        } catch (error) {
          // The current page still changes theme when storage is unavailable.
        }
      }
    };

    setTheme(isDark);
    themeToggle.addEventListener("click", () => setTheme(!isDark, true));
  }

  const shortcutDialog = document.getElementById("shortcut-dialog");
  const shortcutButton = document.querySelector(".shortcut-help");
  if (shortcutDialog && shortcutButton) {
    shortcutButton.addEventListener("click", () => shortcutDialog.showModal());
    shortcutDialog.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      shortcutDialog.close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;

      const target = event.target;
      const isEditing = target instanceof HTMLElement &&
        (target.isContentEditable || target.matches("input, textarea, select"));

      if (event.key === "?" && !isEditing) {
        event.preventDefault();
        if (shortcutDialog.open) shortcutDialog.close();
        else shortcutDialog.showModal();
      } else if (event.key === "/" && !isEditing && !shortcutDialog.open) {
        const search = document.querySelector("[data-shortcut-search]");
        event.preventDefault();
        if (search) search.focus();
        else window.location.href = "index.html#car-input";
      }
    });
  }

  const input = document.getElementById("car-input");
  const compareRoot = document.getElementById("car-compare");
  if (!input && !compareRoot) return;

  const list = input ? document.getElementById("car-list") : null;
  const out = input ? document.getElementById("car-result") : null;
  const MODEL_Y = "Tesla Model Y";
  const MODEL_Y_NEW = 41000;
  const DATA_URL = "cars-data.json";

  const FALLBACK_RAW = [
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

  function normalizeCarData(raw) {
    if (!Array.isArray(raw)) return [];

    return raw.map((item) => {
      if (Array.isArray(item)) {
        return {
          name: item[0],
          keys: item[1],
          price: item[2],
          lo: item[3],
          hi: item[4],
          note: item[5] || ""
        };
      }

      return {
        name: item.name,
        keys: item.keywords || item.keys || "",
        price: Number(item.price),
        lo: Number(item.lo ?? item.usedLow ?? item.low ?? 0),
        hi: Number(item.hi ?? item.usedHigh ?? item.high ?? 0),
        note: item.note || ""
      };
    });
  }

  async function loadCars() {
    try {
      const response = await fetch(DATA_URL, { cache: "force-cache" });
      if (!response.ok) throw new Error("Failed to load cars data");
      const data = await response.json();
      const normalized = normalizeCarData(data);
      if (normalized.length) return normalized;
    } catch (error) {
      // Ignore and fall back to bundled data when running offline or from file://.
    }
    return normalizeCarData(FALLBACK_RAW);
  }

  function buildCars(raw) {
    return raw.map((item) => {
      const name = item.name;
      const keys = item.keys || "";
      const nn = norm(name);
      return {
        name,
        nn,
        words: norm(name + " " + keys).split(" "),
        price: Number(item.price),
        lo: Number(item.lo),
        hi: Number(item.hi),
        note: item.note || ""
      };
    });
  }

  function norm(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  async function initCarSearch() {
    const rawCars = await loadCars();
    const CARS = buildCars(rawCars);
    const CAR_MAP = new Map(CARS.map((car) => [car.name, car]));
    const SEARCH_CACHE = new Map();

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

    function search(q) {
      const nq = norm(q);
      if (!nq) return [];
      if (SEARCH_CACHE.has(nq)) return SEARCH_CACHE.get(nq);

      const toks = nq.split(" ");
      const found = [];
      for (const c of CARS) {
        if (!toks.every((t) => c.words.some((w) => w.startsWith(t)))) continue;
        const score = c.nn.startsWith(nq) ? 0 : c.nn.split(" ").some((w) => w.startsWith(toks[0])) ? 1 : 2;
        found.push({ c, score });
      }
      found.sort((a, b) => a.score - b.score || a.c.name.localeCompare(b.c.name));
      const result = found.slice(0, 6).map((f) => f.c);
      // Keep typing arbitrary queries from growing this cache without a limit.
      if (SEARCH_CACHE.size >= 100) {
        SEARCH_CACHE.delete(SEARCH_CACHE.keys().next().value);
      }
      SEARCH_CACHE.set(nq, result);
      return result;
    }

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
      const frag = document.createDocumentFragment();
      matches.forEach((c, i) => {
        const li = el("li");
        li.id = "car-opt-" + i;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", i === active ? "true" : "false");
        mark(li, c.name, input.value);
        li.addEventListener("mousedown", (e) => {
          e.preventDefault();
          pick(c);
        });
        frag.append(li);
      });

      list.replaceChildren(frag);
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

    let searchTimer = 0;

    input.addEventListener("input", () => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => {
        matches = search(input.value);
        active = -1;
        renderList();
      }, 60);
    });

    input.addEventListener("keydown", (e) => {
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

    document.querySelectorAll("[data-car]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const c = CAR_MAP.get(btn.dataset.car);
        if (c) pick(c);
      });
    });

    const rand = document.getElementById("random");
    if (rand) {
      rand.addEventListener("click", () => {
        const randomCar = CARS[Math.floor(Math.random() * CARS.length)];
        pick(randomCar);
      });
    }

    show(CARS[0]);
  }

  async function initCarCompare() {
    const first = document.getElementById("compare-car-a");
    const second = document.getElementById("compare-car-b");
    const results = document.getElementById("compare-results");
    const error = document.getElementById("compare-error");
    const firstList = document.getElementById("compare-list-a");
    const secondList = document.getElementById("compare-list-b");
    if (!first || !second || !results || !error || !firstList || !secondList) return;

    results.setAttribute("aria-busy", "true");
    try {
      const cars = buildCars(await loadCars());
      if (!cars.length) throw new Error("No car data is available.");

      const carsByName = new Map(cars.map((car) => [car.name, car]));
      const selectedCars = [
        carsByName.has("Tesla Model Y") ? carsByName.get("Tesla Model Y") : cars[0],
        carsByName.get("Ford F-150 Raptor") ||
          cars.find((car) => car.name !== (carsByName.get("Tesla Model Y") || cars[0]).name) ||
          cars[0]
      ];
      const pickers = [
        { input: first, list: firstList, side: 0, active: -1, matches: [] },
        { input: second, list: secondList, side: 1, active: -1, matches: [] }
      ];

      pickers.forEach((picker) => {
        picker.input.value = selectedCars[picker.side].name;
        picker.input.addEventListener("focus", () => {
          picker.input.select();
          renderPicker(picker);
        });
        picker.input.addEventListener("input", () => {
          picker.active = -1;
          renderPicker(picker);
        });
        picker.input.addEventListener("keydown", (event) => {
          if (event.key === "ArrowDown" && picker.matches.length) {
            event.preventDefault();
            picker.active = (picker.active + 1) % picker.matches.length;
            renderPicker(picker);
          } else if (event.key === "ArrowUp" && picker.matches.length) {
            event.preventDefault();
            picker.active = picker.active <= 0 ? picker.matches.length - 1 : picker.active - 1;
            renderPicker(picker);
          } else if (event.key === "Enter" && picker.matches.length) {
            event.preventDefault();
            chooseCar(picker, picker.matches[picker.active >= 0 ? picker.active : 0]);
          } else if (event.key === "Escape") {
            closePicker(picker);
          }
        });
        picker.input.addEventListener("blur", () => closePicker(picker));
      });

      const money = (amount) => amount >= 1000000
        ? "$" + (amount / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
        : "$" + amount.toLocaleString("en-US");

      function makeCard(car, side, scale) {
        const card = document.createElement("article");
        card.className = "compare-card";

        const label = document.createElement("p");
        label.className = "compare-card-label";
        label.textContent = "CAR " + side;

        const name = document.createElement("h2");
        name.textContent = car.name;

        const stats = document.createElement("dl");
        stats.className = "compare-stats";
        [
          ["New", money(car.price)],
          ["Used range", money(car.lo) + " – " + money(car.hi)]
        ].forEach(([term, value]) => {
          const row = document.createElement("div");
          const dt = document.createElement("dt");
          const dd = document.createElement("dd");
          dt.textContent = term;
          dd.textContent = value;
          row.append(dt, dd);
          stats.append(row);
        });

        const bars = document.createElement("div");
        bars.className = "compare-bars";
        [
          ["New", car.price],
          ["Used midpoint", (car.lo + car.hi) / 2]
        ].forEach(([labelText, value]) => {
          const row = document.createElement("div");
          row.className = "compare-bar-row";
          const labelTextNode = document.createElement("span");
          const track = document.createElement("span");
          const fill = document.createElement("span");
          const valueText = document.createElement("strong");
          labelTextNode.textContent = labelText;
          track.className = "compare-track";
          fill.className = "compare-fill";
          fill.style.width = Math.max(2, value / scale * 100) + "%";
          track.append(fill);
          valueText.textContent = money(value);
          row.append(labelTextNode, track, valueText);
          bars.append(row);
        });

        card.append(label, name, stats, bars);
        if (car.note) {
          const note = document.createElement("p");
          note.className = "compare-car-note";
          note.textContent = car.note;
          card.append(note);
        }
        return card;
      }

      function closePicker(picker) {
        picker.matches = [];
        picker.active = -1;
        picker.list.replaceChildren();
        picker.list.hidden = true;
        picker.input.setAttribute("aria-expanded", "false");
        picker.input.removeAttribute("aria-activedescendant");
      }

      function renderPicker(picker) {
        const query = norm(picker.input.value);
        const otherCar = selectedCars[1 - picker.side];
        picker.matches = cars
          .filter((car) => car.name !== otherCar.name &&
            (!query || norm(car.name + " " + car.words.join(" ")).includes(query)))
          .sort((a, b) => {
            if (!query) return a.name.localeCompare(b.name);
            const aName = norm(a.name);
            const bName = norm(b.name);
            return Number(!aName.startsWith(query)) - Number(!bName.startsWith(query)) ||
              a.name.localeCompare(b.name);
          })
          .slice(0, 8);

        const fragment = document.createDocumentFragment();
        picker.matches.forEach((car, index) => {
          const option = document.createElement("li");
          option.id = picker.list.id + "-option-" + index;
          option.setAttribute("role", "option");
          option.setAttribute("aria-selected", String(index === picker.active));
          option.textContent = car.name;
          option.addEventListener("mousedown", (event) => {
            event.preventDefault();
            chooseCar(picker, car);
          });
          fragment.append(option);
        });

        if (!picker.matches.length) {
          const empty = document.createElement("li");
          empty.className = "suggest-empty";
          empty.setAttribute("role", "option");
          empty.setAttribute("aria-disabled", "true");
          empty.textContent = "No matching cars";
          fragment.append(empty);
        }

        picker.list.replaceChildren(fragment);
        picker.list.hidden = false;
        picker.input.setAttribute("aria-expanded", "true");
        if (picker.active >= 0 && picker.matches[picker.active]) {
          picker.input.setAttribute("aria-activedescendant", picker.list.id + "-option-" + picker.active);
          picker.list.children[picker.active].scrollIntoView({ block: "nearest" });
        } else {
          picker.input.removeAttribute("aria-activedescendant");
        }
      }

      function chooseCar(picker, car) {
        selectedCars[picker.side] = car;
        picker.input.value = car.name;
        closePicker(picker);
        render();
        const otherPicker = pickers[1 - picker.side];
        if (otherPicker.input.getAttribute("aria-expanded") === "true") renderPicker(otherPicker);
      }

      function render() {
        const [left, right] = selectedCars;
        if (!left || !right) return;

        const scale = Math.max(left.price, right.price, left.hi, right.hi);
        const usedLeft = (left.lo + left.hi) / 2;
        const usedRight = (right.lo + right.hi) / 2;
        const describeGap = (label, leftName, leftValue, rightName, rightValue) => {
          if (leftValue === rightValue) return label + ": both are about " + money(leftValue) + ".";
          return label + ": " + (leftValue < rightValue ? leftName : rightName) +
            " is lower by " + money(Math.abs(leftValue - rightValue)) + ".";
        };
        const insight = document.createElement("p");
        insight.className = "compare-insight";
        insight.textContent = [
          describeGap("New price", left.name, left.price, right.name, right.price),
          describeGap("Used midpoint", left.name, usedLeft, right.name, usedRight)
        ].join(" ");

        results.replaceChildren(makeCard(left, "01", scale), makeCard(right, "02", scale), insight);
        error.hidden = true;
      }

      render();
    } catch (loadError) {
      error.textContent = "Car prices couldn’t be loaded. Please try again in a moment.";
      error.hidden = false;
    } finally {
      results.setAttribute("aria-busy", "false");
    }
  }

  if (input) initCarSearch();
  if (compareRoot) initCarCompare();
})();
/* Lights and Night Drive.
   Lamp on: the normal site. Lamp off: the page goes dark and a car drives
   down the left edge as you scroll, its headlights lighting what is ahead. */
(() => {
  const root = document.documentElement;
  const lamp = document.querySelector(".lamp");
  if (!lamp) return;

  const header = document.querySelector(".top");
  const bell = lamp.querySelector(".bell-container");
  const intro = lamp.closest(".intro");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotion.matches) {
    root.classList.remove("night");
    return;
  }

  /* Change this if you save the car under another name */
  const CAR_IMAGE = "images/car-top.webp";

  /* Shown only if the image is missing */
  const CAR_FALLBACK = `<svg viewBox="0 0 40 84" aria-hidden="true" focusable="false">
    <g fill="#050520">
      <rect x="2.5" y="11" width="4" height="14" rx="2"/>
      <rect x="33.5" y="11" width="4" height="14" rx="2"/>
      <rect x="2.5" y="57" width="4" height="14" rx="2"/>
      <rect x="33.5" y="57" width="4" height="14" rx="2"/>
    </g>
    <path d="M8 9 C8 3 13 1 20 1 C27 1 32 3 32 9 L33 44 C34 62 31 77 20 82 C9 77 6 62 7 44 Z" fill="#0c0c48" stroke="rgba(255,255,255,.4)" stroke-width="1"/>
    <path d="M12 12 L28 12 L29 21 L11 21 Z" fill="#17176a"/>
    <path d="M11 24 L29 24 L30 50 L10 50 Z" fill="#1d1d7a"/>
    <path d="M10.5 53 L29.5 53 L27.5 66 L12.5 66 Z" fill="#17176a"/>
    <ellipse cx="4.5" cy="55" rx="2.2" ry="3" fill="#0c0c48" stroke="rgba(255,255,255,.3)" stroke-width=".6"/>
    <ellipse cx="35.5" cy="55" rx="2.2" ry="3" fill="#0c0c48" stroke="rgba(255,255,255,.3)" stroke-width=".6"/>
    <rect class="rear" x="8" y="2" width="24" height="2.4" rx="1.2" fill="#ff3347"/>
    <g class="lamps" fill="#fff6d8">
      <rect x="11" y="76" width="7" height="2" rx="1" transform="rotate(14 14.5 77)"/>
      <rect x="22" y="76" width="7" height="2" rx="1" transform="rotate(-14 25.5 77)"/>
    </g>
  </svg>`;

  let rig = null;
  let carBox = null;
  let toggle = null;
  let img = null;
  let queued = false;
  let ready = false;

  function glow(cls) {
    const s = document.createElement("span");
    s.className = cls;
    return s;
  }

  function ensureScene() {
    if (ready) return;
    ready = true;

    rig = document.createElement("div");
    rig.className = "night-rig";
    rig.setAttribute("aria-hidden", "true");
    rig.innerHTML = '<div class="night-dark"></div><div class="night-glow"></div><div class="night-car"></div>';
    document.body.append(rig);

    carBox = rig.querySelector(".night-car");

    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "night-toggle";
    toggle.textContent = "Lights on";
    toggle.hidden = true;
    document.body.append(toggle);

    toggle.addEventListener("click", () => setLight(true));

    img = new Image();
    img.alt = "";
    img.decoding = "async";
    img.addEventListener("load", () => {
      if (!rig) return;
      rig.style.setProperty("--car-ratio", String(img.naturalHeight / img.naturalWidth));
      carBox.append(img, glow("tail"), glow("lamp-l"), glow("lamp-r"));
    });
    img.addEventListener("error", () => {
      if (!rig || !carBox) return;
      carBox.innerHTML = CAR_FALLBACK;
      rig.style.setProperty("--car-ratio", "2.1");
    });
    img.src = CAR_IMAGE;
  }

  function place() {
    queued = false;
    if (!rig || !root.classList.contains("night")) return;

    const vh = window.innerHeight;
    const start = (header ? header.offsetHeight : 90) + 48;
    const end = Math.max(start, vh * 0.7);
    const room = root.scrollHeight - vh;
    const progress = room > 0
      ? Math.min(1, Math.max(0, window.scrollY / room))
      : 0;
    const y = start + (end - start) * progress;
    const nextHeight = vh * 3 + "px";
    const nextTransform = "translate3d(0," + (y - vh * 1.5) + "px,0)";

    if (rig.style.height !== nextHeight) rig.style.height = nextHeight;
    if (rig.style.transform !== nextTransform) rig.style.transform = nextTransform;
  }

  function queue() {
    if (!rig || !root.classList.contains("night") || queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      place();
    });
  }

  function setLight(on) {
    if (!ready) ensureScene();

    const nextNight = !on;
    root.classList.toggle("night", nextNight);
    if (toggle) toggle.hidden = on;

    if (bell) {
      bell.classList.toggle("off", nextNight);
      lamp.setAttribute("aria-pressed", String(on));
      if (intro) intro.classList.toggle("lit", on);
    }

    try {
      if (sessionStorage.getItem("lights") !== (on ? "on" : "off")) {
        sessionStorage.setItem("lights", on ? "on" : "off");
      }
    } catch (e) {}

    if (nextNight) place();
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("night")) setLight(true);
  });

  if (lamp) {
    lamp.addEventListener("click", () => setLight(root.classList.contains("night")));
    lamp.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        lamp.click();
      }
    });
  }

  let startOn = true;
  try { startOn = sessionStorage.getItem("lights") !== "off"; } catch (e) {}

  if (startOn) {
    root.classList.remove("night");
    if (bell) {
      bell.classList.remove("off");
      lamp.setAttribute("aria-pressed", "true");
      if (intro) intro.classList.add("lit");
    }
  } else {
    setLight(false);
  }

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
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
