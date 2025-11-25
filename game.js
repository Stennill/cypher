/******************************************************
 * GAME LOGIC & STATE MACHINE
 * Manages screen navigation, level progression, and game state
 ******************************************************/

const STORAGE_KEY = "veilcodeProgress";

// Rune families
const RUNE_FAMILIES = [
  { id: "F1", label: "Monolith" },
  { id: "F2", label: "Veil" },
  { id: "F3", label: "Orbit" },
  { id: "F4", label: "Labyrinth" },
  { id: "F5", label: "Starburst" },
  { id: "F6", label: "Constellation" }
];

// Screen state
let currentScreen = "splash";
let currentLevelId = 1;
let levelStartTime = null;
let levelTimerInterval = null;

// Rune puzzle state
let activePuzzle = null;
let activeSolutionRunes = [];
let currentRuneGuess = [];
let selectedSlotIndex = 0;
let activeFamilyId = "F1"; // Default active family

/******************************************************
 * PROGRESS MANAGEMENT
 ******************************************************/

/**
 * Load progress from LocalStorage
 * @returns {Object} Progress object with solvedIds, lastPlayedLevel, and levels with best times
 */
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { solvedIds: [], lastPlayedLevel: null, levels: {} };
    const data = JSON.parse(raw);
    if (!Array.isArray(data.solvedIds)) return { solvedIds: [], lastPlayedLevel: null, levels: {} };
    return {
      solvedIds: data.solvedIds || [],
      lastPlayedLevel: data.lastPlayedLevel || null,
      levels: data.levels || {}
    };
  } catch {
    return { solvedIds: [], lastPlayedLevel: null, levels: {} };
  }
}

/**
 * Save progress to LocalStorage
 * @param {Object} progress - Progress object with solvedIds, lastPlayedLevel, and levels
 */
function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * Compute star rating based on best time
 * @param {number|null} bestTimeSeconds - Best completion time in seconds
 * @returns {number} Number of stars (0-3)
 */
function computeStars(bestTimeSeconds) {
  if (bestTimeSeconds == null) return 0;
  if (bestTimeSeconds < 15) return 3;
  if (bestTimeSeconds < 30) return 2;
  if (bestTimeSeconds < 60) return 1;
  return 0;
}

/**
 * Get best time for a level
 * @param {number} levelId - Level ID
 * @returns {number|null} Best time in seconds or null
 */
function getBestTime(levelId) {
  const progress = loadProgress();
  const levelData = progress.levels[String(levelId)];
  return levelData ? levelData.bestTimeSeconds : null;
}

/**
 * Save best time for a level
 * @param {number} levelId - Level ID
 * @param {number} timeSeconds - Completion time in seconds
 */
function saveBestTime(levelId, timeSeconds) {
  const progress = loadProgress();
  const levelKey = String(levelId);
  const currentBest = progress.levels[levelKey] ? progress.levels[levelKey].bestTimeSeconds : null;
  
  if (currentBest === null || timeSeconds < currentBest) {
    if (!progress.levels[levelKey]) {
      progress.levels[levelKey] = {};
    }
    progress.levels[levelKey].bestTimeSeconds = timeSeconds;
    saveProgress(progress);
  }
}

/**
 * Mark a level as solved
 * @param {number} id - Level ID
 */
function markSolved(id) {
  const progress = loadProgress();
  if (!progress.solvedIds.includes(id)) {
    progress.solvedIds.push(id);
    progress.lastPlayedLevel = id;
    saveProgress(progress);
  }
}

/**
 * Check if a level is solved
 * @param {number} id - Level ID
 * @returns {boolean}
 */
function isSolved(id) {
  return loadProgress().solvedIds.includes(id);
}

/**
 * Check if a level is unlocked
 * @param {Object} puzzle - Puzzle object
 * @returns {boolean}
 */
function isUnlocked(puzzle) {
  if (puzzle.id === 1) return true;
  return isSolved(puzzle.id - 1);
}

/******************************************************
 * SCREEN STATE MACHINE
 ******************************************************/

/**
 * Show a specific screen
 * @param {string} screenName - Screen name: "splash", "level-select", "level-intro", "game"
 */
function showScreen(screenName) {
  // Hide all screens
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("screen--visible");
  });

  // Show target screen
  const targetScreen = document.getElementById(`${screenName}-screen`);
  if (targetScreen) {
    targetScreen.classList.add("screen--visible");
    currentScreen = screenName;
  }
}

/**
 * Show splash screen
 */
function showSplash() {
  showScreen("splash");
}

/**
 * Show level select screen
 */
function showLevelSelect() {
  showScreen("level-select");
  buildLevelMap();
}

/**
 * Show level intro screen for a specific level
 * @param {number} levelId - Level ID to show intro for
 */
function showLevelIntro(levelId) {
  currentLevelId = levelId;
  showScreen("level-intro");
  renderLevelIntro(levelId);
}

/**
 * Render the level intro screen with stars
 * @param {number} levelId - Level ID to render
 */
function renderLevelIntro(levelId) {
  const levelNumberEl = document.getElementById("levelNumber");
  const starsContainer = document.querySelector(".level-stars");
  
  if (levelNumberEl) {
    levelNumberEl.textContent = levelId;
  }
  
  if (starsContainer) {
    const stars = starsContainer.querySelectorAll(".star");
    
    // Get best time and compute stars
    const bestTime = getBestTime(levelId);
    const starCount = computeStars(bestTime);
    
    // Update star display
    stars.forEach((star, index) => {
      if (index < starCount) {
        star.classList.add("star--filled");
      } else {
        star.classList.remove("star--filled");
      }
    });
  }
}

/**
 * Show game screen for a specific level
 * @param {number} levelId - Level ID to load
 */
function showGame(levelId) {
  showScreen("game");
  loadLevel(levelId);
  startLevelTimer();
}

/**
 * Start the timer for the current level
 */
function startLevelTimer() {
  // Clear any existing timer
  if (levelTimerInterval) {
    clearInterval(levelTimerInterval);
  }
  levelStartTime = Date.now();
}

/**
 * Stop the timer and return elapsed time in seconds
 * @returns {number} Elapsed time in seconds
 */
function stopLevelTimer() {
  if (levelTimerInterval) {
    clearInterval(levelTimerInterval);
    levelTimerInterval = null;
  }
  if (!levelStartTime) return 0;
  const elapsed = (Date.now() - levelStartTime) / 1000;
  levelStartTime = null;
  return elapsed;
}

/******************************************************
 * LEVEL RENDERING
 ******************************************************/

/**
 * Render runes for a word
 * @param {string} word - The word to render
 * @param {string} family - The rune family (F1-F6)
 */
function renderRunesForWord(word, family) {
  const runeWordEl = document.getElementById("runeWord");
  if (!runeWordEl) return;
  
  runeWordEl.innerHTML = "";
  for (const ch of word.toUpperCase()) {
    if (ch === " ") {
      const spacer = document.createElement("span");
      spacer.style.display = "inline-block";
      spacer.style.width = "1.3rem";
      runeWordEl.appendChild(spacer);
      continue;
    }
    const svg = drawRune(ch, family, true);
    runeWordEl.appendChild(svg);
  }
}

/**
 * Build solution rune sequence for a word
 * @param {string} word - The word
 * @param {string} familyPattern - Family pattern (e.g., "F1" or "F1+F3")
 * @returns {Array} Array of { letter, family, runeKey } objects
 */
function buildSolutionRunes(word, familyPattern) {
  const letters = word.toUpperCase().split("");
  const family = familyPattern || "F1"; // Default to F1 if not specified
  
  return letters.map((letter) => {
    // For now, use the same family for all letters
    // Later can support patterns like "F1+F3" for vowels vs consonants
    const runeKey = `${family}_${letter}`;
    return { letter, family, runeKey };
  });
}

/**
 * Render family tabs
 */
function renderFamilyTabs() {
  const tabsEl = document.getElementById("runeFamilyTabs");
  if (!tabsEl) return;
  
  tabsEl.innerHTML = "";
  
  RUNE_FAMILIES.forEach(fam => {
    const btn = document.createElement("button");
    btn.className = "rune-family-tab" + (fam.id === activeFamilyId ? " rune-family-tab--active" : "");
    btn.dataset.family = fam.id;
    btn.textContent = fam.label;
    btn.setAttribute("aria-label", `Select ${fam.label} family`);
    
    btn.addEventListener("click", () => {
      activeFamilyId = fam.id;
      renderFamilyTabs();
      renderRuneKeyboard(); // Rebuild keyboard for new family
    });
    
    tabsEl.appendChild(btn);
  });
}

/**
 * Render rune slots
 * @param {number} count - Number of slots to create
 */
function renderRuneSlots(count) {
  const slotsContainer = document.getElementById("runeSlots");
  if (!slotsContainer) return;
  
  slotsContainer.innerHTML = "";
  slotsContainer.classList.remove("shake");
  
  for (let i = 0; i < count; i++) {
    const slotWrapper = document.createElement("div");
    slotWrapper.className = "rune-slot-wrapper";
    
    const letterLabel = document.createElement("div");
    letterLabel.className = "rune-slot-letter";
    letterLabel.textContent = "";
    
    const slot = document.createElement("button");
    slot.className = "rune-slot";
    slot.dataset.index = i;
    slot.setAttribute("aria-label", `Slot ${i + 1}`);
    
    slot.addEventListener("click", () => {
      selectedSlotIndex = i;
      updateSlotSelection();
    });
    
    slotWrapper.appendChild(letterLabel);
    slotWrapper.appendChild(slot);
    slotsContainer.appendChild(slotWrapper);
  }
  
  selectedSlotIndex = 0;
  updateSlotSelection();
}

/**
 * Update slot selection visual state
 */
function updateSlotSelection() {
  const slots = document.querySelectorAll(".rune-slot");
  slots.forEach((slot, index) => {
    if (selectedSlotIndex !== null && index === selectedSlotIndex) {
      slot.classList.add("rune-slot--active");
    } else {
      slot.classList.remove("rune-slot--active");
    }
  });
}

/**
 * Render full alphabet keyboard for the active family
 */
function renderRuneKeyboard() {
  const keyboardContainer = document.getElementById("runeKeyboard");
  if (!keyboardContainer) return;
  
  keyboardContainer.innerHTML = "";
  
  // Arrange letters in a more keyboard-like layout (QWERTY-inspired)
  // Top row: QWERTYUIOP (10 letters)
  // Middle row: ASDFGHJKL (9 letters)  
  // Bottom row: ZXCVBNM (7 letters)
  const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];
  
  // Flatten to simple A-Z order for now (can switch to QWERTY later if needed)
  // Arrange letters in rows to center the last row
  // 9 columns: 9, 9, 8 letters per row
  const row1 = "ABCDEFGHI".split(""); // 9 letters
  const row2 = "JKLMNOPQR".split(""); // 9 letters  
  const row3 = "STUVWXYZ".split("");   // 8 letters (will be centered)
  const rows = [row1, row2, row3];
  
  rows.forEach((row, rowIndex) => {
    const rowContainer = document.createElement("div");
    rowContainer.style.display = "grid";
    rowContainer.style.gridTemplateColumns = "repeat(9, 1fr)";
    rowContainer.style.gap = "0.4rem";
    rowContainer.style.width = "100%";
    rowContainer.style.justifyItems = "center";
    
    row.forEach((letter, letterIndex) => {
      
      const key = document.createElement("button");
      key.className = "rune-key";
      key.dataset.letter = letter;
      key.dataset.family = activeFamilyId;
      key.dataset.runeKey = `${activeFamilyId}_${letter}`;
      key.setAttribute("aria-label", `Rune ${letter} in ${RUNE_FAMILIES.find(f => f.id === activeFamilyId)?.label || activeFamilyId}`);
      
      const svg = drawRune(letter, activeFamilyId, false);
      key.appendChild(svg);
      
      key.addEventListener("click", () => {
        // If no slot selected, pick first empty slot
        if (selectedSlotIndex == null || selectedSlotIndex < 0) {
          selectedSlotIndex = currentRuneGuess.findIndex(g => !g);
          if (selectedSlotIndex === -1) return; // All slots full
          updateSlotSelection(); // Update visual selection
        }
        
        // Create rune object
        const runeKey = `${activeFamilyId}_${letter}`;
        const rune = { letter, family: activeFamilyId, runeKey };
        
        // Place the rune in the currently selected slot
        currentRuneGuess[selectedSlotIndex] = rune;
        
        // Update UI
        updateRuneSlots();
        
        // Auto-advance to next empty slot
        const nextIndex = currentRuneGuess.findIndex((g, idx) => idx > selectedSlotIndex && !g);
        if (nextIndex !== -1) {
          selectedSlotIndex = nextIndex;
          updateSlotSelection();
        } else {
          // All slots filled, clear selection
          selectedSlotIndex = null;
          updateSlotSelection();
        }
        
        // Enable Reveal if all slots filled
        checkIfReadyToCommit();
      });
      
      rowContainer.appendChild(key);
    });
    
    keyboardContainer.appendChild(rowContainer);
  });
}

/**
 * Place a rune in the current selected slot
 * @param {Object} rune - Rune object { letter, family, runeKey }
 */
function placeRuneInSlot(rune) {
  if (!activePuzzle || currentRuneGuess.length === 0) return;
  
  // Find first empty slot if current is filled, or use selected
  let targetIndex = selectedSlotIndex;
  if (currentRuneGuess[targetIndex] !== null) {
    const emptyIndex = currentRuneGuess.findIndex(r => r === null);
    if (emptyIndex !== -1) {
      targetIndex = emptyIndex;
    } else {
      // All slots filled, move to next
      targetIndex = Math.min(selectedSlotIndex + 1, currentRuneGuess.length - 1);
    }
  }
  
  // Place the rune
  currentRuneGuess[targetIndex] = rune;
  selectedSlotIndex = targetIndex;
  
  // Update UI
  updateRuneSlots();
  updateSlotSelection();
  
  // Auto-advance to next empty slot
  const nextEmpty = currentRuneGuess.findIndex((r, i) => r === null && i > targetIndex);
  if (nextEmpty !== -1) {
    selectedSlotIndex = nextEmpty;
    updateSlotSelection();
  }
  
  // Check if all slots filled
  checkIfReadyToCommit();
}

/**
 * Update rune slots display
 */
function updateRuneSlots() {
  const slotWrappers = document.querySelectorAll(".rune-slot-wrapper");
  slotWrappers.forEach((wrapper, index) => {
    const slot = wrapper.querySelector(".rune-slot");
    const letterLabel = wrapper.querySelector(".rune-slot-letter");
    const rune = currentRuneGuess[index];
    
    if (slot) {
      slot.innerHTML = "";
    }
    
    if (letterLabel) {
      if (rune) {
        letterLabel.textContent = rune.letter;
        letterLabel.style.display = "block";
      } else {
        letterLabel.textContent = "";
        letterLabel.style.display = "none";
      }
    }
    
    if (rune && slot) {
      const svg = drawRune(rune.letter, rune.family, false);
      slot.appendChild(svg);
    }
  });
}

/**
 * Check if all slots are filled and enable commit button
 */
function checkIfReadyToCommit() {
  const commitBtn = document.getElementById("commitRunesBtn");
  if (!commitBtn) return;
  
  const allFilled = currentRuneGuess.every(r => r !== null);
  commitBtn.disabled = !allFilled;
}

/**
 * Clear all rune slots
 */
function clearRuneSlots() {
  if (!activePuzzle) return;
  
  currentRuneGuess = Array(activeSolutionRunes.length).fill(null);
  selectedSlotIndex = 0;
  
  updateRuneSlots();
  updateSlotSelection();
  checkIfReadyToCommit();
  
  const feedbackEl = document.getElementById("runeFeedback");
  if (feedbackEl) {
    feedbackEl.textContent = "";
    feedbackEl.className = "rune-feedback";
  }
  
  const revealedWordEl = document.getElementById("revealedWord");
  if (revealedWordEl) {
    revealedWordEl.textContent = "";
    revealedWordEl.setAttribute("aria-hidden", "true");
  }
}

/**
 * Check if rune guess is correct
 * @returns {boolean}
 */
function isRuneGuessCorrect() {
  if (!activeSolutionRunes || currentRuneGuess.length !== activeSolutionRunes.length) {
    return false;
  }
  
  return activeSolutionRunes.every((solution, i) => {
    const guess = currentRuneGuess[i];
    if (!guess) return false;
    return guess.runeKey === solution.runeKey;
  });
}

/**
 * Commit the rune guess
 */
function commitRuneGuess() {
  if (!activePuzzle) return;
  
  // Check if all slots filled
  if (currentRuneGuess.some(r => r === null)) {
    const feedbackEl = document.getElementById("runeFeedback");
    if (feedbackEl) {
      feedbackEl.textContent = "Complete all slots first.";
      feedbackEl.className = "rune-feedback error";
    }
    return;
  }
  
  if (isRuneGuessCorrect()) {
    // Correct! Stop timer and complete level
    const elapsedSeconds = stopLevelTimer();
    
    // Save best time if this is better
    saveBestTime(activePuzzle.id, elapsedSeconds);
    
    // Mark as solved
    markSolved(activePuzzle.id);
    
    // Calculate stars earned
    const starsEarned = computeStars(elapsedSeconds);
    
    // Reveal the plaintext word
    const revealedWordEl = document.getElementById("revealedWord");
    if (revealedWordEl) {
      revealedWordEl.textContent = activePuzzle.word;
      revealedWordEl.removeAttribute("aria-hidden");
    }
    
    // Show success feedback
    const feedbackEl = document.getElementById("runeFeedback");
    if (feedbackEl) {
      feedbackEl.textContent = "Correct!";
      feedbackEl.className = "rune-feedback success";
    }
    
    // Show success popup with animated stars
    showSuccessPopup(activePuzzle.id, elapsedSeconds, starsEarned);
  } else {
    // Incorrect - show error
    const feedbackEl = document.getElementById("runeFeedback");
    if (feedbackEl) {
      feedbackEl.textContent = "Not quite. Try again.";
      feedbackEl.className = "rune-feedback error";
    }
    
    // Shake the slots
    const slotsContainer = document.getElementById("runeSlots");
    if (slotsContainer) {
      slotsContainer.classList.add("shake");
      setTimeout(() => {
        slotsContainer.classList.remove("shake");
      }, 400);
    }
  }
}

/**
 * Load and display a level
 * @param {number} levelId - Level ID to load
 */
function loadLevel(levelId) {
  const puzzle = PUZZLES.find(p => p.id === levelId);
  if (!puzzle) return;

  if (!isUnlocked(puzzle)) {
    const feedbackEl = document.getElementById("feedback");
    if (feedbackEl) {
      feedbackEl.textContent = "That level is still sealed. Solve the previous one first.";
      feedbackEl.className = "feedback error";
    }
    return;
  }

  currentLevelId = levelId;
  
  // Close any open success popup
  closeSuccessPopup();

  // Set active puzzle
  activePuzzle = puzzle;
  
  // Build solution runes
  activeSolutionRunes = buildSolutionRunes(puzzle.word, puzzle.family);
  
  // Initialize guess array
  currentRuneGuess = Array(activeSolutionRunes.length).fill(null);
  selectedSlotIndex = 0;

  const levelTitleEl = document.getElementById("levelTitle");
  const levelMetaEl = document.getElementById("levelMeta");
  const clueTextEl = document.getElementById("clueText");
  const feedbackEl = document.getElementById("runeFeedback");
  const revealedWordEl = document.getElementById("revealedWord");

  if (levelTitleEl) {
    levelTitleEl.textContent = `Level ${puzzle.id}`;
  }

  const familyName = {
    F1: "Monolith",
    F2: "Veil Glyphs",
    F3: "Orbit",
    F4: "Labyrinth",
    F5: "Starburst",
    F6: "Constellation"
  }[puzzle.family] || puzzle.family;

  if (levelMetaEl) {
    levelMetaEl.textContent = `${puzzle.word.length} letters · ${familyName}`;
  }

  if (clueTextEl) {
    clueTextEl.textContent = puzzle.clue;
  }

  // Render rune slots
  renderRuneSlots(puzzle.word.length);

  // Set default active family to puzzle's family
  activeFamilyId = puzzle.family || "F1";
  
  // Render family tabs and keyboard
  renderFamilyTabs();
  renderRuneKeyboard();

  // Clear feedback and revealed word
  if (feedbackEl) {
    feedbackEl.textContent = "";
    feedbackEl.className = "rune-feedback";
  }

  if (revealedWordEl) {
    revealedWordEl.textContent = "";
    revealedWordEl.setAttribute("aria-hidden", "true");
  }

  // Disable commit button initially
  const commitBtn = document.getElementById("commitRunesBtn");
  if (commitBtn) {
    commitBtn.disabled = true;
  }

  // Update level map highlighting
  updateLevelMapHighlight(levelId);
}

/**
 * Update level map to highlight current level
 * @param {number} levelId - Level ID to highlight
 */
function updateLevelMapHighlight(levelId) {
  const levelListEl = document.getElementById("levelList");
  if (!levelListEl) return;

  [...levelListEl.querySelectorAll(".level-node")].forEach(node => {
    node.classList.toggle("current", Number(node.dataset.id) === levelId);
  });
  
  // Update player dot position with animation
  updatePlayerDot();
  
  // Zoom to current level
  zoomToCurrentLevel();
}

/******************************************************
 * LEVEL MAP BUILDING
 ******************************************************/

/**
 * Zoom to the current level
 */
function zoomToCurrentLevel() {
  const levelListEl = document.getElementById("levelList");
  if (!levelListEl) return;

  const currentNode = levelListEl.querySelector(`.level-node[data-id="${currentLevelId}"]`);
  if (currentNode) {
    currentNode.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/**
 * Build the level map/list - centered vertical stack
 */
function buildLevelMap() {
  const levelListEl = document.getElementById("levelList");
  if (!levelListEl) return;

  levelListEl.innerHTML = "";

  // Create player dot container
  const playerDotContainer = document.createElement("div");
  playerDotContainer.className = "player-dot-container";
  const playerDot = document.createElement("div");
  playerDot.className = "player-dot";
  playerDot.id = "playerDot";
  playerDotContainer.appendChild(playerDot);
  levelListEl.appendChild(playerDotContainer);

  // Build level nodes in normal order (1, 2, 3...)
  // Stacked vertically, centered
  PUZZLES.forEach((puzzle, index) => {
    const node = document.createElement("div");
    node.className = "level-node";
    node.dataset.id = puzzle.id;
    node.dataset.index = index;
    
    if (isSolved(puzzle.id)) {
      node.classList.add("solved");
    }
    if (!isUnlocked(puzzle)) {
      node.classList.add("locked");
    }

    const dotWrap = document.createElement("div");
    dotWrap.className = "dot-wrap";

    const dotRing = document.createElement("div");
    dotRing.className = "dot-ring";

    const dot = document.createElement("div");
    dot.className = "dot";
    dot.textContent = puzzle.id;

    dotWrap.appendChild(dotRing);
    dotWrap.appendChild(dot);

    const info = document.createElement("div");
    info.className = "level-info";

    const label = document.createElement("div");
    label.className = "level-label";
    label.textContent = `Level ${puzzle.id}`;

    const sub = document.createElement("div");
    sub.className = "level-sub";
    sub.textContent = puzzle.tag;

    // Add stars display for level map
    const starsContainer = document.createElement("div");
    starsContainer.className = "level-map-stars";
    const bestTime = getBestTime(puzzle.id);
    const starCount = computeStars(bestTime);
    for (let i = 1; i <= 3; i++) {
      const star = document.createElement("span");
      star.className = "level-map-star";
      if (i <= starCount) {
        star.classList.add("star--filled");
      }
      star.textContent = "★";
      starsContainer.appendChild(star);
    }

    info.appendChild(label);
    info.appendChild(sub);
    info.appendChild(starsContainer);

    node.appendChild(dotWrap);
    node.appendChild(info);

    node.addEventListener("click", () => {
      if (node.classList.contains("locked")) {
        const feedbackEl = document.getElementById("feedback");
        if (feedbackEl) {
          feedbackEl.textContent = "Solve previous levels to unlock this one.";
          feedbackEl.className = "feedback error";
        }
        return;
      }
      showLevelIntro(puzzle.id);
    });

    levelListEl.appendChild(node);
  });

  // Update player dot position and zoom to current level
  requestAnimationFrame(() => {
    updatePlayerDot();
    updateLevelMapHighlight(currentLevelId);
    zoomToCurrentLevel();
  });
}


/**
 * Update player dot position next to current level
 */
function updatePlayerDot() {
  const playerDot = document.getElementById("playerDot");
  const levelListEl = document.getElementById("levelList");
  if (!playerDot || !levelListEl) return;

  const currentNode = levelListEl.querySelector(`.level-node[data-id="${currentLevelId}"]`);
  if (!currentNode) return;

  const nodeRect = currentNode.getBoundingClientRect();
  const containerRect = levelListEl.getBoundingClientRect();
  
  // Position player dot to the left of the current level node
  const relativeTop = nodeRect.top - containerRect.top + (nodeRect.height / 2);
  const relativeLeft = nodeRect.left - containerRect.left - 40; // 40px to the left
  
  playerDot.style.top = `${relativeTop}px`;
  playerDot.style.left = `${relativeLeft}px`;
}

/******************************************************
 * ANSWER SUBMISSION
 ******************************************************/

// Old text-based answer submission removed - now using rune-based system

/**
 * Show success popup with animated stars
 * @param {number} levelId - The solved level ID
 * @param {number} timeSeconds - Completion time in seconds
 * @param {number} starsEarned - Number of stars (0-3)
 */
function showSuccessPopup(levelId, timeSeconds, starsEarned) {
  const popup = document.getElementById("successPopup");
  const timeEl = document.getElementById("successTime");
  const starsContainer = document.getElementById("successStars");
  const nextBtn = document.getElementById("successNextBtn");
  const mapBtn = document.getElementById("successMapBtn");
  
  if (!popup || !timeEl || !starsContainer) return;

  // Format time
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = Math.floor(timeSeconds % 60);
  timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Reset all stars
  const stars = starsContainer.querySelectorAll(".success-star");
  stars.forEach(star => {
    star.classList.remove("star--filled", "star--animate");
  });

  // Show popup
  popup.classList.add("visible");

  // Animate stars one at a time
  stars.forEach((star, index) => {
    setTimeout(() => {
      if (index < starsEarned) {
        star.classList.add("star--filled", "star--animate");
      }
    }, 300 + (index * 200)); // Stagger animation
  });

  // Update next button
  const next = PUZZLES.find(p => p.id === levelId + 1);
  if (next && isUnlocked(next)) {
    nextBtn.style.display = "block";
    nextBtn.onclick = () => {
      closeSuccessPopup();
      showLevelIntro(next.id);
    };
  } else {
    nextBtn.style.display = "none";
  }

  // Map button
  mapBtn.onclick = () => {
    closeSuccessPopup();
    showLevelSelect();
  };

  // Update level map to show new stars
  buildLevelMap();
}

/**
 * Close the success popup
 */
function closeSuccessPopup() {
  const popup = document.getElementById("successPopup");
  if (popup) {
    popup.classList.remove("visible");
  }
}

/******************************************************
 * INITIALIZATION
 ******************************************************/

/**
 * Initialize the game
 */
function initGame() {
  // Initialize codex
  initCodex();

  // Splash screen buttons
  const beginBtn = document.getElementById("beginBtn");
  const continueBtn = document.getElementById("continueBtn");
  const splashCodexBtn = document.getElementById("splashCodexBtn");

  if (beginBtn) {
    beginBtn.addEventListener("click", () => {
      showLevelSelect();
    });
  }

  if (continueBtn) {
    const progress = loadProgress();
    if (progress.solvedIds.length > 0) {
      continueBtn.style.display = "block";
      continueBtn.addEventListener("click", () => {
        // Find first unsolved unlocked level, or go to level select
        const firstUnsolved = PUZZLES.find(p => 
          isUnlocked(p) && !isSolved(p.id)
        );
        if (firstUnsolved) {
          showLevelIntro(firstUnsolved.id);
        } else {
          showLevelSelect();
        }
      });
    } else {
      continueBtn.style.display = "none";
    }
  }

  if (splashCodexBtn) {
    splashCodexBtn.addEventListener("click", () => {
      openCodex();
    });
  }

  // Level select buttons
  const levelSelectBackBtn = document.getElementById("levelSelectBackBtn");
  const levelSelectCodexBtn = document.getElementById("levelSelectCodexBtn");

  if (levelSelectBackBtn) {
    levelSelectBackBtn.addEventListener("click", () => {
      showSplash();
    });
  }

  if (levelSelectCodexBtn) {
    levelSelectCodexBtn.addEventListener("click", () => {
      openCodex();
    });
  }

  // Level intro screen buttons
  const levelIntroPlayBtn = document.getElementById("levelIntroPlayBtn");

  if (levelIntroPlayBtn) {
    levelIntroPlayBtn.addEventListener("click", () => {
      // Dispatch custom event to start level
      const event = new CustomEvent("veilcode:startLevel", {
        detail: { levelId: currentLevelId }
      });
      window.dispatchEvent(event);
      
      // Navigate to game screen
      showGame(currentLevelId);
    });
  }

  // Game screen buttons
  const gameBackBtn = document.getElementById("gameBackBtn");
  const gameCodexBtn = document.getElementById("gameCodexBtn");

  if (gameBackBtn) {
    gameBackBtn.addEventListener("click", () => {
      showLevelSelect();
    });
  }

  if (gameCodexBtn) {
    gameCodexBtn.addEventListener("click", () => {
      openCodex();
    });
  }

  // Rune puzzle buttons
  const commitRunesBtn = document.getElementById("commitRunesBtn");
  const clearRunesBtn = document.getElementById("clearRunesBtn");

  if (commitRunesBtn) {
    commitRunesBtn.addEventListener("click", commitRuneGuess);
  }

  if (clearRunesBtn) {
    clearRunesBtn.addEventListener("click", clearRuneSlots);
  }

  // Show splash screen on load
  showSplash();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGame);
} else {
  initGame();
}

