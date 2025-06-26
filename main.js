// Modular HTML Loader
const includes = [
    { id: "header-section", file: "header.html" },
    { id: "about-section", file: "about.html" },
    { id: "experience-section", file: "experience.html" },
    { id: "projects-section", file: "projects.html" },
    { id: "certifications-section", file: "certifications.html" },
    { id: "patents-section", file: "patents.html" },
    { id: "contact-section", file: "contact.html" }
  ];
  
  // Load each HTML fragment into its placeholder div
  includes.forEach(section => {
    fetch(section.file)
      .then(res => res.text())
      .then(html => {
        document.getElementById(section.id).innerHTML = html;
      });
  });
  
  // Wait for all content to load
  window.addEventListener("load", () => {
    // Remove loader (if you use one)
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
  
    // Re-initialize AOS after dynamic load
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true
    });
  
    // Typed.js animation (header text)
    if (document.querySelector("#typed-output")) {
      new Typed("#typed-output", {
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
  
  // Dark/Light mode toggle
  const toggleBtn = document.getElementById('themeToggle');
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    toggleBtn.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
  });
  