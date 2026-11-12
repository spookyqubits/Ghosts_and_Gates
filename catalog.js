window.GAME_CATALOG = [
  {
    "id": "catch-the-photon",
    "name": "Catch the Photon",
    "number": "01",
    "theme": "photon",
    "concept": "Interference",
    "question": "Can you make light disappear?",
    "description": "Play a wave. Brighten your detector. Cancel your opponent’s. Then see who catches the photon.",
    "time": "10 min",
    "players": "1–2 players",
    "mode": "Browser + tabletop",
    "guide": "resources/catch-the-photon/guide.pdf",
    "learn": "Predict how waves add or cancel, then connect amplitude to the probability of detecting a photon.",
    "prompt": "Why can adding one more wave make your detector darker?",
    "materials": "For tabletop play: 40 numbered wave cards (seven 1s and three 2s per direction), the Wave Board, two tokens, and up to 32 colored chips or paper slips per detector.",
    "note": "Four arrow directions represent four phases; numbers 1 and 2 give amplitude. The game builds relative amplitudes and normalizes brightness weights across the detectors. It is a teaching model, not a simulation of an optical apparatus.",
    "variants": [
      {
        "name": "Play the game + Wave Lab",
        "file": "games/catch-the-photon.html"
      }
    ],
    "resources": [
      {
        "name": "Wave Board",
        "file": "resources/catch-the-photon/wave-board.pdf"
      },
      {
        "name": "Wave cards · printable PDF",
        "file": "resources/catch-the-photon/wave-cards.pdf"
      },
      {
        "name": "Wave cards · browser print",
        "file": "games/CatchThePhoton_Wave_Cards.html"
      },
      {
        "name": "Guide · accessible HTML",
        "file": "resources/catch-the-photon/guide.html"
      }
    ],
    "quickPlay": true
  },
  {
    "id": "ghost-coin",
    "name": "Ghost Coin",
    "number": "02",
    "theme": "coin",
    "concept": "Interference",
    "question": "Can a quantum coin beat you?",
    "description": "Turn a penny flip into a battle of hidden signs. Discover a winning trick—and the counter-trick.",
    "time": "30 min",
    "players": "1–2 players",
    "mode": "Browser + tabletop",
    "guide": "resources/ghost-coin/guide.pdf",
    "learn": "Use positive and negative chips to explore superposition, phase, interference, and measurement.",
    "prompt": "Two coins both give a 50/50 result. Could their hidden signs make them behave differently later?",
    "materials": "For tabletop play: HEADS and TAILS boxes, green and red chips, four types of action card, and a coin. Instructions are in the guide.",
    "note": "The signed-chip rules represent the restricted single-qubit states reached by the game’s Leave, Flip, Sign, and Ghost cards.",
    "variants": [
      {
        "name": "Play all four levels + Chip Lab",
        "file": "games/ghost-coin.html"
      }
    ],
    "resources": [],
    "quickPlay": true
  },
  {
    "id": "ghost-grid",
    "name": "Ghost Grid",
    "number": "03",
    "theme": "grid",
    "concept": "Superposition",
    "question": "What if your move had two homes?",
    "description": "A familiar tic-tac-toe board gets spooky: paired marks, shared squares, and a chain of surprising collapses.",
    "time": "15 min / game",
    "players": "2 players",
    "mode": "Browser + tabletop",
    "guide": "resources/ghost-grid/guide.pdf",
    "learn": "Explore superposition and linked outcomes through a tic-tac-toe metaphor, with three browser versions to try.",
    "prompt": "How can resolving one pair force another pair to settle somewhere else?",
    "materials": "For tabletop play: a tic-tac-toe grid, two pencil colors, and a die for the introductory version. Use the facilitator guide for current rules.",
    "note": "Ghost Grid is a metaphor for quantum ideas. Its tic-tac-toe rules are not the mathematical rules of a quantum system. Full-game rules are adapted from Allan Goff (2006).",
    "variants": [
      {
        "name": "Start here: superposition",
        "file": "games/ghost-grid-intro.html"
      },
      {
        "name": "Superposition: step by step",
        "file": "games/ghost-grid-step-by-step.html"
      },
      {
        "name": "Full Goff game: linked collapses",
        "file": "games/ghost-grid-full.html"
      }
    ],
    "resources": [
      {
        "name": "Full Goff game handout (DOCX)",
        "file": "resources/ghost-grid/goff-handout.docx"
      }
    ]
  },
  {
    "id": "ghost-hunt",
    "name": "Ghost Hunt",
    "number": "04",
    "theme": "hunt",
    "concept": "Quantum search",
    "question": "Which room is hiding the ghost?",
    "description": "Flip a sign. Reflect around the average. Build up a search wave—and learn when to stop.",
    "time": "45 min",
    "players": "1–2 players or teams",
    "mode": "Browser + tabletop",
    "guide": "resources/ghost-hunt/guide.pdf",
    "learn": "Explore Grover’s search using signed numbers, averages, and probability, including why extra rounds can hurt.",
    "prompt": "If a search round helps, why might doing too many rounds make you less likely to find the ghost?",
    "materials": "For tabletop play: the printable Wave Tracker, seven coins per pair, pencils, and scrap paper.",
    "note": "The wave arithmetic models Grover’s search on a small set of rooms. The physical coin-based measurement is an approximation described in the game.",
    "variants": [
      {
        "name": "Play Ghost Hunt",
        "file": "games/ghost-hunt.html"
      }
    ],
    "resources": [
      {
        "name": "Wave Tracker and printables",
        "file": "resources/ghost-hunt/printables.pdf"
      }
    ],
    "quickPlay": true
  },
  {
    "id": "ghost-guard",
    "name": "Ghost Guard",
    "number": "05",
    "theme": "guard",
    "concept": "Error correction",
    "question": "Can you fix a secret without looking?",
    "description": "The Gremlin brings the noise. The Guardian checks for mistakes. Protect the ghost without revealing it.",
    "time": "45 min",
    "players": "1–2 online · 3 tabletop",
    "mode": "Browser + tabletop",
    "guide": "resources/ghost-guard/guide.pdf",
    "learn": "Explore parity checks, bit-flip errors, and why measuring a secret differs from checking for an error.",
    "prompt": "What can a match-or-no-match question tell you without revealing the secret itself?",
    "materials": "For tabletop play: the printable kit, six coins, green and red chips, a ten-sided die, and a folder. Roles: Guardian, Gremlin, and Keeper.",
    "note": "The game introduces the three-qubit bit-flip code. That code protects against a single bit flip; it does not correct every kind of quantum error. Level 2 is an unscored diagnosis: a Sign error escapes these checks and cannot be repaired by the available Flip cards. Explain the missing phase checks and corrections instead of trying to win.",
    "variants": [
      {
        "name": "Play + Ghost Box and Noise Labs",
        "file": "games/ghost-guard.html"
      }
    ],
    "resources": [
      {
        "name": "Mats, cards, and score sheets",
        "file": "resources/ghost-guard/printables.pdf"
      },
      {
        "name": "Teacher handout",
        "file": "resources/ghost-guard/teacher-handout.pdf"
      },
      {
        "name": "Level 2 diagnosis · facilitator notes (HTML)",
        "file": "resources/ghost-guard/diagnosis.html"
      }
    ]
  }
];
