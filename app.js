(function () {
  const T = window.TRIP;
  const view = document.getElementById("view");

  // ---------- helpers ----------
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const mapUrl = (q) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  const dirUrl = (q) => "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(q);
  const pill = (s) => s ? `<span class="pill ${esc(s)}">${esc({ booked: "Booked", tbc: "Pending", todo: "To book", proposed: "Proposed", idea: "Idea", check: "Check dates", warn: "Likely closed" }[s] || s)}</span>` : "";
  const val = (v) => v ? esc(v) : `<span class="missing">to add</span>`;
  const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const todayIso = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  // ---------- header ----------
  document.getElementById("trip-title").textContent = T.title;
  document.getElementById("trip-sub").textContent = T.subtitle;
  function countdown() {
    const now = new Date(), dep = new Date(T.departure), back = new Date(T.returnHome);
    let txt;
    if (now < dep) {
      const days = Math.ceil((dep - now) / 86400000);
      txt = `🚗 ${days} day${days === 1 ? "" : "s"} until we leave London`;
    } else if (now <= back) {
      const n = Math.floor((now - dep) / 86400000) + 1;
      txt = `📍 Day ${n} of ${T.days.length}`;
    } else txt = "🏡 Welcome home";
    document.getElementById("countdown").textContent = txt;
  }

  // ---------- render pieces ----------
  function dayCard(d, isToday) {
    return `<div class="card day ${isToday ? "today" : ""}">
      <div class="row"><span class="date">${fmtDate(d.date)}${isToday ? " · TODAY" : ""}</span>${pill(d.status)}</div>
      <h3>${esc(d.title)}</h3>
      ${d.drive ? `<div class="drive">🚗 ${esc(d.drive)}</div>` : ""}
      <ul>${d.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      ${d.place ? `<a class="btn" href="${dirUrl(d.place)}" target="_blank" rel="noopener">🧭 Directions to ${esc(d.place)}</a>` : ""}
    </div>`;
  }

  function stayCard(s) {
    return `<div class="card">
      <div class="row"><h3>${esc(s.name)}</h3>${pill(s.status)}</div>
      <p class="muted">${esc(s.dates)}</p>
      <dl class="kv">
        <dt>Address</dt><dd>${val(s.address)}</dd>
        <dt>Check-in</dt><dd>${val(s.checkIn)}</dd>
        <dt>Check-out</dt><dd>${val(s.checkOut)}</dd>
        <dt>Booking ref</dt><dd>${val(s.ref)}</dd>
        <dt>Phone</dt><dd>${s.phone ? `<a href="tel:${esc(s.phone.replace(/\s/g, ""))}">${esc(s.phone)}</a>` : val("")}</dd>
      </dl>
      ${s.notes ? `<p class="muted" style="margin-top:8px">${esc(s.notes)}</p>` : ""}
      <a class="btn" href="${mapUrl(s.mapQuery)}" target="_blank" rel="noopener">📍 Map</a>
      <a class="btn" href="${dirUrl(s.mapQuery)}" target="_blank" rel="noopener">🧭 Directions</a>
    </div>`;
  }

  function checklist(key, title, items) {
    const done = store.get("chk-" + key, []);
    const n = items.filter((_, i) => done.includes(i)).length;
    return `<section><h2 class="section-title">${esc(title)}</h2><div class="card">
      <div class="row"><span class="muted" style="font-size:.85rem">${n} of ${items.length} done</span></div>
      <div class="progress"><div style="width:${(n / items.length) * 100}%"></div></div>
      ${items.map((it, i) => `<label class="check ${done.includes(i) ? "done" : ""}">
        <input type="checkbox" data-list="${key}" data-i="${i}" ${done.includes(i) ? "checked" : ""}><span>${esc(it)}</span></label>`).join("")}
    </div></section>`;
  }

  function bookingsCard() {
    const open = T.bookings.filter((b) => b.status !== "booked");
    return `<section><h2 class="section-title">Still to sort (${open.length})</h2>
      <div class="card">${T.bookings.map((b) => `<div class="check" style="cursor:default;display:block"><div class="row"><strong>${esc(b.item)}</strong>${pill(b.status)}</div>${b.note ? `<div class="muted" style="font-size:.85rem">${esc(b.note)}</div>` : ""}</div>`).join("")}</div>
    </section>`;
  }

  function weatherSection() {
    return `<section><h2 class="section-title">Weather</h2>
      <div class="weather-grid" id="wx">${T.weather.map((w) => `<div class="card wx" data-wx="${esc(w.name)}"><h3>${esc(w.name)}</h3><p class="muted">Loading…</p></div>`).join("")}</div>
      <p class="muted" style="font-size:.8rem">Forecast from Open-Meteo. Shows last saved forecast when offline.</p>
    </section>`;
  }

  const WX = { 0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️", 51: "🌦️", 53: "🌦️", 55: "🌧️", 61: "🌧️", 63: "🌧️", 65: "🌧️", 66: "🌧️", 67: "🌧️", 71: "🌨️", 73: "🌨️", 75: "❄️", 77: "❄️", 80: "🌦️", 81: "🌧️", 82: "🌧️", 85: "🌨️", 86: "❄️", 95: "⛈️", 96: "⛈️", 99: "⛈️" };
  async function loadWeather() {
    for (const w of T.weather) {
      const el = document.querySelector(`[data-wx="${CSS.escape(w.name)}"]`);
      if (!el) continue;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${w.lat}&longitude=${w.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=6`;
      let data = null;
      try {
        const r = await fetch(url);
        data = await r.json();
        store.set("wx-" + w.name, data);
      } catch (e) {
        data = store.get("wx-" + w.name, null);
      }
      if (!data || !data.current) { el.querySelector("p").textContent = "Unavailable offline"; continue; }
      const c = data.current, d = data.daily;
      el.innerHTML = `<h3>${esc(w.name)}</h3>
        <div class="temp">${WX[c.weather_code] || ""} ${Math.round(c.temperature_2m)}°C</div>
        <p class="muted" style="font-size:.8rem">Wind ${Math.round(c.wind_speed_10m)} km/h</p>
        <div class="days">${d.time.slice(1).map((t, i) => `<div>${new Date(t).toLocaleDateString("en-GB", { weekday: "short" })}<br>${WX[d.weather_code[i + 1]] || ""}<br>${Math.round(d.temperature_2m_max[i + 1])}°/${Math.round(d.temperature_2m_min[i + 1])}°</div>`).join("")}</div>`;
    }
  }

  // ---------- views ----------
  const views = {
    today() {
      const t = todayIso();
      const first = T.days[0].date, last = T.days[T.days.length - 1].date;
      let html = "";
      if (t < first) {
        const visa = T.bookings.find((b) => /visa/i.test(b.item));
        if (visa && visa.status !== "booked") {
          html += `<div class="card notice"><strong>Waiting on Muhammad's visa.</strong> Prague, Colmar and Muhammad's flight are on hold until it is approved.</div>`;
        }
        html += `<section><h2 class="section-title">First day</h2>${dayCard(T.days[0], false)}</section>`;
        html += bookingsCard();
      } else if (t > last) {
        html += `<div class="card"><h3>Trip complete 🎄</h3><p class="muted">Settle up any shared expenses.</p></div>`;
      } else {
        const i = T.days.findIndex((d) => d.date === t);
        if (i >= 0) {
          html += `<section><h2 class="section-title">Today</h2>${dayCard(T.days[i], true)}</section>`;
          if (T.days[i + 1]) html += `<section><h2 class="section-title">Tomorrow</h2>${dayCard(T.days[i + 1], false)}</section>`;
        }
      }
      html += weatherSection();
      html += linksSection();
      return html;
    },
    plan() {
      const t = todayIso();
      return `<section><h2 class="section-title">Day by day</h2>${T.days.map((d) => dayCard(d, d.date === t)).join("")}</section>`;
    },
    stays() {
      return `<section><h2 class="section-title">Where we sleep</h2>${T.stays.map(stayCard).join("")}</section>`;
    },
    drive() {
      return `<section><h2 class="section-title">Route</h2>
        <div class="card"><h3>Outbound: ferry</h3><p>London → Dover → Calais → Belgium → Germany → Poland → Zakopane</p><p class="muted">About 1,750 km over 3 days</p>
          <a class="btn" href="https://www.google.com/maps/dir/London/Dover/Calais/Erfurt/Krak%C3%B3w/Zakopane" target="_blank" rel="noopener">🗺️ Full route</a></div>
        <div class="card"><h3>Return: Eurotunnel</h3><p>Zakopane → Prague → Colmar → Calais → Folkestone → London</p><p class="muted">About 2,000 km over 3 days. Three long days in a row: share the driving.</p>
          <a class="btn" href="https://www.google.com/maps/dir/Zakopane/Prague/Colmar/Calais/Folkestone/London" target="_blank" rel="noopener">🗺️ Full route</a></div>
      </section>
      <section><h2 class="section-title">Rules by country</h2>
        ${T.driving.map((c) => `<div class="card"><h3>${c.flag} ${esc(c.country)}</h3><ul>${c.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>`).join("")}
        <p class="muted" style="font-size:.8rem">Rules change. Check gov.uk/driving-abroad before departure.</p>
      </section>`;
    },
    explore() {
      return `<section><h2 class="section-title">Christmas markets</h2>
        ${T.markets.map((m) => `<div class="card"><div class="row"><h3>${esc(m.city)}</h3>${pill(m.status)}</div>
          <p>${esc(m.where)}</p><p class="muted">${esc(m.dates)}</p><p>💡 ${esc(m.tip)}</p>
          <a class="btn" href="${mapUrl(m.map)}" target="_blank" rel="noopener">📍 Map</a></div>`).join("")}
      </section>
      <section><h2 class="section-title">Zakopane ideas</h2>
        ${T.zakopane.map((z) => `<div class="card"><h3>${esc(z.title)}</h3><p class="muted">${esc(z.text)}</p>
          <a class="btn" href="${mapUrl(z.map)}" target="_blank" rel="noopener">📍 Map</a></div>`).join("")}
        <div class="card notice"><strong>Mountain safety:</strong> check TOPR conditions before any walk above the valleys. Take microspikes, start early (dark by about 15:45).
          <br><a class="btn" href="https://lawiny.topr.pl/" target="_blank" rel="noopener">⚠️ TOPR conditions</a></div>
      </section>`;
    },
    lists() {
      return checklist("docs", "Documents", T.documents) + checklist("car", "Car kit", T.carKit) + checklist("pack", "Packing", T.packing) +
        `<p class="muted" style="font-size:.8rem">Ticks are saved on this phone only. Use the shared sheet for anything the whole family edits.</p>`;
    },
    info() {
      return `<section><h2 class="section-title">Who's who</h2>
        ${T.people.map((p) => `<div class="card"><div class="row"><h3>${esc(p.name)}</h3>${p.role ? `<span class="muted">${esc(p.role)}</span>` : ""}</div>
          <p class="muted">${esc(p.travel)}</p><p>${p.phone ? `<a href="tel:${esc(p.phone.replace(/\s/g, ""))}">📞 ${esc(p.phone)}</a>` : `<span class="missing">phone to add</span>`}</p></div>`).join("")}
      </section>
      <section><h2 class="section-title">Emergency</h2><div class="card">
        ${T.emergency.map((e) => `<div class="row" style="padding:6px 0"><span>${esc(e.label)}</span><a class="btn" style="margin:0" href="tel:${esc(e.number.replace(/\s/g, ""))}">📞 ${esc(e.number)}</a></div>`).join("")}
      </div></section>
      <section><h2 class="section-title">Money</h2><div class="card"><ul>
        <li>Poland: złoty (PLN)</li><li>Czech Republic: koruna (CZK)</li><li>Germany, Belgium, France: euro (EUR)</li>
        <li>Pay in local currency when a card machine asks, not GBP</li></ul></div></section>
      <section><h2 class="section-title">Useful links</h2><div class="card">
        ${T.usefulLinks.map((l) => `<p><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></p>`).join("")}
      </div></section>`;
    }
  };

  function linksSection() {
    const L = T.links;
    const items = [
      ["📊 Shared sheet (expenses, notes)", L.sharedSheet],
      ["💷 Splitwise", L.splitwise],
      ["💬 Family WhatsApp", L.whatsappGroup]
    ];
    return `<section><h2 class="section-title">Shared</h2><div class="card">
      ${items.map(([label, url]) => url ? `<a class="btn" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>` : `<p>${label}: <span class="missing">link to add</span></p>`).join("")}
    </div></section>`;
  }

  // ---------- routing ----------
  function show(tab) {
    if (!views[tab]) tab = "today";
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    view.innerHTML = views[tab]() + `<p class="footer-note">Works offline once opened. Last data update: edit trip-data.js</p>`;
    if (tab === "today") loadWeather();
    window.scrollTo(0, 0);
    store.set("tab", tab);
  }
  document.querySelector(".tabs").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) { location.hash = b.dataset.tab; }
  });
  window.addEventListener("hashchange", () => show(location.hash.slice(1)));
  view.addEventListener("change", (e) => {
    const cb = e.target;
    if (!cb.dataset.list) return;
    const key = "chk-" + cb.dataset.list, i = +cb.dataset.i;
    const done = new Set(store.get(key, []));
    cb.checked ? done.add(i) : done.delete(i);
    store.set(key, [...done]);
    show(location.hash.slice(1) || "lists");
  });

  countdown();
  setInterval(countdown, 60000);
  show(location.hash.slice(1) || "today");

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
