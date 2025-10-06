// Improved Vanilla JS fireworks effect with realistic graphics

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

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
    this.twinkle = Math.random() > 0.5;
    this.twinkleSpeed = 0.1 + Math.random() * 0.2;
    this.twinklePhase = Math.random() * Math.PI * 2;
  }

  update() {
    if (this.trail) {
      this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
      if (this.trail.length > 10) this.trail.shift();
    }
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.vy += gravity;
    this.vx += wind * (Math.random() - 0.5);
    this.x += this.vx;
    this.y += this.vy;
    this.alpha = this.life / this.maxLife;
    if (this.twinkle) {
      this.twinklePhase += this.twinkleSpeed;
      this.alpha *= 0.5 + 0.5 * Math.sin(this.twinklePhase);
    }
    this.life--;
  }

  draw() {
    if (this.trail) {
      ctx.save();
      for (let i = 0; i < this.trail.length - 1; i++) {
        const p1 = this.trail[i];
        const p2 = this.trail[i + 1];
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(
          0,
          `rgba(${hexToRgb(this.color)}, ${p1.alpha * 0.5})`
        );
        grad.addColorStop(
          1,
          `rgba(${hexToRgb(this.color)}, ${p2.alpha * 0.5})`
        );
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.size * 0.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = this.alpha > 0 ? this.alpha : 0;
    const grad = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size
    );
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, `rgba(${hexToRgb(this.color)}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Rocket {
  constructor(x) {
    this.x = x;
    this.y = canvas.height;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.vx = (Math.random() - 0.5) * 1;
    this.vy = -(Math.random() * 3 + 6);
    this.size = 4;
    this.exploded = false;
    this.trail = [];
  }

  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 20) this.trail.shift();
    this.vx *= 0.99;
    this.vy += gravity * 0.5;
    this.x += this.vx;
    this.y += this.vy;

    if (this.vy >= -1 && !this.exploded) {
      this.explode();
      this.exploded = true;
    }
  }

  explode() {
    const pattern = Math.floor(Math.random() * 4);
    let count, speed, angleOffset;
    switch (pattern) {
      case 0: // Circle
        count = 60;
        speed = Math.random() * 3 + 3;
        angleOffset = 0;
        break;
      case 1: // Star
        count = 40;
        speed = Math.random() * 4 + 4;
        angleOffset = Math.PI / 5;
        break;
      case 2: // Burst
        count = 80;
        speed = Math.random() * 2 + 2;
        angleOffset = 0;
        break;
      case 3: // Heart
        count = 50;
        speed = Math.random() * 3 + 3;
        angleOffset = 0;
        break;
    }

    for (let i = 0; i < count; i++) {
      let angle, vx, vy;
      if (pattern === 3) {
        // Heart
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
      }
      const size = Math.random() * 3 + 1;
      const life = 100 + Math.random() * 50;
      particles.push(
        new Particle(this.x, this.y, this.color, vx, vy, size, life)
      );
    }
    // Secondary explosion
    setTimeout(() => {
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed2 = Math.random() * 2 + 1;
        const vx = Math.cos(angle) * speed2;
        const vy = Math.sin(angle) * speed2;
        const size = Math.random() * 2 + 0.5;
        const life = 60;
        particles.push(
          new Particle(
            this.x + Math.random() * 20 - 10,
            this.y + Math.random() * 20 - 10,
            colors[Math.floor(Math.random() * colors.length)],
            vx,
            vy,
            size,
            life,
            false
          )
        );
      }
    }, 200);

    playSound();
  }

  draw() {
    if (!this.exploded) {
      // Draw rocket trail
      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < this.trail.length - 1; i++) {
        ctx.moveTo(this.trail[i].x, this.trail[i].y);
        ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
      }
      ctx.stroke();
      ctx.restore();

      // Draw rocket
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : null;
}

function playSound() {
  const sounds = [
    "https://www.soundjay.com/misc/sounds/firework-explosion-1.wav",
    "https://www.soundjay.com/misc/sounds/firework-explosion-2.wav",
    "https://www.soundjay.com/misc/sounds/firework-explosion-3.wav",
  ];
  const audio = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
  audio.volume = 0.3;
  audio.play().catch(() => {}); // Ignore errors
}

function launchRocket() {
  const x = Math.random() * canvas.width;
  rockets.push(new Rocket(x));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = rockets.length - 1; i >= 0; i--) {
    const rocket = rockets[i];
    rocket.update();
    rocket.draw();
    if (rocket.exploded && rocket.trail.length === 0) {
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

  // Limit particles for performance
  if (particles.length > 1000) {
    particles.splice(0, particles.length - 1000);
  }

  requestAnimationFrame(animate);
}

canvas.addEventListener("click", () => {
  launchRocket();
});

setInterval(() => {
  launchRocket();
}, 1500);

animate();

// Add stars
function makeStars(n = 80) {
  const starsDiv = document.getElementById("stars");
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
