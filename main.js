const includes = [
  { id: "about-section", file: "about.html" },
  { id: "experience-section", file: "experience.html" },
  { id: "skills-section", file: "skills.html" },
  { id: "projects-section", file: "projects.html" },
  { id: "credentials-section", file: "credentials.html" },
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
          "Software Development Engineer",
          "Test Automation & CI/CD",
          "Cloud Infrastructure on AWS"
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

  // ✅ Scroll spy: highlight the active nav link based on which section is in view
  function initScrollSpy() {
    const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
    if (!navLinks.length) return;

    const sections = Array.from(navLinks)
      .map(link => {
        const id = link.getAttribute("href").slice(1);
        const el = document.getElementById(id);
        return el ? { link, el } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    function updateActive() {
      // Pick the section whose top is closest to (but not below) ~120px from viewport top
      const scrollY = window.scrollY + 140;
      let current = sections[0];
      for (const s of sections) {
        if (s.el.offsetTop <= scrollY) current = s;
      }
      navLinks.forEach(a => a.classList.remove("active"));
      if (current) current.link.classList.add("active");
    }

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
  }

  // Run scroll spy AFTER sections have been loaded into DOM
  const spyObserver = new MutationObserver(() => {
    if (document.querySelector("#about-section > section, #experience-section > section")) {
      initScrollSpy();
      spyObserver.disconnect();
    }
  });
  spyObserver.observe(document.body, { childList: true, subtree: true });
});