/* ============================================================
   AI KNOWLEDGE BASE
   Structured facts extracted from the portfolio. Used by both
   the chatbot (as context for LLM or fallback rules) and the
   semantic search (as the corpus).
   ============================================================ */

   window.PORTFOLIO_KB = {
    identity: {
      name: "Tarique Anwar Mulla",
      title: "Software Development Engineer",
      location: "Boulder, Colorado",
      education: "M.S. Electrical Engineering, University of Colorado Boulder",
      years_experience: "4+",
      tagline: "QA Engineer | Software Engineer | AI Enthusiast",
      summary:
        "Software Development Engineer with 4+ years building scalable automation platforms, " +
        "cloud-native testing infrastructure, and CI/CD-driven quality engineering across " +
        "enterprise and distributed systems. Strong in Python and Java; hands-on with " +
        "Playwright, Selenium, REST API testing, and AWS.",
    },
  
    contact: {
      resume: "assets/Tarique_Anwar_Mulla.pdf",
      site: "https://tariquemulla.com/",
    },
  
    // Each "doc" is one searchable chunk for semantic search and one
    // labeled fact bundle for the chatbot.
    docs: [
      {
        id: "exp-trevi",
        type: "experience",
        title: "Software Engineering Intern @ Trevi Systems",
        tags: ["python", "fastapi", "nextjs", "ml", "scikit-learn", "typescript", "pydantic", "pandas", "rest api", "full-stack"],
        date: "Apr 2026 – Present",
        text:
          "Software Engineering Intern at Trevi Systems. Building full-stack internal engineering tools " +
          "supporting membrane R&D for a forward-osmosis / reverse-osmosis hybrid desalination platform. " +
          "Developed a process-prediction API serving a trained multi-output Random Forest model with " +
          "scikit-learn, exposing 11+ operational outputs (permeate flow, TDS, conductivity, energy " +
          "consumption) from membrane-configuration inputs. Built a tolerance-based historical-run matcher " +
          "with categorical strict-match and per-column numeric tolerances, ranked top-K results with " +
          "deterministic distance scoring. Implemented a physics-based RO/FO-PRO calculator using van't " +
          "Hoff osmotic pressure, hydraulic power, and full salt balance with auto-detected bypass modes. " +
          "Stack: Python, FastAPI, Pydantic, scikit-learn, joblib, openpyxl, Next.js, TypeScript.",
      },
      {
        id: "exp-accessium",
        type: "experience",
        title: "Software Development Engineer @ Accessium Group Initiative",
        tags: ["python", "playwright", "aws", "docker", "jenkins", "github actions", "testlink", "boto3", "pom", "ci/cd", "automation"],
        date: "Sept 2025 – Mar 2026",
        text:
          "Software Development Engineer at Accessium Group Initiative (remote). Designed and implemented " +
          "scalable Playwright automation frameworks in Python using the Page Object Model, enabling " +
          "reusable UI and API test automation across Dev, Staging, and UAT. Built CI/CD pipelines with " +
          "GitHub Actions and Jenkins; developed result-parsing and failure-analysis utilities to identify " +
          "flaky tests. Deployed and maintained Dockerized TestLink infrastructure on AWS EC2 with IAM, " +
          "VPC, and SSM for secure centralized test management. Engineered real-time test monitoring and " +
          "alerting using AWS SNS, and managed automation logs and artifacts in AWS S3 via boto3.",
      },
      {
        id: "exp-rockytech",
        type: "experience",
        title: "R&D Software Engineer @ RockyTech",
        tags: ["react native", "ble", "esp32", "notifee", "wordpress", "embedded", "ios", "testflight", "patent"],
        date: "Jan 2025 – May 2025",
        text:
          "Research and Development Software Engineer at RockyTech. Built a BLE-integrated React Native " +
          "app enabling real-time thermal regulation in prosthetics using ESP32, with manual and automated " +
          "modes. Implemented background scanning, dynamic thresholding, Notifee push notifications, and " +
          "OTA safety controls. Redesigned onboarding flow with React Native Paper and connected the app " +
          "to the cloud for real-time monitoring. Deployed iOS builds via TestFlight and contributed to a " +
          "US provisional patent filing.",
      },
      {
        id: "exp-cybage",
        type: "experience",
        title: "QA Engineer @ Cybage Software",
        tags: ["java", "selenium", "postman", "readyapi", "jira", "agile", "jenkins", "api testing", "regression"],
        date: "Nov 2020 – Aug 2023",
        text:
          "QA Engineer at Cybage Software working on the Amadeus hospitality tech account. Delivered " +
          "automation coverage for booking engines and third-party integrations across iHotelier, GDS, and " +
          "Meta Channels. Built Selenium (Java) frameworks and API test suites with Postman, ReadyAPI, and " +
          "SoapUI, achieving 80% regression automation. Led test strategy, mentored a 5-member team, and " +
          "cut production defects by 95% via Jenkins quality gates and Git-integrated automation pipelines.",
      },
  
      {
        id: "proj-gentestpilot",
        type: "project",
        title: "GenTestPilot-Lite — Prompt-to-Test CLI",
        tags: ["python", "openai", "selenium", "maven", "pom", "llm", "test automation"],
        text:
          "GenTestPilot-Lite is a CLI tool that converts natural-language test prompts into executable " +
          "Selenium scripts. Generates POM-based automation code with reusable components, screenshot " +
          "logging, and CI-ready execution. Integrated with Maven and GitHub Actions.",
        link: "https://github.com/tazam777/GenTestPilot",
      },
      {
        id: "proj-restler",
        type: "project",
        title: "RESTler Swagger Auto-Generator",
        tags: ["python", "llama 3", "restler", "swagger", "llm", "api fuzzing", "security"],
        text:
          "LLM-powered tool that converts undocumented API logs into Swagger specifications for fuzz " +
          "testing. Generated validated Swagger definitions for 50+ legacy endpoints and integrated with " +
          "RESTler workflows for automated API fuzz testing and vulnerability detection.",
      },
      {
        id: "proj-voice2face",
        type: "project",
        title: "Voice-to-Face AI Reconstruction",
        tags: ["deep learning", "cnn", "rnn", "python", "multimodal", "computer vision", "audio"],
        text:
          "Deep learning system using a CNN-RNN architecture to generate facial features from voice " +
          "spectrograms with real-time inference. Explores cross-modal representation learning between " +
          "audio and visual domains.",
      },
      {
        id: "proj-sleep",
        type: "project",
        title: "Sleep Quality Prediction System",
        tags: ["machine learning", "react", "python", "rest api", "full-stack"],
        text:
          "End-to-end ML web application predicting sleep quality from user inputs. React frontend with " +
          "a Python REST backend serving a trained model, including input validation and real-time inference.",
      },
      {
        id: "proj-vid2mp3",
        type: "project",
        title: "Video-to-MP3 Microservices Converter",
        tags: ["flask", "jwt", "rabbitmq", "mongodb", "kubernetes", "microservices"],
        text:
          "Microservices-based Flask application with JWT authentication, asynchronous task processing " +
          "via RabbitMQ, MongoDB storage, and Kubernetes deployment. Demonstrates production-grade " +
          "service decomposition.",
      },
      {
        id: "proj-agro",
        type: "project",
        title: "Agro CO₂ Emissions Analysis",
        tags: ["python", "snakemake", "seaborn", "data engineering", "visualization"],
        text:
          "Data engineering pipeline visualizing agriculture-driven CO2 patterns across North America. " +
          "Reproducible workflows with Snakemake and analytical visualizations with Seaborn.",
      },
  
      {
        id: "skills-languages",
        type: "skills",
        title: "Programming Languages",
        tags: ["python", "java", "sql", "typescript", "javascript", "programming languages"],
        text: "Programming Languages: Python, Java, SQL, TypeScript, JavaScript.",
      },
      {
        id: "skills-spoken-languages",
        type: "skills",
        title: "Spoken Languages",
        tags: ["spoken languages", "language", "languages", "english", "hindi", "marathi", "multilingual"],
        text:
          "Spoken languages: English (native), Hindi (native), and Marathi (fluent). " +
          "Tarique is multilingual and can communicate fluently in three languages.",
      },
      {
        id: "skills-automation",
        type: "skills",
        title: "Automation & Testing",
        tags: ["playwright", "selenium", "cypress", "appium", "pytest", "testng", "postman", "readyapi", "jmeter", "locust"],
        text:
          "Automation and Testing: Playwright, Selenium, Cypress, Appium, PyTest, TestNG, Postman, " +
          "ReadyAPI, JMeter, Locust.",
      },
      {
        id: "skills-cloud",
        type: "skills",
        title: "Cloud & DevOps",
        tags: ["aws", "ec2", "s3", "iam", "vpc", "sns", "ssm", "docker", "jenkins", "github actions", "linux", "bash"],
        text:
          "Cloud and DevOps: AWS (EC2, S3, IAM, VPC, SNS, SSM), Docker, Jenkins, GitHub Actions, Linux, Bash.",
      },
      {
        id: "skills-frameworks",
        type: "skills",
        title: "Frameworks & Libraries",
        tags: ["fastapi", "nextjs", "react native", "scikit-learn", "pydantic", "pandas"],
        text: "Frameworks and Libraries: FastAPI, Next.js, React Native, scikit-learn, Pydantic, Pandas.",
      },
      {
        id: "skills-methods",
        type: "skills",
        title: "Methodologies",
        tags: ["pom", "bdd", "tdd", "ci/cd", "agile", "scrum", "rest api testing", "e2e testing"],
        text:
          "Methodologies: Page Object Model, BDD, TDD, CI/CD, Agile/Scrum, REST API Testing, End-to-End Testing.",
      },
      {
        id: "creds-aws",
        type: "credential",
        title: "AWS Cloud Practitioner Certification",
        tags: ["aws", "certification", "cloud"],
        text: "Holds the AWS Cloud Practitioner certification.",
      },
      {
        id: "creds-patent",
        type: "credential",
        title: "US Provisional Patent",
        tags: ["patent", "rockytech", "prosthetics", "ble"],
        text:
          "Contributed to a US provisional patent filing through R&D work at RockyTech on BLE-integrated " +
          "thermal regulation for prosthetics.",
      },
      {
        id: "edu-cu",
        type: "education",
        title: "M.S. Electrical Engineering — CU Boulder",
        tags: ["education", "masters", "cu boulder", "electrical engineering"],
        text:
          "Master's degree in Electrical Engineering from the University of Colorado Boulder.",
      },
    ],
  };
  
  /* ============================================================
     Conversation suggestions shown when the chat first opens.
     ============================================================ */
  window.PORTFOLIO_SUGGESTIONS = [
    "What's Tarique's experience with AWS?",
    "Tell me about his AI / ML projects",
    "Does he know Playwright?",
    "Summarize his most recent role",
    "What's his strongest stack?",
  ];