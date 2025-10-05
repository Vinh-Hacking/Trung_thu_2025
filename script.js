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

makeStars();
