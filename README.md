# SpookyQubits playground

The Ghosts and Gates collection contains five game families, seven browser versions, five facilitator guides, and classroom printables. Its homepage links to three independent collections: Spooky Signals (`spooky-signals-playground`), Spooky Utilities (`spooky-utilities-playground`), and Spooky Action.

Spooky Utilities groups Bloch Sphere and Ghost Numbers (complex-number arithmetic) in the separate `spookyqubits/Spooky-Utilities` repository, alongside `Ghosts_and_Gates` and `SpookySignals`.

Spooky Action is collection 04, for short classroom activities. Its separate repository is `spookyqubits/SpookyAction`, at https://spookyqubits.github.io/SpookyAction/. The main page links directly to Ghost Trio first, then Ghost Twins. Both support Solo and shared-phone play and include printable facilitator guides.

## Preview

Open `dist/index.html` directly, or serve the site locally:

```sh
python3 -m http.server 8080 --directory dist
```

Then open `http://localhost:8080`. The site does not need a build server, database, accounts, or external scripts/fonts. The builder copies the current offline game sources byte for byte. Existing game layouts may be easier to use on a tablet or desktop; the launcher includes full screen and a standalone view.

## Host publicly

Deploy the **contents of `dist/`**, with `index.html` at the hosting root. `spookyqubits-playground.zip` contains exactly those files and can be extracted and uploaded. Local navigation and asset URLs are relative. Links to the independent Spooky Signals collection use its full public address.

- For a static hosting service, choose the `dist` folder as the published directory. No server-side runtime or install step is required.
- For a repository-based static site, commit the contents of `dist` to the configured publishing directory or branch. `.nojekyll` is included.
- For ordinary web hosting, upload everything inside `dist` to the desired public directory.

The first collection is hosted at https://spookyqubits.github.io/Ghosts_and_Gates/. The migration build points to the separate Spooky Signals repository/site at https://spookyqubits.github.io/SpookySignals/. Its old nested URLs become compatibility redirects. Publish the new collection before this migration build, so those redirects never point to an empty site.

## Update games, descriptions, or branding

Edit the original game files in their existing folders. Edit `src/catalog.json` for card descriptions, classroom metadata, versions, and the explicit download list. Edit `src/index.html`, `src/play.html`, `src/styles.css`, `src/app.js`, and `src/player.js` for the playground.

Ghost Mail’s source is `SpookySignals/GhostMail_Offline.html` in the workspace. Its independent builder and catalog are in `Logo-Website/spooky-signals-playground/`. That builder publishes it to `games/ghost-mail/index.html`. This project only emits compatibility redirects at the original nested URLs.

Rebuild from this directory using Python 3 (standard library only):

```sh
python3 build.py
```

The builder recreates only `dist/` and the upload ZIP. It copies the existing `Logo-Website/ChatGPT Image Nov 1, 2026, 06_41_11 PM.png` asset. The workspace is resolved from this project’s location under `Logo-Website`.

The classroom ZIP inside `dist/downloads/` contains only Ghosts and Gates games and resources. Spooky Signals has its own classroom ZIP in its independent site. It excludes the website source, personal documents, draft conference files, research corpora, and verification data. The outdated superposition-only Ghost Grid handout identified in its source README is omitted; the current facilitator guide is included instead.

## Catch the Photon wave cards

Catch the Photon uses a 40-card wave deck: seven strength-1 and three strength-2 cards per direction. The number is amplitude and moves the token that many squares. Up cards are blue, down red, right purple, and left gold. The hand, board labels, Wave Lab, sound, and computer player share the same model. Solo quick play resolves both choices and advances each round directly. Restarting cancels any pending photon animation and restores the Fire control.

The resource panel includes the printable wave cards, arrow-labeled board, and updated PDF/HTML facilitator guide. Brightness is an unnormalized probability weight; the game divides each detector's weight by their sum before the photon draw.

Run the focused regression checks from this repository:

```sh
node --test tests/catch-the-photon.test.cjs
```

Regenerate the browser-printable deck with `node tools/build-photon-cards.cjs`. The PDF resource builder is `tools/build-photon-pdfs.py`; it accepts the classroom output directory, requires ReportLab, and currently uses the standard macOS Arial and Comic Sans font files. The offline source in the QCaMP workspace is `CatchThePhoton/CatchThePhoton_Offline.html`; the playground builder copies that source and the explicit resources listed in its catalog.

## Assessment improvements

Ghost Coin and Ghost Hunt now support solo quick play and direct `?solo=1` links. Their shared-screen and step-by-step paths remain available. Ghost Coin begins its solo challenge at Level 2 and reports the probability before opening. Ghost Hunt keeps its six-night role swap, shows the chosen-round arithmetic, and gives credit for reaching a 75% catch chance even if the sampled result misses.

Ghost Guard Level 2 is an unscored diagnostic challenge. Inspecting one Sign + Check reveals the changed chips with unchanged parity answers; the learner explains the missing phase checks and corrections. Seven-night exploration remains available, while Levels 0 and 1 retain duel scoring. Computer callbacks cannot act on a restarted game.

Ghost Hunt explicitly labels its retained bars as the state before LOOK. Its explanation distinguishes 1,000,000 rooms (785 rounds) from 1,048,576 rooms (804 rounds), for one ghost. Resetting or manually reflecting cancels a pending automatic reflection.

Run all gameplay regressions from the published repository:

```sh
node --test tests/*.test.cjs
```

These tests execute the shipped scripts, verify the restart races and quick-play paths, exhaust all 793,800 Level 2 schedules using the check table, and finish 120 seeded games in each Ghost Grid variant. The small DOM stand-in does not verify browser rendering; inspect the UI separately when changing layouts.

For the underlying science, see IBM Quantum Learning on [Grover iteration counts](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/grover-algorithm/number-of-iterations) and [the three-qubit bit-flip code](https://quantum.cloud.ibm.com/learning/en/courses/tools-for-quantum-advantage/error-correction-ii).

## Credits and model scope

Credits in original games and guides are retained. The collection uses QCaMP classroom materials; the site does not claim to be an official QCaMP website. Ghost Grid draws on Allan Goff’s quantum tic-tac-toe. No new blanket license is assigned to source material.

Each game’s resource panel describes its model and limitations. In particular, Ghost Grid is a metaphor, Catch the Photon constructs relative amplitudes rather than modeling a physical optical system’s evolution, and Ghost Guard’s bit-flip code does not correct every kind of quantum error.
