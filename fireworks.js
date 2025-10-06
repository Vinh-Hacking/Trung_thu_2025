// Vanilla JS fireworks effect shooting from bottom to top using canvas

const canvas = document.createElement("canvas");
canvas.id = "fireworks";
document.body.insertBefore(canvas, document.body.firstChild);
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
