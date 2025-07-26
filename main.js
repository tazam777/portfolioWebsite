const includes = [
  { id: "header-section", file: "header.html" },
  { id: "about-section", file: "about.html" },
  { id: "experience-section", file: "experience.html" },
  { id: "projects-section", file: "projects.html" },
  { id: "certifications-section", file: "certifications.html" },
  { id: "patents-section", file: "patents.html" },
  { id: "contact-section", file: "contact.html" }
];

// ✅ Generate moving clouds
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

// ✅ Load HTML sections
function loadSections() {
  return Promise.all(
    includes.map(({ id, file }) =>
      fetch(file)
        .then(res => {
          if (!res.ok) throw new Error(`❌ Failed to load ${file}`);
          return res.text();
        })
        .then(html => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = html;
          else console.warn(`⚠️ Missing container: #${id}`);
        })
        .catch(console.error)
    )
  );
}

function loadSwiperThenCarousel() {
  if (typeof Swiper !== "undefined") {
    loadCarousel();
    return;
  }

  const swiperScript = document.createElement("script");
  swiperScript.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
  swiperScript.onload = loadCarousel;
  document.body.appendChild(swiperScript);
}

function loadCarousel() {
  const script = document.createElement("script");
  script.src = "carousel.js";
  script.onload = () => {
    if (typeof initializeSwiper === "function") {
      initializeSwiper();
    } else {
      console.warn("⚠️ initializeSwiper() not found in carousel.js");
    }
  };
  document.body.appendChild(script);
}




// ✅ Show main content
function revealMainContent() {
  document.getElementById("hero").classList.add("hidden");
  document.getElementById("main-content").classList.remove("hidden");
  document.body.classList.add("main-visible");
  window.scrollTo({ top: 0, behavior: "instant" });

  loadSections().then(() => {
    if (window.AOS) {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: false,
        mirror: true,
      });
    }

    const typedTarget = document.querySelector("#typed-output");
    if (typedTarget && window.Typed) {
      new Typed(typedTarget, {
        strings: [
          "Software Engineer",
          "SDET",
          "React Native Developer",
          "BLE + Embedded Systems Enthusiast",
          "AI Enthusiast"
        ],
        typeSpeed: 60,
        backSpeed: 30,
        loop: true
      });
    
    }
    loadSwiperThenCarousel();
  });
}

// ✅ DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("themeToggle");

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

      const catImg = document.getElementById("cat-mode-img");
      if (catImg) {
        catImg.src = isLight ? "assets/black-cat.png" : "assets/white-cat.png";
      }
    });
  }

  // Initial state
  document.getElementById("main-content").classList.add("hidden");

  let contentLoaded = false;
  let scrollDetected = false;
  let revealStarted = false;

  function tryRevealContent() {
    if (contentLoaded && scrollDetected && !revealStarted) {
      revealStarted = true;
      revealMainContent();
    }
  }

  // Load includes
  loadSections().then(() => {
    contentLoaded = true;
    tryRevealContent();

    // ✅ Update cat image AFTER contact section is loaded
    const catImg = document.getElementById("cat-mode-img");
    if (catImg) {
      const isLight = document.body.classList.contains("light-mode");
      catImg.src = isLight ? "assets/black-cat.png" : "assets/white-cat.png";
    }
  });

  // Scroll to trigger
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      scrollDetected = true;
      tryRevealContent();
    }
  });

  // Manual trigger
  const learnMoreBtn = document.querySelector(".learn-more");
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!revealStarted) {
        revealStarted = true;
        revealMainContent();
      }
    });
  }


  

  // ✅ Hamburger nav toggle
  document.addEventListener("click", function (e) {
    const toggle = document.getElementById("menuToggle");
    const nav = document.querySelector(".nav-links");
    if (toggle && nav && e.target === toggle) {
      nav.classList.toggle("active");
    }
  });
});
