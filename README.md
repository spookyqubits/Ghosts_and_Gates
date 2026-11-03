# SpookyQubits · Ghosts and Gates + Spooky Signals

Two collections of browser games and classroom resources. **Ghosts and Gates** explores quantum computing and related ideas. **Spooky Signals** explores quantum communication, starting with **Ghost Mail**, made for phones and shared-device play.

Live playground: https://spookyqubits.github.io/Ghosts_and_Gates/

## Spooky Signals · Collection 02

[Explore Spooky Signals](https://spookyqubits.github.io/Ghosts_and_Gates/spooky-signals/) · [Play Ghost Mail](https://spookyqubits.github.io/Ghosts_and_Gates/spooky-signals/ghost-mail.html)

Ghost Mail is a four-packet BB84 teaching game. Spend retained bits on tests, then deliver or discard the remaining key; or play the Spy and decide how much to intercept. Solo Courier, Solo Spy, and Pass & Play for 2–3 people are included. Calm Night and Noisy Night change how players interpret mismatches. The built-in Signal Lab compares repeated preparations and measurement bases.

One phone is enough for group play; private planning uses handoff screens and an honor system. No accounts, server, or installation are required. Download the self-contained HTML game for offline play. The printable facilitator guide explains setup, scoring, model limits, discussion prompts, and sources. Game points are teaching mechanics, not a cryptographic security test; the game does not create real keys.

## Ghosts and Gates · Collection 01

| Game | Explore | Available formats |
| --- | --- | --- |
| Catch the Photon | Wave phases, interference, and detection probabilities | Browser game, Wave Lab, printable board |
| Ghost Coin | Signed amplitudes, phase, and the quantum penny-flip game | Browser game, Chip Lab, tabletop instructions |
| Ghost Grid | Superposition and linked collapse through tic-tac-toe | Three browser versions, facilitator guide, full-game handout |
| Ghost Hunt | Grover’s search through flip-and-reflect arithmetic | Browser game, tracker, printables |
| Ghost Guard | Parity checks and the three-qubit bit-flip code | Browser game, labs, printable kit |

All five original game families have a facilitator guide. The downloadable classroom ZIP contains all eight browser versions across both collections, guides, and selected printables. The games use teaching models with different scopes; their resource panels explain the connections to quantum physics and the limits of each model.

## Run locally

This repository contains the ready-to-host site, with `index.html` at its root. No installation, package manager, database, or external fonts/scripts are required.

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. The original game launcher includes concept filters, version selection, full-screen controls, and offline downloads. Ghosts and Gates boards are designed for classroom screens; phones can scroll across their wider layouts. Ghost Mail has a dedicated portrait layout and opens directly from the second collection.

## Publish with GitHub Pages

In this repository’s **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, then save. The included `.nojekyll` file keeps the static files intact. Subsequent pushes to `main` update the published site.

## Credits

Developed and adapted using QCaMP classroom materials. Ghost Grid draws on Allan Goff’s quantum tic-tac-toe (2006). Original credits are retained in the games and facilitator guides; the collection does not assign a new blanket license to those materials or claim to be an official QCaMP website.

Ghost Mail models Bennett and Brassard’s BB84 protocol. Primary references and educational precedents are linked in its game rules and facilitator guide. Design and code prepared for SpookyQubits, 2 November 2026.
