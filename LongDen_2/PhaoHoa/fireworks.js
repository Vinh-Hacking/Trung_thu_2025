// Vanilla JS fireworks effect shooting from bottom to top using canvas

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const gravity = 0.05;
const particles = [];
const rockets = [];
const colors = ["#ff0043", "#14fc56", "#1e90ff", "#ffae00", "#ff00ff"];

class Particle {
  constructor(x, y, color, vx, vy, size, life) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.life = life;
    this.alpha = 1;
  }

  update() {
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.015;
    this.life--;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha > 0 ? this.alpha : 0;
    ctx.fillStyle = this.color;
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
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = -(Math.random() * 4 + 4);
    this.size = 3;
    this.exploded = false;
  }

  update() {
    this.vx *= 0.98;
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    if (this.vy >= 0 && !this.exploded) {
      this.explode();
      this.exploded = true;
    }
  }

  explode() {
    const count = 50;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 4 + 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = Math.random() * 2 + 1;
      const life = 80;
      particles.push(
        new Particle(this.x, this.y, this.color, vx, vy, size, life)
      );
    }
    playSound();
  }

  draw() {
    if (!this.exploded) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function playSound() {
  const audio = new Audio(
    "https://www.soundjay.com/misc/sounds/firework-explosion-1.wav"
  );
  audio.play();
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

  requestAnimationFrame(animate);
}

canvas.addEventListener("click", () => {
  launchRocket();
});

setInterval(() => {
  launchRocket();
}, 2000);

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
