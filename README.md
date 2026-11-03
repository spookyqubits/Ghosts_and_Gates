# Ghosts and Gates · SpookyQubits

Games exploring interference, superposition, quantum search, and error correction. A browser playground and classroom collection for grades 6–8.

Live collection: https://spookyqubits.github.io/Ghosts_and_Gates/

## Games

| Game | Explore | Formats |
| --- | --- | --- |
| Catch the Photon | Wave phases, interference, and detection probabilities | Browser, Wave Lab, printable board |
| Ghost Coin | Signed amplitudes, phase, quantum penny-flip game | Browser, Chip Lab, tabletop instructions |
| Ghost Grid | Superposition and linked collapse through tic-tac-toe | Three browser versions, guide, handout |
| Ghost Hunt | Grover's search through flip-and-reflect arithmetic | Browser, tracker, printables |
| Ghost Guard | Parity checks and the three-qubit bit-flip code | Browser, labs, printable kit |

All five game families have facilitator guides. The classroom ZIP includes this collection's seven browser versions, guides, and selected printables. Resource panels explain each teaching model and its limits.

## Spooky Signals is a sibling collection

[Spooky Signals](https://spookyqubits.github.io/SpookySignals/) has its own repository and website, alongside Ghosts and Gates. It begins with [Ghost Mail](https://spookyqubits.github.io/SpookySignals/games/ghost-mail/), with Solo Courier, Solo Spy, Pass & Play, a Signal Lab, and its own classroom download.

Each Spooky Signals game lives in its own folder under `games/` in that repository. This repository keeps redirects at the old nested addresses so previously shared links continue working.

## Run and publish

This repository is a static site. No install step, database, accounts, or external fonts/scripts are required. Run `python3 -m http.server 8080` and open `http://localhost:8080`. Ghosts and Gates boards suit classroom screens; phones can scroll across their wider layouts.

GitHub Pages publishes from **main / (root)**. `.nojekyll` is included. Subsequent pushes update the collection.

## Credits

Developed and adapted using QCaMP classroom materials. Ghost Grid draws on Allan Goff's quantum tic-tac-toe (2006). Original credits remain in the games and facilitator guides; the collection does not assign a new blanket license or claim to be an official QCaMP website.
