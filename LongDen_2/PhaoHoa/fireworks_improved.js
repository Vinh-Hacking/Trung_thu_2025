// Improved Vanilla JS fireworks effect (Version 9.0 - Chỉ 1 Quả/Click + Giới hạn 5)

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Cài đặt giới hạn tối đa số lượng pháo hoa đang bay
const MAX_ROCKETS = 5;
// Cài đặt độ trễ click (300ms = 0.3s)
const CLICK_DELAY_MS = 300;
let isClickReady = true; // Cờ kiểm soát độ trễ

const gravity = 0.08;
const wind = 0.02;
const particles = [];
const rockets = [];
const colors = [
  "#ff0043",
  "#14fc56",
  "#1e90ff",
  "#ffae00",
  "#ff00ff",
  "#00ff00",
  "#ffff00",
  "#ff4500",
  "#8a2be2",
  "#00ffff",
  "#ffa500",
  "#dc143c",
  "#32cd32",
  "#ff1493",
  "#00bfff",
];

// Helper to convert hex to RGB string
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : null;
}

// --- Particle Class ---
class Particle {
  constructor(x, y, color, vx, vy, size, life, trail = true) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.life = life;
    this.maxLife = life;
    this.alpha = 1;
    this.trail = trail ? [] : null;
    this.twinkle = Math.random() > 0.4;
    this.twinkleSpeed = 0.1 + Math.random() * 0.3;
    this.twinklePhase = Math.random() * Math.PI * 2;
  }

  update() {
    if (this.trail) {
      this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
      if (this.trail.length > 15) this.trail.shift();
    }

    this.vx *= 0.97;
    this.vy *= 0.97;

    this.vy += gravity;
    this.vx += wind * (Math.random() - 0.5) * 2;

    this.x += this.vx;
    this.y += this.vy;

    this.alpha = this.life / this.maxLife;

    if (this.twinkle) {
      this.twinklePhase += this.twinkleSpeed;
      this.alpha *= 0.4 + 0.6 * (Math.sin(this.twinklePhase) * 0.5 + 0.5);
    }

    this.life--;
  }

  draw() {
    if (this.trail) {
      ctx.save();
      for (let i = 0; i < this.trail.length - 1; i++) {
        const p1 = this.trail[i];
        const p2 = this.trail[i + 1];
        const alphaFade = (i / this.trail.length) * 0.8;

        ctx.strokeStyle = `rgba(${hexToRgb(this.color)}, ${
          p1.alpha * alphaFade
        })`;
        ctx.lineWidth = this.size * 0.6;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.save();

    ctx.shadowBlur = this.size * 2.5;
    ctx.shadowColor = this.color;

    ctx.globalAlpha = this.alpha > 0 ? this.alpha : 0;

    const grad = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 1.5
    );
    grad.addColorStop(0, "white");
    grad.addColorStop(0.5, this.color);
    grad.addColorStop(1, `rgba(${hexToRgb(this.color)}, 0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// --- Rocket Class ---
class Rocket {
  constructor(x) {
    this.x = x;
    this.y = canvas.height;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.vx = (Math.random() - 0.5) * 1.5;

    this.vy = -(Math.random() * 3 + 5);

    this.size = 5;
    this.exploded = false;
    this.trail = [];
    this.isSpecial = Math.random() < 0.15;
  }

  update() {
    this.trail.push({ x: this.x, y: this.y, alpha: 1 });
    if (this.trail.length > 30) this.trail.shift();

    this.vx *= 0.99;
    this.vy += gravity * 0.5;
    this.x += this.vx;
    this.y += this.vy;

    if (this.vy >= -1.5 && !this.exploded) {
      this.explode();
      this.exploded = true;
    }
  }

  explode() {
    const pattern = Math.floor(Math.random() * 6);
    let count, speed, angleOffset;
    let radialOffset = 0;

    switch (pattern) {
      case 0:
        count = 55;
        speed = Math.random() * 2.5 + 2.5;
        angleOffset = 0;
        break;
      case 1:
        count = 50;
        speed = Math.random() * 5 + 5;
        angleOffset = Math.PI / 5;
        break;
      case 2:
        count = 80;
        speed = Math.random() * 1.5 + 1.5;
        angleOffset = 0;
        break;
      case 3:
        count = 50;
        speed = Math.random() * 2 + 2;
        angleOffset = 0;
        break;
      case 4:
        count = 60;
        speed = Math.random() * 1 + 1.5;
        angleOffset = 0;
        radialOffset = 15;
        break;
      case 5:
        count = 65;
        speed = Math.random() * 3 + 3;
        angleOffset = 0;
        break;
    }

    for (let i = 0; i < count; i++) {
      let angle, vx, vy;
      let startX = this.x;
      let startY = this.y;

      if (pattern === 3) {
        angle = (Math.PI * 2 * i) / count;
        const t = angle;
        vx = 16 * Math.pow(Math.sin(t), 3);
        vy = -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        );
        const len = Math.sqrt(vx * vx + vy * vy);
        vx = (vx / len) * speed * 0.1;
        vy = (vy / len) * speed * 0.1;
      } else {
        angle = (Math.PI * 2 * i) / count + angleOffset * Math.floor(i / 5);
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        if (pattern === 5) {
          vy += Math.sign(vy) * (Math.random() * 3 + 2);
        }
        if (pattern === 4) {
          startX += Math.cos(angle) * radialOffset;
          startY += Math.sin(angle) * radialOffset;
        }
      }

      const size = Math.random() * 2.5 + 1;
      const life = 120 + Math.random() * 80;
      const color = this.isSpecial
        ? colors[Math.floor(Math.random() * colors.length)]
        : this.color;

      particles.push(new Particle(startX, startY, color, vx, vy, size, life));
    }

    // Secondary explosion
    setTimeout(() => {
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed2 = Math.random() * 2 + 1;
        const vx = Math.cos(angle) * speed2;
        const vy = Math.sin(angle) * speed2;
        const size = Math.random() * 2 + 0.5;
        const life = 70;
        particles.push(
          new Particle(
            this.x + Math.random() * 15 - 7.5,
            this.y + Math.random() * 15 - 7.5,
            colors[Math.floor(Math.random() * colors.length)],
            vx,
            vy,
            size,
            life,
            false
          )
        );
      }
    }, 150);
  }

  draw() {
    if (!this.exploded) {
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.isSpecial ? "#ffffaa" : this.color;

      for (let i = 0; i < this.trail.length - 1; i++) {
        const p1 = this.trail[i];
        const p2 = this.trail[i + 1];

        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, `rgba(${hexToRgb(this.color)}, 0)`);
        grad.addColorStop(1, this.isSpecial ? "#ffffaa" : this.color);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

// --- Main Animation Loop ---
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = rockets.length - 1; i >= 0; i--) {
    const rocket = rockets[i];
    rocket.update();
    rocket.draw();

    if (rocket.exploded) {
      rockets.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    if (p.life <= 0 || p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  if (particles.length > 900) {
    particles.splice(0, particles.length - 900);
  }

  requestAnimationFrame(animate);
}

// --- Launch Logic (Áp dụng giới hạn) ---

function launchRocket(x = Math.random() * canvas.width) {
  // GIỚI HẠN: Nếu đã có 5 quả, không phóng thêm
  if (rockets.length >= MAX_ROCKETS) {
    return;
  }
  rockets.push(new Rocket(x));
}

// Xử lý Click ĐÃ SỬA: CHỈ GỌI launchRocket MỘT LẦN
canvas.addEventListener("click", (e) => {
  // 1. Kiểm tra cờ trễ (300ms)
  if (!isClickReady) {
    return;
  }

  // 2. Đặt cờ trễ và hẹn giờ khôi phục
  isClickReady = false;
  setTimeout(() => {
    isClickReady = true;
  }, CLICK_DELAY_MS);

  // 3. Thực hiện phóng MỘT quả duy nhất tại vị trí click
  const x = e.clientX;
  launchRocket(x);
});

// Phóng tự động (Tần suất 2000ms, áp dụng giới hạn 5 quả)
setInterval(() => {
  launchRocket();
}, 2000);

animate();

// --- Star Field Logic ---
function makeStars(n = 80) {
  const starsDiv = document.getElementById("stars");
  if (!starsDiv) return;
  for (let i = 0; i < n; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    const size = 1 + Math.random() * 3;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.animationDuration = 2 + Math.random() * 3 + "s";
    starsDiv.appendChild(star);
  }
}

function detectMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  const isSmallScreen = window.innerWidth < 500;
  return isMobileUA && isSmallScreen;
}

if (detectMobile()) {
  makeStars(50);
} else {
  makeStars(80);
}
