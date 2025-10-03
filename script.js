// let lanternsEl = document.getElementById("lanterns");
// const spawnBtn = document.getElementById("spawnBtn");
// const autoBtn = document.getElementById("autoBtn");
// const musicBtn = document.getElementById("musicBtn");
// const bg = document.getElementById("bgmusic");

// // Debug / counter
// let lanternCount = 0;
// const maxLanterns = 200; // safety limit to avoid creating too many elements

// function ensureCounter() {
//   let el = document.getElementById("lanternCount");
//   if (!el) {
//     el = document.createElement("div");
//     el.id = "lanternCount";
//     el.style.position = "absolute";
//     el.style.right = "16px";
//     el.style.top = "16px";
//     el.style.padding = "6px 10px";
//     el.style.background = "rgba(0,0,0,0.4)";
//     el.style.color = "#fff";
//     el.style.borderRadius = "8px";
//     el.style.fontFamily = "Inter, system-ui, sans-serif";
//     el.style.zIndex = 9999;
//     document.body.appendChild(el);
//   }
//   el.textContent = `Lanterns: ${lanternCount}`;
// }

// ensureCounter();

// console.log("script.js loaded");

// // Ensure lanterns container exists; create fallback if missing
// console.log('lanternsEl initial', lanternsEl);
// if (!lanternsEl) {
//   console.warn('No #lanterns container found — creating fallback container');
//   const fallback = document.createElement('div');
//   fallback.id = 'lanterns';
//   fallback.className = 'lanterns';
//   // place it above everything so we can see debug lanterns
//   fallback.style.position = 'absolute';
//   fallback.style.left = '0';
//   fallback.style.right = '0';
//   fallback.style.bottom = '10vh';
//   fallback.style.height = '80vh';
//   fallback.style.pointerEvents = 'none';
//   document.body.appendChild(fallback);
//   lanternsEl = fallback;
// }

// // Tạo sao
// function makeStars(n = 80) {
//   const wrap = document.getElementById("stars");
//   for (let i = 0; i < n; i++) {
//     const s = document.createElement("div");
//     s.className = "star";
//     s.style.left = Math.random() * 100 + "%";
//     s.style.top = Math.random() * 40 + "%";
//     const size = 1 + Math.random() * 3;
//     s.style.width = size + "px";
//     s.style.height = size + "px";
//     s.style.animationDuration = 2 + Math.random() * 3 + "s";
//     wrap.appendChild(s);
//   }
// }
// makeStars();

// // Tạo 1 đèn lồng
// function spawnLantern() {
//   if (lanternCount >= maxLanterns) {
//     console.warn("spawnLantern: reached maxLanterns", maxLanterns);
//     return;
//   }
//   const el = document.createElement("div");
//   el.className = "lantern";
//   // Add strong inline styles for debugging visibility (won't affect final CSS much)
//   el.style.zIndex = 5000;
//   el.style.boxShadow = '0 12px 40px rgba(255,220,120,0.6)';
//   el.style.outline = '1px solid rgba(255,255,255,0.06)';
//   const left = 10 + Math.random() * 80;
//   el.style.left = left + "%";
//   const time = 8 + Math.random() * 10;
//   el.style.setProperty("--time", time + "s");
//   // Ensure starting position and force animation inline for debugging
//   el.style.bottom = '-40px';
//   el.style.willChange = 'transform, opacity';
//   el.style.animation = `rise ${time}s linear forwards, sway ${time/6}s ease-in-out infinite alternate`;

//   // Nội dung đèn
//   const glow = document.createElement("div");
//   glow.className = "glow";
//   const detail = document.createElement("div");
//   detail.className = "detail";
//   const tail = document.createElement("div");
//   tail.className = "tail";
//   el.appendChild(glow);
//   el.appendChild(detail);
//   el.appendChild(tail);

//   lanternsEl.appendChild(el);
//   lanternCount += 1;
//   ensureCounter();
//   console.log("spawnLantern: created", { left, time, lanternCount });
//   // debug computed style after append
//   try {
//     const cs = getComputedStyle(el);
//     console.log('computed animation-name:', cs.animationName, 'animation-duration:', cs.animationDuration);
//   } catch (e) {
//     console.warn('could not read computed style for lantern', e);
//   }

//   // Remove sau khi bay
//   setTimeout(() => {
//     el.remove();
//     lanternCount = Math.max(0, lanternCount - 1);
//     ensureCounter();
//     // small debug
//     // console.log('lantern removed, remaining', lanternCount);
//   }, time * 1000 + 1200);
// }

// spawnBtn.addEventListener("click", () => spawnLantern());

// let autoInterval = null;
// autoBtn.addEventListener("click", () => {
//   if (autoInterval) {
//     clearInterval(autoInterval);
//     autoInterval = null;
//     autoBtn.textContent = "Tự thả: TẮT";
//   } else {
//     autoInterval = setInterval(() => spawnLantern(), 1200);
//     autoBtn.textContent = "Tự thả: BẬT";
//   }
// });

// musicBtn.addEventListener("click", () => {
//   if (bg.paused) {
//     bg.play();
//     musicBtn.textContent = "Nhạc: BẬT";
//   } else {
//     bg.pause();
//     musicBtn.textContent = "Nhạc: TẮT";
//   }
// });

// // Thả vài đèn ban đầu
// for (let i = 0; i < 6; i++) setTimeout(() => spawnLantern(), 400 * i);

// // Click bầu trời thả đèn
// document.body.addEventListener("click", (e) => {
//   if (e.target.tagName.toLowerCase() === "button") return;
//   spawnLantern();
// });
