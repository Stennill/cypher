/******************************************************
 * PUZZLES DATA
 * All level definitions with words, families, clues, and tags
 ******************************************************/

const PUZZLES = [
  {
    id: 1,
    word: "OPEN",
    family: "F1",
    clue: "The first barrier you defeat.",
    tag: "Threshold"
  },
  {
    id: 2,
    word: "LOOK",
    family: "F4",
    clue: "You can do this and still not see.",
    tag: "Sight"
  },
  {
    id: 3,
    word: "LISTEN",
    family: "F5",
    clue: "You hear more when you stop talking.",
    tag: "Sound"
  },
  {
    id: 4,
    word: "WAIT",
    family: "F3",
    clue: "It passes even when you do nothing.",
    tag: "Time"
  },
  {
    id: 5,
    word: "KEY",
    family: "F2",
    clue: "Teeth that turn but never chew.",
    tag: "Lock"
  },
  {
    id: 6,
    word: "DOOR",
    family: "F1",
    clue: "You stand before one more often than you notice.",
    tag: "Threshold"
  },
  {
    id: 7,
    word: "SIGNAL",
    family: "F3",
    clue: "It travels, even when you stay still.",
    tag: "Link"
  },
  {
    id: 8,
    word: "HIDDEN",
    family: "F2",
    clue: "Present, but refusing to be seen.",
    tag: "Veil"
  },
  {
    id: 9,
    word: "AWAKE",
    family: "F4",
    clue: "Your eyes are open, but this word says more.",
    tag: "State"
  },
  {
    id: 10,
    word: "GATES",
    family: "F5",
    clue: "Many of these can exist around a single place.",
    tag: "Barrier"
  }
];

/******************************************************
 * PUZZLE GENERATION HELPERS
 * Dev utilities for creating new puzzles programmatically
 ******************************************************/

/**
 * Generate a normalized puzzle object from a word and metadata
 * @param {string} word - The word to solve
 * @param {string} family - The rune family (F1-F6)
 * @param {string} tag - The tag/category
 * @param {string} clue - The clue text
 * @returns {Object} A puzzle object with auto-incremented ID
 */
function generatePuzzleFromWord(word, family, tag, clue) {
  const maxId = PUZZLES.reduce((max, p) => Math.max(max, p.id), 0);
  return {
    id: maxId + 1,
    word: word.toUpperCase(),
    family: family,
    tag: tag,
    clue: clue
  };
}

/**
 * Create a set of puzzles from a list of words
 * @param {Array<string>} words - Array of words
 * @param {Object} options - Configuration options
 * @param {string} options.family - Default family (F1-F6)
 * @param {Function} options.clueTemplate - Function(word) => clue string
 * @param {string} options.tag - Default tag
 * @returns {Array<Object>} Array of puzzle objects
 */
function createPuzzleSet(words, options = {}) {
  const {
    family = "F1",
    clueTemplate = (word) => `A word about ${word.toLowerCase()}.`,
    tag = "Word"
  } = options;

  const maxId = PUZZLES.reduce((max, p) => Math.max(max, p.id), 0);
  return words.map((word, idx) => ({
    id: maxId + idx + 1,
    word: word.toUpperCase(),
    family: family,
    tag: tag,
    clue: clueTemplate(word)
  }));
}

