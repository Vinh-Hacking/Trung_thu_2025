let lanterns = [];
let lanternCount = 10;
let isMobileDevice = false;

function detectMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  const isSmallScreen = window.innerWidth < 500;
  console.log("UserAgent:", userAgent);
  console.log("isMobileUA:", isMobileUA);
  console.log("window.innerWidth:", window.innerWidth);
  console.log("isSmallScreen:", isSmallScreen);
  console.log("isMobileDevice:", isMobileUA && isSmallScreen);
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
    lanternCount = 10;
  } else {
    lanternCount = 20;
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
    makeStars(50);
    frameRate(30);
  } else {
    makeStars(80);
    frameRate(30);
  }
  loadMessages();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  isMobileDevice = detectMobile();
  // Do not reset lantern positions on resize to avoid lanterns flying back up when zooming
}

function draw() {
  clear();
  lanterns.sort((a, b) => a.size - b.size); // Draw small lanterns first, large ones on top
  for (let lantern of lanterns) {
    lantern.update();
    lantern.display();
  }
}

function mousePressed() {
  for (let lantern of lanterns) {
    let d = dist(mouseX, mouseY, lantern.x, lantern.y);
    if (d < lantern.size / 2) {
      showMessage(lantern.message);
      break;
    }
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
    this.message =
      messages.length > 0
        ? messages[Math.floor(Math.random() * messages.length)]
        : "Chúc mừng Trung Thu vui vẻ!";
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

    // Simulate drop-shadow like hanging lanterns with flickering glow
    drawingContext.shadowColor = "orange";
    // Flicker effect for shadowBlur between 30 and 50
    let flicker = map(sin(frameCount * 0.1 + this.xOffset), -1, 1, 30, 50);
    drawingContext.shadowBlur = flicker;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 5;

    // Draw the lantern image with consistent tint for sharpness
    tint(255, this.alpha);
    image(
      this.img,
      -this.size / 2,
      -this.size * 0.75,
      this.size,
      this.size * 1.5
    );

    // Reset shadow
    drawingContext.shadowBlur = 0;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;

    // Reset tint for other elements
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
    // Assign messages to lanterns that have default message
    for (let lantern of lanterns) {
      if (lantern.message === "Chúc mừng Trung Thu vui vẻ!") {
        lantern.message = messages[Math.floor(Math.random() * messages.length)];
      }
    }
  } catch (error) {
    console.error("Error loading messages:", error);
    messages = ["Chúc mừng Trung Thu vui vẻ!"];
  }
}

function showMessage(message) {
  document.getElementById("message-text").textContent = message;
  document.getElementById("message-popup").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("close-popup").addEventListener("click", () => {
    document.getElementById("message-popup").style.display = "none";
  });
});
