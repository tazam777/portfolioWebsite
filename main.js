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
  
  // Load all fragments first
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

        .catch((err) => {
          console.error(err);
        })
    )
  ).then(() => {
    // Init AOS after all content is injected
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true
    });
  
    // Initialize Typed.js only if target exists
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
  
  // Theme toggle
  document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const isLight = document.body.classList.toggle("light-mode");
        toggleBtn.textContent = isLight ? "☀️" : "🌙";
      });
    }
  });
  
