let lanterns = [];
let lanternCount = 10;
let isMobileDevice = false;

function detectMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  const isSmallScreen = window.innerWidth < 2000;
  return isMobileUA && isSmallScreen;
}

let messages = [];
let lanternImgs = [];

function preload() {
  isMobileDevice = detectMobile();
  let lanternsToLoad = isMobileDevice ? 3 : 6;
  let allLanternPaths = [
    "../AnhLongDenBay/Lồng_đèn_1-removebg-preview.png",
    "../AnhLongDenBay/Lồng_đèn_2-removebg-preview.png",
    "../AnhLongDenBay/Lồng_đèn_3-removebg-preview.png",
    "../AnhLongDenBay/Lồng_đèn_4-removebg-preview.png",
    "../AnhLongDenBay/Lồng_đèn_5-removebg-preview.png",
    "../AnhLongDenBay/Lồng_đèn_6-removebg-preview.png",
  ];
  // Randomly select lanternsToLoad images to preload
  let selectedLanterns = [];
  while (selectedLanterns.length < lanternsToLoad) {
    let idx = floor(random(allLanternPaths.length));
    if (!selectedLanterns.includes(allLanternPaths[idx])) {
      selectedLanterns.push(allLanternPaths[idx]);
    }
  }
  for (let path of selectedLanterns) {
    lanternImgs.push(loadImage(path));
  }
}

function setup() {
  isMobileDevice = detectMobile();
  if (isMobileDevice) {
    lanternCount = 3;
  } else {
    lanternCount = 50;
  }

  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("lantern-canvas");
  canvas.style("position", "absolute");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("z-index", "10");
  noStroke();
  pixelDensity(isMobileDevice ? 1 : 2);
  lanterns = []; // reset lanterns array on setup
  for (let i = 0; i < lanternCount; i++) {
    lanterns.push(new Lantern());
  }
  if (isMobileDevice) {
    makeStars(10);
    frameRate(15);
  } else {
    makeStars(80);
    frameRate(30);
  }
  loadMessages();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  isMobileDevice = detectMobile();
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
    this.size = random(40, 80);
    this.alpha = random(150, 255);
    this.speed = random(0.2, 1.2);
    this.xOffset = random(1000);
    this.img = random(lanternImgs);
    this.glowColor = color(255, 180, 100);
  }

  update() {
    this.y -= this.speed;
    this.x += sin(frameCount * 0.01 + this.xOffset) * 0.5;
    if (this.y < -this.size * 2) {
      this.y = height + this.size * 2;
      this.x = random(width);
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    if (!isMobileDevice) {
      // More performant glow using shadow
      let flicker = sin(frameCount * 0.05 + this.xOffset) * 0.5 + 0.5; // 0 to 1
      let glowSize = 60 + flicker * 40; // Keep smaller glow size as before

      // Set glow color to match CSS orange (255, 165, 0)
      let glowColorIntense = color(255, 230, 0, 255);
      drawingContext.shadowColor = glowColorIntense;
      drawingContext.shadowBlur = glowSize; // Use glowSize for flickering effect

      // Remove additional glow layer to reduce lag and keep smaller glow area
      // drawingContext.globalCompositeOperation = "screen";
      // fill(glowColorIntense);
      // noStroke();
      // ellipse(0, 0, this.size * 2.5, this.size * 3.5); // Draw a larger glow ellipse
      // drawingContext.globalCompositeOperation = "source-over"; // Reset blend mode
    }

    // Draw the lantern image
    if (!isMobileDevice) {
      tint(255, this.alpha);
    }
    image(
      this.img,
      -this.size / 2,
      -this.size * 0.75,
      this.size,
      this.size * 1.5
    );

    // Reset shadow and tint for other elements
    drawingContext.shadowBlur = 0;
    noTint();

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
