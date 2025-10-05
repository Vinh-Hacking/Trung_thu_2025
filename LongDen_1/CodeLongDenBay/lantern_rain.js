let lanterns = [];
let lanternCount = 10;

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

if (isMobile()) {
  lanternCount = 6;
} else {
  lanternCount = 20;
}
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
  // Reset lantern positions to spread across new canvas size
  for (let lantern of lanterns) {
    lantern.x = random(width);
    lantern.y = random(height, height + 200);
  }
}

function draw() {
  clear();
  lanterns.sort((a, b) => a.size - b.size); // Draw small lanterns first, large ones on top
  for (let lantern of lanterns) {
    lantern.update();
    lantern.display();
  }
}

class Lantern {
  constructor() {
    this.x = random(width);
    this.y = random(height, height + 200);
    this.size = random(40, 60); // Mostly close lanterns
    this.alpha = map(this.size, 40, 60, 80, 150);
    this.speed = random(0.1, 1.0);
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
    this.color = color(255, 200, 100, this.alpha); // More yellow light
    // Use SCREEN blend mode for realistic light accumulation without over-brightening
    blendMode(SCREEN);
    // Flickering glow effect (faster flicker, fading from center)
    let flicker = sin(frameCount * 0.05 + this.xOffset) * 0.5 + 0.5; // 0 to 1
    let glow = 10 + flicker * 20; // Reduced range
    for (let r = glow; r > 0; r -= 1) {
      // Smaller steps for smoother
      fill(
        red(this.color),
        green(this.color),
        blue(this.color),
        map(r, 0, glow, this.alpha * 0.3, 0) // Fade from center, reduced alpha
      );
      ellipse(0, 0, this.size + r, (this.size + r) * 1.2);
    }
    // Reset blend mode
    blendMode(BLEND);
    // Lantern image with alpha for dimming far lanterns
    tint(255, this.alpha);
    image(
      this.img,
      -this.size / 2,
      -this.size * 0.75,
      this.size,
      this.size * 1.5
    );
    tint(255, 255); // Reset tint
    pop();
  }
}

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
