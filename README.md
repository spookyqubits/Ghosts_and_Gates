# Ghosts and Gates · SpookyQubits

Games focused on quantum computing gates and related quantum ideas: interference, superposition, search, and error correction. A browser playground and classroom collection for grades 6–8.

## Explore the collection

| Game | Explore | Available formats |
| --- | --- | --- |
| Catch the Photon | Wave phases, interference, and detection probabilities | Browser game, Wave Lab, printable board |
| Ghost Coin | Signed amplitudes, phase, and the quantum penny-flip game | Browser game, Chip Lab, tabletop instructions |
| Ghost Grid | Superposition and linked collapse through tic-tac-toe | Three browser versions, facilitator guide, full-game handout |
| Ghost Hunt | Grover’s search through flip-and-reflect arithmetic | Browser game, tracker, printables |
| Ghost Guard | Parity checks and the three-qubit bit-flip code | Browser game, labs, printable kit |

All five game families have a facilitator guide. The site includes a downloadable classroom ZIP containing seven browser versions, guides, and selected printables. The games use teaching models with different scopes; their resource panels explain the connections to quantum physics and the limits of each model.

## Run locally

This repository contains the ready-to-host site, with `index.html` at its root. No installation, package manager, database, or external fonts/scripts are required.

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. The game launcher includes concept filters, version selection, full-screen controls, and offline downloads. Game boards are designed for classroom screens; phones can scroll across their wider layouts.

## Publish with GitHub Pages

In this repository’s **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, then save. The included `.nojekyll` file keeps the static files intact. Subsequent pushes to `main` update the published site.

## Credits

Developed and adapted using QCaMP classroom materials. Ghost Grid draws on Allan Goff’s quantum tic-tac-toe (2006). Original credits are retained in the games and facilitator guides; the collection does not assign a new blanket license to those materials or claim to be an official QCaMP website.
