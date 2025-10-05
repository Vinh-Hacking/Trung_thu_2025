let lanterns = [];
let lanternCount = 50;
let messages = [];
let lanternImgs = [];

function preload() {
  lanternImgs.push(
    loadImage("../AnhLongDenBay/Lồng_đèn_1-removebg-preview.png")
  );
  lanternImgs.push(
    loadImage("../AnhLongDenBay/Lồng_đèn_2-removebg-preview.png")
  );
  lanternImgs.push(
    loadImage("../AnhLongDenBay/Lồng_đèn_3-removebg-preview.png")
  );
  lanternImgs.push(
    loadImage("../AnhLongDenBay/Lồng_đèn_4-removebg-preview.png")
  );
  lanternImgs.push(
    loadImage("../AnhLongDenBay/Lồng_đèn_5-removebg-preview.png")
  );
  lanternImgs.push(
    loadImage("../AnhLongDenBay/Lồng_đèn_6-removebg-preview.png")
  );
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("lantern-canvas");
  canvas.style("position", "absolute");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("z-index", "10");
  noStroke();
  for (let i = 0; i < lanternCount; i++) {
    lanterns.push(new Lantern());
  }
  makeStars(80);
  loadMessages();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  clear();
  for (let lantern of lanterns) {
    lantern.update();
    lantern.display();
  }
}

class Lantern {
  constructor() {
    this.x = random(width);
    this.y = random(height, height + 200);
    this.size = random(30, 60);
    this.speed = random(0.5, 1.5);
    this.color = color(255, 150, 50, 150);
    this.xOffset = random(1000);
    this.img = random(lanternImgs);
  }

  update() {
    this.y -= this.speed;
    this.x += sin(frameCount * 0.01 + this.xOffset) * 0.5;
    if (this.y < -this.size) {
      this.y = height + this.size;
      this.x = random(width);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    // Depth effect: lanterns higher up are smaller and dimmer
    let depthScale = map(this.y, 0, height, 0.3, 1);
    scale(depthScale);
    let alpha = map(depthScale, 0.3, 1, 50, 150);
    this.color = color(255, 150, 50, alpha);
    // Flickering glow effect (slow dim to bright)
    let flicker = sin(frameCount * 0.02 + this.xOffset) * 0.5 + 0.5; // 0 to 1
    let glow = 5 + flicker * 10;
    for (let r = glow; r > 0; r -= 2) {
      fill(
        red(this.color),
        green(this.color),
        blue(this.color),
        map(r, 0, glow, 0, alpha * 0.5)
      );
      ellipse(0, 0, this.size + r, this.size + r * 1.5);
    }
    // Lantern image
    image(
      this.img,
      -this.size / 2,
      -this.size * 0.75,
      this.size,
      this.size * 1.5
    );
    pop();
  }
}

function makeStars(n = 80) {
  const starsDiv = document.getElementById("stars");
  for (let i = 0; i < n; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 40 + "%";
    const size = 1 + Math.random() * 3;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.animationDuration = 2 + Math.random() * 3 + "s";
    starsDiv.appendChild(star);
  }
}

async function loadMessages() {
  try {
    const response = await fetch("messages.json");
    const data = await response.json();
    messages = data.flatMap((category) => category.messages);
  } catch (error) {
    console.error("Error loading messages:", error);
    messages = ["Chúc mừng Trung Thu vui vẻ!"];
  }
}

function showMessage() {
  if (!messages.length) return;
  const message = messages[Math.floor(Math.random() * messages.length)];
  document.getElementById("message-text").textContent = message;
  document.getElementById("message-popup").style.display = "block";
}

document.getElementById("close-popup").addEventListener("click", () => {
  document.getElementById("message-popup").style.display = "none";
});
