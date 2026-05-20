/* ============================================================
   AI ASSISTANT MODULE
   - Floating orb launcher
   - Chatbot ("Tarique-Bot") with three answer modes:
       (a) "local"     — heuristic answers from PORTFOLIO_KB (zero setup)
       (b) "openai"    — call your own backend proxy
       (c) "anthropic" — call your own backend proxy
   - Smart semantic-ish search (TF-IDF over PORTFOLIO_KB.docs)
   Configure via window.AI_CONFIG below.
   ============================================================ */

   (function () {
    "use strict";
  
    /* ------------------------------------------------------------
       CONFIG — edit this object to switch backends.
       Default "local" mode works offline with zero setup.
       ------------------------------------------------------------ */
    const DEFAULT_CONFIG = {
      mode: "local",          // "local" | "openai" | "anthropic"
      apiUrl: "",             // your backend proxy URL when not "local"
      botName: "Tarique-Bot",
      greeting:
        "Hey! I'm Tarique-Bot — ask me anything about Tarique's background, skills, " +
        "or projects. Try one of the suggestions below 👇",
    };
    const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.AI_CONFIG || {});
  
    /* ============================================================
       UTILITIES — text processing for search + local answers
       ============================================================ */
    const STOPWORDS = new Set([
      "the","a","an","and","or","but","of","to","in","on","at","for","with",
      "is","are","was","were","be","been","being","do","does","did","have",
      "has","had","this","that","these","those","i","you","he","she","it",
      "we","they","my","your","his","her","its","our","their","what","when",
      "where","who","why","how","tell","me","about","please","know","like",
      "can","does","is","there","any","some","get","give","much","many"
    ]);
  
    function tokenize(text) {
      return (text || "")
        .toLowerCase()
        .replace(/[^a-z0-9+#./\s-]/g, " ")
        .split(/\s+/)
        .filter(t => t && !STOPWORDS.has(t) && t.length > 1);
    }
  
    /* ============================================================
       SEARCH ENGINE — TF-IDF + tag boost
       ============================================================ */
    let searchIndex = null;
    function buildSearchIndex() {
      const docs = window.PORTFOLIO_KB.docs;
      const df = {};
      const tokenized = docs.map(d => {
        const tokens = tokenize(`${d.title} ${d.text} ${(d.tags || []).join(" ")}`);
        const tf = {};
        tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
        Object.keys(tf).forEach(t => { df[t] = (df[t] || 0) + 1; });
        return { doc: d, tf, len: tokens.length };
      });
      const N = docs.length;
      searchIndex = { tokenized, df, N };
    }
  
    function searchDocs(query, limit = 6) {
      if (!searchIndex) buildSearchIndex();
      const qTokens = tokenize(query);
      if (!qTokens.length) return [];
      const { tokenized, df, N } = searchIndex;
      const scores = tokenized.map(({ doc, tf, len }) => {
        let score = 0;
        qTokens.forEach(t => {
          if (tf[t]) {
            const idf = Math.log(1 + N / df[t]);
            score += (tf[t] / Math.max(len, 1)) * idf;
          }
          // Tag exact-match boost
          if ((doc.tags || []).some(tag => tag === t || tag.includes(t))) {
            score += 0.4;
          }
          // Title boost
          if (doc.title.toLowerCase().includes(t)) score += 0.25;
        });
        return { doc, score };
      });
      return scores
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    }
  
    function highlight(text, query) {
      const tokens = tokenize(query);
      if (!tokens.length) return text;
      const re = new RegExp(`\\b(${tokens.map(escapeRegex).join("|")})`, "gi");
      return text.replace(re, "<mark>$1</mark>");
    }
    function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  
    /* ============================================================
       LOCAL ANSWER ENGINE — composes a useful reply with no API
       ============================================================ */
    function localAnswer(query) {
      const q = query.toLowerCase().trim();
      const kb = window.PORTFOLIO_KB;
  
      // Conversational handlers
      if (/^(hi|hello|hey|yo|sup|hola)\b/i.test(q)) {
        return `Hi! 👋 I can answer questions about ${kb.identity.name}'s skills, ` +
               `experience, and projects. What would you like to know?`;
      }
      if (/(who are you|what are you|your name)/.test(q)) {
        return `I'm ${CONFIG.botName} — a little AI assistant trained on ${kb.identity.name}'s portfolio. ` +
               `Ask me about his roles, tech stack, or projects.`;
      }
      if (/(contact|email|reach|hire|available)/.test(q)) {
        return `You can reach Tarique through the Contact section on this site. ` +
               `He's based in ${kb.identity.location} and open to opportunities. ` +
               `<a href="${kb.contact.resume}" download>Download his resume</a>.`;
      }
      if (/(resume|cv|download)/.test(q)) {
        return `You can <a href="${kb.contact.resume}" download>download his resume here</a>.`;
      }
      if (/(location|where.*(live|based|from))/.test(q)) {
        return `Tarique is based in ${kb.identity.location}.`;
      }
      if (/(education|degree|study|university|college|school)/.test(q)) {
        return `He holds a ${kb.identity.education}.`;
      }
      if (/(years? .*(experience|exp)|how long|how much experience)/.test(q)) {
        return `${kb.identity.years_experience} years of professional experience as a Software Development Engineer.`;
      }
      if (/(recent|current|now|latest).*(role|job|work|position)/.test(q) ||
          /(what.*doing now|where.*work)/.test(q)) {
        const trevi = kb.docs.find(d => d.id === "exp-trevi");
        return `<strong>${trevi.title}</strong> (${trevi.date}). ${trevi.text}`;
      }
      if (/(stack|strongest|main|primary).*(stack|tech|language)/.test(q) ||
          /(best at|specialize)/.test(q)) {
        return "Tarique's strongest stack: <strong>Python</strong> and <strong>Java</strong> " +
               "for backend and automation, <strong>Playwright</strong> and <strong>Selenium</strong> " +
               "for testing, <strong>FastAPI</strong> + <strong>Next.js</strong> for full-stack work, " +
               "and <strong>AWS</strong> (EC2, S3, IAM, VPC, SNS) for cloud infra.";
      }
  
      // Topic search — find relevant docs and synthesize
      const hits = searchDocs(query, 3);
      if (!hits.length) {
        return "I couldn't find a direct match for that in his portfolio. Try asking about " +
               "his experience, AWS work, Playwright, ML projects, or specific companies " +
               "like Trevi Systems or Accessium.";
      }
  
      const top = hits[0].doc;
      // Multi-hit synthesis
      if (hits.length > 1 && hits[1].score > hits[0].score * 0.55) {
        const items = hits.slice(0, 3).map(h =>
          `<strong>${h.doc.title}</strong> — ${shorten(h.doc.text, 180)}`
        ).join("<br><br>");
        return `Here's what I found:<br><br>${items}`;
      }
      // Single best match
      return `<strong>${top.title}</strong><br><br>${top.text}` +
             (top.link ? `<br><br><a href="${top.link}" target="_blank" rel="noopener">View on GitHub →</a>` : "");
    }
  
    function shorten(text, n) {
      if (text.length <= n) return text;
      return text.slice(0, n).replace(/\s+\S*$/, "") + "…";
    }
  
    /* ============================================================
       LLM BACKEND — calls user-configured proxy
       Backend must accept { messages: [...], context: "..." } and
       return { reply: "..." }.
       ============================================================ */
    async function llmAnswer(query, history) {
      if (!CONFIG.apiUrl) {
        // Fall back gracefully
        return localAnswer(query);
      }
      const contextDocs = searchDocs(query, 5).map(h => h.doc);
      const context = contextDocs.map(d => `[${d.title}] ${d.text}`).join("\n\n");
  
      try {
        const res = await fetch(CONFIG.apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: CONFIG.mode,
            messages: history.concat([{ role: "user", content: query }]),
            context,
            system:
              `You are ${CONFIG.botName}, a concise assistant that answers questions about ` +
              `${window.PORTFOLIO_KB.identity.name}'s portfolio. Use ONLY the provided context. ` +
              `If the answer isn't in context, say so politely. Keep answers under 120 words.`,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.reply || localAnswer(query);
      } catch (err) {
        console.warn("AI backend error, falling back to local:", err);
        return localAnswer(query);
      }
    }
  
    /* ============================================================
       CHATBOT UI
       ============================================================ */
    const history = [];
    let chatBuilt = false;
    let chatPanel, chatBody, chatInput, chatSend, orbBtn;
  
    function buildChat() {
      if (chatBuilt) return;
      chatBuilt = true;
  
      // Orb
      orbBtn = document.createElement("button");
      orbBtn.className = "ai-orb";
      orbBtn.setAttribute("aria-label", "Open AI assistant");
      const orbLabel = document.createElement("span");
      orbLabel.className = "ai-orb-label";
      orbLabel.textContent = "Ask me anything ✨";
      orbBtn.appendChild(orbLabel);
      document.body.appendChild(orbBtn);
  
      // Panel
      chatPanel = document.createElement("div");
      chatPanel.className = "ai-chat";
      chatPanel.innerHTML = `
        <div class="ai-chat-header">
          <div class="ai-chat-avatar">✨</div>
          <div class="ai-chat-title">
            <h3>${CONFIG.botName}</h3>
            <div class="ai-status">Online · ${CONFIG.mode === "local" ? "Local mode" : "AI-powered"}</div>
          </div>
          <button class="ai-chat-close" aria-label="Close">×</button>
        </div>
        <div class="ai-chat-body"></div>
        <div class="ai-chat-input">
          <input type="text" placeholder="Ask anything about Tarique..." aria-label="Chat input" />
          <button aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      `;
      document.body.appendChild(chatPanel);
  
      chatBody = chatPanel.querySelector(".ai-chat-body");
      chatInput = chatPanel.querySelector("input");
      chatSend = chatPanel.querySelector(".ai-chat-input button");
  
      // Greeting + suggestions
      addBotMessage(CONFIG.greeting);
      addSuggestions();
  
      // Events
      orbBtn.addEventListener("click", toggleChat);
      chatPanel.querySelector(".ai-chat-close").addEventListener("click", closeChat);
      chatSend.addEventListener("click", sendMessage);
      chatInput.addEventListener("keydown", e => {
        if (e.key === "Enter") sendMessage();
      });
    }
  
    function toggleChat() {
      chatPanel.classList.toggle("open");
      orbBtn.classList.toggle("active");
      if (chatPanel.classList.contains("open")) {
        setTimeout(() => chatInput.focus(), 300);
      }
    }
    function closeChat() {
      chatPanel.classList.remove("open");
      orbBtn.classList.remove("active");
    }
  
    function addBotMessage(html) {
      const div = document.createElement("div");
      div.className = "ai-msg bot";
      div.innerHTML = html;
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
    function addUserMessage(text) {
      const div = document.createElement("div");
      div.className = "ai-msg user";
      div.textContent = text;
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
    function addTyping() {
      const div = document.createElement("div");
      div.className = "ai-typing";
      div.innerHTML = "<span></span><span></span><span></span>";
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
      return div;
    }
  
    function addSuggestions() {
      const wrap = document.createElement("div");
      wrap.className = "ai-suggestions";
      (window.PORTFOLIO_SUGGESTIONS || []).forEach(s => {
        const chip = document.createElement("button");
        chip.className = "ai-suggestion-chip";
        chip.textContent = s;
        chip.addEventListener("click", () => {
          chatInput.value = s;
          sendMessage();
        });
        wrap.appendChild(chip);
      });
      chatBody.appendChild(wrap);
    }
  
    async function sendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;
      chatInput.value = "";
      chatSend.disabled = true;
      addUserMessage(text);
      history.push({ role: "user", content: text });
  
      const typing = addTyping();
      // Small delay so the typing indicator reads naturally
      await new Promise(r => setTimeout(r, 350 + Math.random() * 250));
  
      let reply;
      if (CONFIG.mode === "local" || !CONFIG.apiUrl) {
        reply = localAnswer(text);
      } else {
        reply = await llmAnswer(text, history);
      }
  
      typing.remove();
      addBotMessage(reply);
      history.push({ role: "assistant", content: reply });
      chatSend.disabled = false;
      chatInput.focus();
    }
  
    /* ============================================================
       SMART SEARCH UI
       ============================================================ */
    let searchBuilt = false;
    let searchTrigger, searchOverlay, searchInput, searchResults;
    let activeResultIndex = -1;
    let currentResults = [];
  
    function buildSearch() {
      if (searchBuilt) return;
      searchBuilt = true;
  
      searchTrigger = document.createElement("button");
      searchTrigger.className = "ai-search-trigger hero-mode";
      searchTrigger.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span class="ai-search-trigger-label">Search portfolio</span>
        <kbd>⌘K</kbd>
      `;
      document.body.appendChild(searchTrigger);
  
      searchOverlay = document.createElement("div");
      searchOverlay.className = "ai-search-overlay";
      searchOverlay.innerHTML = `
        <div class="ai-search-panel" role="dialog" aria-label="Smart search">
          <div class="ai-search-input-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search experience, projects, skills..." aria-label="Search" />
            <button class="ai-search-esc">Esc</button>
          </div>
          <div class="ai-search-results"></div>
          <div class="ai-search-footer">
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate · <kbd>↵</kbd> open</span>
            <span>Powered by smart search</span>
          </div>
        </div>
      `;
      document.body.appendChild(searchOverlay);
  
      searchInput = searchOverlay.querySelector("input");
      searchResults = searchOverlay.querySelector(".ai-search-results");
  
      searchTrigger.addEventListener("click", openSearch);
      searchOverlay.querySelector(".ai-search-esc").addEventListener("click", closeSearch);
      searchOverlay.addEventListener("click", e => {
        if (e.target === searchOverlay) closeSearch();
      });
      searchInput.addEventListener("input", () => renderResults(searchInput.value));
      searchInput.addEventListener("keydown", handleSearchKeys);
  
      // Global ⌘K / Ctrl+K
      document.addEventListener("keydown", e => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          searchOverlay.classList.contains("open") ? closeSearch() : openSearch();
        }
        if (e.key === "Escape" && searchOverlay.classList.contains("open")) {
          closeSearch();
        }
      });
    }
  
    function openSearch() {
      searchOverlay.classList.add("open");
      setTimeout(() => searchInput.focus(), 50);
      renderResults("");
    }
    function closeSearch() {
      searchOverlay.classList.remove("open");
      searchInput.value = "";
      activeResultIndex = -1;
    }
  
    function renderResults(query) {
      if (!query.trim()) {
        currentResults = window.PORTFOLIO_KB.docs.slice(0, 6).map(d => ({ doc: d, score: 1 }));
      } else {
        currentResults = searchDocs(query, 8);
      }
      activeResultIndex = -1;
  
      if (!currentResults.length) {
        searchResults.innerHTML = `<div class="ai-search-empty">No matches. Try "AWS", "Playwright", or "Trevi".</div>`;
        return;
      }
  
      searchResults.innerHTML = currentResults.map((r, i) => {
        const d = r.doc;
        const title = query ? highlight(d.title, query) : d.title;
        const snippet = query ? highlight(shorten(d.text, 160), query) : shorten(d.text, 160);
        const href = sectionAnchorFor(d.type) + (d.link ? "" : "");
        return `
          <a class="ai-search-result" data-idx="${i}" data-href="${href}" data-link="${d.link || ""}">
            <span class="ai-search-result-type">${d.type}</span>
            <div class="ai-search-result-title">${title}</div>
            <div class="ai-search-result-snippet">${snippet}</div>
          </a>
        `;
      }).join("");
  
      searchResults.querySelectorAll(".ai-search-result").forEach(el => {
        el.addEventListener("click", () => navigateToResult(parseInt(el.dataset.idx, 10)));
        el.addEventListener("mouseenter", () => setActive(parseInt(el.dataset.idx, 10)));
      });
    }
  
    function sectionAnchorFor(type) {
      switch (type) {
        case "experience": return "#experience-section";
        case "project":    return "#projects-section";
        case "skills":     return "#skills-section";
        case "credential": return "#credentials-section";
        case "education":  return "#about-section";
        default:           return "#about-section";
      }
    }
  
    function handleSearchKeys(e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(Math.min(activeResultIndex + 1, currentResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(Math.max(activeResultIndex - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeResultIndex >= 0) navigateToResult(activeResultIndex);
        else if (currentResults.length) navigateToResult(0);
      }
    }
  
    function setActive(i) {
      activeResultIndex = i;
      searchResults.querySelectorAll(".ai-search-result").forEach((el, idx) => {
        el.classList.toggle("active", idx === i);
        if (idx === i) el.scrollIntoView({ block: "nearest" });
      });
    }
  
    function navigateToResult(i) {
      const r = currentResults[i];
      if (!r) return;
      const el = searchResults.querySelector(`[data-idx="${i}"]`);
      const externalLink = el && el.dataset.link;
      closeSearch();
      if (externalLink) {
        window.open(externalLink, "_blank", "noopener");
        return;
      }
      const anchor = sectionAnchorFor(r.doc.type);
      const target = document.querySelector(anchor);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Pulse highlight
        target.style.transition = "box-shadow 0.6s ease";
        target.style.boxShadow = "0 0 0 2px rgba(56, 189, 248, 0.6), 0 20px 60px -15px rgba(0,0,0,0.6)";
        setTimeout(() => { target.style.boxShadow = ""; }, 1400);
      }
    }
  
    /* ============================================================
       HERO-MODE TOGGLE — hide search trigger while hero is showing
       ============================================================ */
    function updateHeroMode() {
      if (!searchTrigger) return;
      const mainVisible = document.body.classList.contains("main-visible");
      searchTrigger.classList.toggle("hero-mode", !mainVisible);
    }
  
    /* ============================================================
       INIT
       ============================================================ */
    function init() {
      if (!window.PORTFOLIO_KB) {
        console.error("PORTFOLIO_KB not loaded — load ai-knowledge.js first.");
        return;
      }
      console.log(`%c✨ Tarique-Bot ready in "${CONFIG.mode}" mode`,
                  "color: #38bdf8; font-weight: 600;");
      buildSearchIndex();
      buildChat();
      buildSearch();
      updateHeroMode();
      // Watch for main content reveal
      const observer = new MutationObserver(updateHeroMode);
      observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    }
  
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();