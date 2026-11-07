/*
  GAMES
  -----
  Simple offline games for the journey. Mounted by app.js on the Games tab.
  Each game keeps its own state here so switching tabs does not reset a game in progress.
*/
(function () {
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  let current = store.get("game", "ttt");
  let root = null;

  // ---------- Tic-tac-toe ----------
  const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const ttt = { board: Array(9).fill(""), turn: "X", over: false, winLine: null, mode: "phone", level: "hard", scores: store.get("ttt-scores", { X: 0, O: 0, draw: 0 }) };

  function tttWinner(b) {
    for (const l of LINES) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return { p: b[l[0]], line: l };
    return b.every(Boolean) ? { p: "draw" } : null;
  }
  function minimax(b, player) {
    const w = tttWinner(b);
    if (w) return { score: w.p === "O" ? 10 : w.p === "X" ? -10 : 0 };
    let best = { score: player === "O" ? -Infinity : Infinity };
    b.forEach((c, i) => {
      if (c) return;
      b[i] = player;
      const s = minimax(b, player === "O" ? "X" : "O").score;
      b[i] = "";
      if (player === "O" ? s > best.score : s < best.score) best = { score: s, i };
    });
    return best;
  }
  function phoneMove() {
    const free = ttt.board.map((c, i) => c ? null : i).filter((i) => i !== null);
    // Easy: mostly random. Hard: unbeatable.
    const i = ttt.level === "easy" && Math.random() < 0.7 ? free[Math.floor(Math.random() * free.length)] : minimax(ttt.board.slice(), "O").i;
    tttPlay(i);
  }
  function tttPlay(i) {
    if (ttt.over || ttt.board[i]) return;
    ttt.board[i] = ttt.turn;
    const w = tttWinner(ttt.board);
    if (w) {
      ttt.over = true; ttt.winLine = w.line || null;
      ttt.scores[w.p === "draw" ? "draw" : w.p]++;
      store.set("ttt-scores", ttt.scores);
    } else ttt.turn = ttt.turn === "X" ? "O" : "X";
    render();
    if (!ttt.over && ttt.mode === "phone" && ttt.turn === "O") setTimeout(phoneMove, 380);
  }
  function tttNew() { Object.assign(ttt, { board: Array(9).fill(""), turn: "X", over: false, winLine: null }); }
  function tttHtml() {
    const w = tttWinner(ttt.board);
    const oName = ttt.mode === "phone" ? "Phone" : "O";
    let status = ttt.over
      ? (w.p === "draw" ? "It's a draw 🤝" : `${w.p === "X" ? "❌ X" : "⭕ " + oName} wins! 🎉`)
      : (ttt.mode === "phone" && ttt.turn === "O" ? "Phone is thinking…" : `${ttt.turn === "X" ? "❌ X" : "⭕ O"} to play`);
    return `
      <div class="seg small">
        <button data-act="ttt-mode" data-v="phone" class="${ttt.mode === "phone" ? "on" : ""}">vs Phone</button>
        <button data-act="ttt-mode" data-v="friend" class="${ttt.mode === "friend" ? "on" : ""}">vs Friend</button>
      </div>
      ${ttt.mode === "phone" ? `<div class="seg small">
        <button data-act="ttt-level" data-v="easy" class="${ttt.level === "easy" ? "on" : ""}">Easy</button>
        <button data-act="ttt-level" data-v="hard" class="${ttt.level === "hard" ? "on" : ""}">Unbeatable</button>
      </div>` : ""}
      <p class="game-status">${status}</p>
      <div class="ttt">${ttt.board.map((c, i) => `<button data-act="ttt-cell" data-i="${i}" class="${ttt.winLine && ttt.winLine.includes(i) ? "win" : ""}" aria-label="Square ${i + 1}">${c === "X" ? "❌" : c === "O" ? "⭕" : ""}</button>`).join("")}</div>
      <div class="scores"><span>❌ X <b>${ttt.scores.X}</b></span><span>Draws <b>${ttt.scores.draw}</b></span><span>⭕ ${oName} <b>${ttt.scores.O}</b></span></div>
      <button class="btn" data-act="ttt-new">🔄 New game</button>
      <button class="btn" data-act="ttt-reset">Reset scores</button>`;
  }

  // ---------- Connect 4 ----------
  const C4R = 6, C4C = 7;
  const c4 = { grid: Array(C4R * C4C).fill(""), turn: "R", over: false, win: null, scores: store.get("c4-scores", { R: 0, Y: 0 }) };
  function c4Check(g, r, c) {
    const p = g[r * C4C + c];
    for (const [dr, dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
      const cells = [[r, c]];
      for (const s of [1, -1]) {
        let rr = r + dr * s, cc = c + dc * s;
        while (rr >= 0 && rr < C4R && cc >= 0 && cc < C4C && g[rr * C4C + cc] === p) { cells.push([rr, cc]); rr += dr * s; cc += dc * s; }
      }
      if (cells.length >= 4) return cells.map(([a, b]) => a * C4C + b);
    }
    return null;
  }
  function c4Drop(col) {
    if (c4.over) return;
    for (let r = C4R - 1; r >= 0; r--) {
      const i = r * C4C + col;
      if (!c4.grid[i]) {
        c4.grid[i] = c4.turn;
        const win = c4Check(c4.grid, r, col);
        if (win) { c4.over = true; c4.win = win; c4.scores[c4.turn]++; store.set("c4-scores", c4.scores); }
        else if (c4.grid.every(Boolean)) c4.over = true;
        else c4.turn = c4.turn === "R" ? "Y" : "R";
        render();
        return;
      }
    }
  }
  function c4Html() {
    const name = (p) => p === "R" ? "🔴 Red" : "🟡 Yellow";
    const status = c4.over ? (c4.win ? `${name(c4.turn)} wins! 🎉` : "It's a draw 🤝") : `${name(c4.turn)} to play`;
    return `
      <p class="game-status">${status}</p>
      <div class="c4">${c4.grid.map((p, i) => `<button data-act="c4-col" data-c="${i % C4C}" class="${p ? "p" + p : ""} ${c4.win && c4.win.includes(i) ? "win" : ""}" aria-label="Column ${i % C4C + 1}"></button>`).join("")}</div>
      <div class="scores"><span>🔴 Red <b>${c4.scores.R}</b></span><span>🟡 Yellow <b>${c4.scores.Y}</b></span></div>
      <p class="muted" style="font-size:.82rem">Tap any column to drop a counter. Pass the phone between turns.</p>
      <button class="btn" data-act="c4-new">🔄 New game</button>
      <button class="btn" data-act="c4-reset">Reset scores</button>`;
  }

  // ---------- Memory match ----------
  const EMOJI = ["🎄", "⛷️", "🏔️", "❄️", "🦌", "🎁", "☕", "🧦"];
  const mem = { cards: [], open: [], found: [], moves: 0, lock: false, best: store.get("mem-best", null) };
  function memNew() { Object.assign(mem, { cards: shuffle([...EMOJI, ...EMOJI]), open: [], found: [], moves: 0, lock: false }); }
  memNew();
  function memFlip(i) {
    if (mem.lock || mem.open.includes(i) || mem.found.includes(i)) return;
    mem.open.push(i);
    if (mem.open.length === 2) {
      mem.moves++;
      const [a, b] = mem.open;
      if (mem.cards[a] === mem.cards[b]) {
        mem.found.push(a, b); mem.open = [];
        if (mem.found.length === mem.cards.length && (!mem.best || mem.moves < mem.best)) { mem.best = mem.moves; store.set("mem-best", mem.best); }
      } else {
        mem.lock = true;
        setTimeout(() => { mem.open = []; mem.lock = false; render(); }, 750);
      }
    }
    render();
  }
  function memHtml() {
    const done = mem.found.length === mem.cards.length;
    return `
      <p class="game-status">${done ? `All pairs in ${mem.moves} moves! 🎉` : `Moves: ${mem.moves}`}${mem.best ? ` <span class="muted">· Best: ${mem.best}</span>` : ""}</p>
      <div class="mem">${mem.cards.map((e, i) => {
        const up = mem.open.includes(i) || mem.found.includes(i);
        return `<button data-act="mem-card" data-i="${i}" class="${up ? "up" : ""} ${mem.found.includes(i) ? "found" : ""}" aria-label="Card ${i + 1}">${up ? e : ""}</button>`;
      }).join("")}</div>
      <button class="btn" data-act="mem-new">🔄 Shuffle</button>`;
  }

  // ---------- Car games (no screen needed) ----------
  const PLATES = [
    ["PL", "Poland"], ["D", "Germany"], ["CZ", "Czechia"], ["SK", "Slovakia"], ["F", "France"], ["B", "Belgium"],
    ["NL", "Netherlands"], ["L", "Luxembourg"], ["A", "Austria"], ["CH", "Switzerland"], ["H", "Hungary"], ["I", "Italy"],
    ["E", "Spain"], ["UA", "Ukraine"], ["LT", "Lithuania"], ["RO", "Romania"], ["DK", "Denmark"], ["UK", "United Kingdom"]
  ];
  const PROMPTS = [
    "Would you rather ski down Kasprowy Wierch or take the cable car both ways?",
    "Would you rather only eat oscypek or only eat pierogi for a week?",
    "Would you rather have a car that flies or a car that drives itself?",
    "Would you rather spend Christmas on a beach or in the snow?",
    "Would you rather be able to speak every language or play every instrument?",
    "Would you rather live in Zakopane or in Prague?",
    "Would you rather never have to queue again or never sit in traffic again?",
    "Would you rather build a snowman or have a snowball fight?",
    "20 Questions: think of a famous person. Others ask yes/no questions.",
    "20 Questions: think of an animal. Others ask yes/no questions.",
    "Word chain: say a word, the next person says one starting with its last letter. Topic: food.",
    "Word chain: cities of the world. No repeats!",
    "Name 5 Polish dishes in 30 seconds.",
    "Teach everyone one Polish word. Quiz them in 10 minutes.",
    "Story time: each person adds one sentence to a story that starts 'The car broke down in the forest…'",
    "Guess the song: hum a song, others guess.",
    "Best memory of last Christmas? Everyone shares one.",
    "Alphabet game: find each letter A to Z on road signs, in order.",
    "Spot it first: a red car, a horse, a church tower, a snowman.",
    "Who can stay silent the longest? Starting… now."
  ];
  const car = { plates: store.get("plates", []), prompt: null };
  function carHtml() {
    return `
      <div class="card notice"><strong>Driver's eyes on the road.</strong> Screen games are for passengers. These ones everyone can play by talking.</div>
      <h3 style="margin:14px 0 6px">🎲 Give us a challenge</h3>
      <div class="card prompt">${car.prompt ? car.prompt : "Tap the button for a would-you-rather, a word game or a challenge."}</div>
      <button class="btn" data-act="car-prompt">🎲 New challenge</button>
      <h3 style="margin:18px 0 6px">🚘 Number plate bingo</h3>
      <p class="muted" style="font-size:.85rem;margin:0 0 8px">Spot cars from each country (the code on the blue EU strip). ${car.plates.length} of ${PLATES.length} found.</p>
      <div class="plates">${PLATES.map(([code, name]) => `<button data-act="plate" data-v="${code}" class="${car.plates.includes(code) ? "on" : ""}"><b>${code}</b><small>${name}</small></button>`).join("")}</div>
      <button class="btn" data-act="plates-reset">Reset bingo</button>`;
  }

  // ---------- shell ----------
  const GAMES = [["ttt", "❌⭕", "Tic-tac-toe"], ["c4", "🔴", "Connect 4"], ["mem", "🧠", "Memory"], ["car", "🚗", "Car games"]];
  function html() {
    const body = { ttt: tttHtml, c4: c4Html, mem: memHtml, car: carHtml }[current]();
    return `<section>
      <div class="seg games-nav">${GAMES.map(([id, icon, label]) => `<button data-act="game" data-v="${id}" class="${current === id ? "on" : ""}"><span>${icon}</span>${label}</button>`).join("")}</div>
      <div class="game">${body}</div>
    </section>`;
  }
  function render() {
    if (!root || !root.isConnected) return;
    const g = root.querySelector(".games-root");
    if (g) g.innerHTML = html();
  }

  function onClick(e) {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const v = b.dataset.v;
    switch (b.dataset.act) {
      case "game": current = v; store.set("game", v); break;
      case "ttt-cell": if (!(ttt.mode === "phone" && ttt.turn === "O")) tttPlay(+b.dataset.i); return;
      case "ttt-mode": ttt.mode = v; tttNew(); break;
      case "ttt-level": ttt.level = v; tttNew(); break;
      case "ttt-new": tttNew(); break;
      case "ttt-reset": ttt.scores = { X: 0, O: 0, draw: 0 }; store.set("ttt-scores", ttt.scores); break;
      case "c4-col": c4Drop(+b.dataset.c); return;
      case "c4-new": Object.assign(c4, { grid: Array(C4R * C4C).fill(""), turn: "R", over: false, win: null }); break;
      case "c4-reset": c4.scores = { R: 0, Y: 0 }; store.set("c4-scores", c4.scores); break;
      case "mem-card": memFlip(+b.dataset.i); return;
      case "mem-new": memNew(); break;
      case "car-prompt": {
        let p; do { p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)]; } while (p === car.prompt);
        car.prompt = p; break;
      }
      case "plate": car.plates = car.plates.includes(v) ? car.plates.filter((x) => x !== v) : [...car.plates, v]; store.set("plates", car.plates); break;
      case "plates-reset": car.plates = []; store.set("plates", []); break;
      default: return;
    }
    render();
  }

  window.Games = {
    html: () => `<div class="games-root">${html()}</div>`,
    mount(el) {
      root = el;
      el.querySelector(".games-root").addEventListener("click", onClick);
    }
  };
})();
