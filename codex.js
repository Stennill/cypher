/******************************************************
 * CODEX OVERLAY
 * Manages the codex overlay that displays all rune families
 ******************************************************/

let codexInitialized = false;

/**
 * Build a codex grid for a specific family
 * @param {string} familyId - The family ID (F1-F6)
 * @param {string} containerId - The DOM element ID to populate
 */
function buildCodexGrid(familyId, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    const wrap = document.createElement("div");
    wrap.className = "glyph";
    const svg = drawRune(letter, familyId);
    const label = document.createElement("div");
    label.className = "glyph-label";
    label.textContent = ""; // no legend
    wrap.appendChild(svg);
    wrap.appendChild(label);
    container.appendChild(wrap);
  }
}

/**
 * Open the codex overlay and populate all families
 */
function openCodex() {
  if (!codexInitialized) {
    buildCodexGrid("F1", "codexF1");
    buildCodexGrid("F2", "codexF2");
    buildCodexGrid("F3", "codexF3");
    buildCodexGrid("F4", "codexF4");
    buildCodexGrid("F5", "codexF5");
    buildCodexGrid("F6", "codexF6");
    codexInitialized = true;
  }
  const codexOverlayEl = document.getElementById("codexOverlay");
  if (codexOverlayEl) {
    codexOverlayEl.classList.add("visible");
  }
}

/**
 * Close the codex overlay
 */
function closeCodex() {
  const codexOverlayEl = document.getElementById("codexOverlay");
  if (codexOverlayEl) {
    codexOverlayEl.classList.remove("visible");
  }
}

/**
 * Initialize codex event listeners
 */
function initCodex() {
  const codexOverlayEl = document.getElementById("codexOverlay");
  const closeCodexBtn = document.getElementById("closeCodexBtn");

  if (closeCodexBtn) {
    closeCodexBtn.addEventListener("click", closeCodex);
  }

  if (codexOverlayEl) {
    codexOverlayEl.addEventListener("click", (e) => {
      if (e.target === codexOverlayEl) closeCodex();
    });
  }
}

