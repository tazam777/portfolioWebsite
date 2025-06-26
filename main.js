const includes = [
  { id: "navbar-section", file: "navbar.html" },
  { id: "header-section", file: "header.html" },
  { id: "about-section", file: "about.html" },
  { id: "experience-section", file: "experience.html" },
  { id: "projects-section", file: "projects.html" },
  { id: "certifications-section", file: "certifications.html" },
  { id: "patents-section", file: "patents.html" },
  { id: "contact-section", file: "contact.html" }
];

// Load HTML fragments
Promise.all(
  includes.map(({ id, file }) =>
    fetch(file)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${file}`);
        return res.text();
      })
      .then((html) => {
        const target = document.getElementById(id);
        if (target) {
          target.innerHTML = html;
        } else {
          console.warn(`⚠️ Element with ID #${id} not found in index.html`);
        }
      })
      .catch((err) => console.error(err))
  )
).then(() => {
  // AOS
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true
  });

  // Typed.js
  const typedTarget = document.querySelector("#typed-output");
  if (typedTarget) {
    new Typed(typedTarget, {
      strings: [
        "Software Engineer",
        "SDET",
        "React Native Developer",
        "BLE + Embedded Systems Enthusiast",
        "AI + Automation Fan"
      ],
      typeSpeed: 60,
      backSpeed: 30,
      loop: true
    });
  }
});

// Theme toggle + cloud animation
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("themeToggle");

  function generateClouds(num = 6) {
    const sky = document.getElementById("sky-container");
    if (!sky) return;

    sky.replaceChildren();

    for (let i = 0; i < num; i++) {
      const cloud = document.createElement("img");
      const size = Math.floor(Math.random() * 300 + 200); // 200–500px
      const x = Math.random() * 100;
      const delay = Math.random() * 20;
      const duration = 60 + Math.random() * 40;

      cloud.src = "assets/sky.png";
      cloud.className = "cloud";
      cloud.style.width = `${size}px`;
      cloud.style.left = `${x}vw`;
      cloud.style.animationDuration = `${duration}s`;
      cloud.style.animationDelay = `-${delay}s`;
      cloud.onerror = () => cloud.remove();

      sky.appendChild(cloud);
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("light-mode");
      toggleBtn.textContent = isLight ? "☀️" : "🌙";

      const bgClouds = document.querySelector(".clouds");
      if (bgClouds) bgClouds.style.display = isLight ? "none" : "block";

      const sky = document.getElementById("sky-container");
      if (sky) {
        if (isLight) {
          sky.classList.remove("sky-hidden");
          generateClouds();
        } else {
          sky.classList.add("sky-hidden");
          sky.replaceChildren();
        }
      }
    });
  }
});
