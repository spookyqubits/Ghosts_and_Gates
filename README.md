# SpookyQubits playground

The Ghosts and Gates collection contains five game families, seven browser versions, five facilitator guides, and classroom printables. Its homepage links to three independent collections: Spooky Signals (`spooky-signals-playground`), Spooky Utilities (`spooky-utilities-playground`), and Spooky Action.

Spooky Utilities groups Bloch Sphere and Ghost Numbers (complex-number arithmetic) in the separate `spookyqubits/Spooky-Utilities` repository, alongside `Ghosts_and_Gates` and `SpookySignals`.

Spooky Action is collection 04, for short classroom activities. Its separate repository is `spookyqubits/SpookyAction`, at https://spookyqubits.github.io/SpookyAction/. The main page links directly to Ghost Trio first, then Ghost Twins. Both support Solo and shared-phone play and include printable facilitator guides.

## Preview

Open `dist/index.html` directly, or serve the site locally:

```sh
python3 -m http.server 8080 --directory dist
```

Then open `http://localhost:8080`. The site does not need a build server, database, accounts, or external scripts/fonts. Original games are copied without editing their code. Existing game layouts may be easier to use on a tablet or desktop; the launcher includes full screen and a standalone view.

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

## Credits and model scope

Credits in original games and guides are retained. The collection uses QCaMP classroom materials; the site does not claim to be an official QCaMP website. Ghost Grid draws on Allan Goff’s quantum tic-tac-toe. No new blanket license is assigned to source material.

Each game’s resource panel describes its model and limitations. In particular, Ghost Grid is a metaphor, Catch the Photon constructs relative amplitudes rather than modeling a physical optical system’s evolution, and Ghost Guard’s bit-flip code does not correct every kind of quantum error.
