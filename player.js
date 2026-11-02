(() => {
  const catalog = window.GAME_CATALOG;
  const params = new URLSearchParams(location.search);
  const requested = params.get('game');
  const game = catalog.find(item => item.id === requested) || catalog[0];
  const selector = document.querySelector('#game-select');
  const variants = document.querySelector('#variant-select');
  const area = document.querySelector('#game-area');
  const panel = document.querySelector('#resource-panel');
  const toggle = document.querySelector('#resources-toggle');
  const standalone = document.querySelector('#standalone');
  const fullscreen = document.querySelector('#fullscreen-button');
  const announce = document.querySelector('#player-announcement');
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  document.title = `${game.name} — SpookyQubits`;
  for (const item of catalog) selector.add(new Option(item.name, item.id, false, item === game));
  selector.addEventListener('change', () => { location.href = `play.html?game=${encodeURIComponent(selector.value)}`; });
  const links = game.resources.map(item => `<a class="resource-link" href="${item.file}" download><span>${escape(item.name)}</span><span aria-hidden="true">↓</span></a>`).join('');
  panel.innerHTML = `<div class="resource-inner"><div class="resource-copy"><p class="eyebrow">${escape(game.concept)} · GRADES 6–8</p><h1 id="resource-heading">${escape(game.name)}</h1><p class="resource-learn">${escape(game.learn)}</p><div class="discussion"><span>Ask the room</span><p>${escape(game.prompt)}</p></div><p class="resource-note">${escape(game.note)}</p></div><div class="resource-downloads"><p class="kit-meta">${escape(game.time)} · ${escape(game.players)}</p><h2>${game.variants.length ? 'Take the game with you' : 'Your tabletop kit'}</h2><a class="resource-link guide-link" href="${game.guide}" target="_blank" rel="noopener"><span>Facilitator guide (PDF)</span><span aria-hidden="true">↗</span></a>${game.variants.map(v => `<a class="resource-link" href="${v.file}" download><span>Offline HTML · ${escape(v.name)}</span><span aria-hidden="true">↓</span></a>`).join('')}${links}<p class="materials">${escape(game.materials)}</p></div></div>`;
  function showResources(show, focus = false) {
    panel.hidden = !show;
    toggle.setAttribute('aria-expanded', String(show));
    if (show && focus) panel.scrollIntoView({block:'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  toggle.addEventListener('click', () => showResources(panel.hidden, true));
  if (game.variants.length) {
    const raw = Number(params.get('version') || 0);
    let version = Number.isInteger(raw) && raw >= 0 && raw < game.variants.length ? raw : 0;
    game.variants.forEach((v, i) => variants.add(new Option(v.name, String(i), false, i === version)));
    document.querySelector('#variant-control').hidden = game.variants.length < 2;
    function launch(index) {
      const item = game.variants[index];
      area.replaceChildren();
      const frame = document.createElement('iframe');
      frame.title = `${game.name}: ${item.name}`;
      frame.src = item.file;
      frame.allow = 'fullscreen';
      frame.setAttribute('allowfullscreen', '');
      area.append(frame);
      standalone.href = item.file;
      announce.textContent = `${game.name} · ${item.name}`;
      frame.addEventListener('load', () => { area.classList.add('is-ready'); }, {once:true});
    }
    variants.addEventListener('change', () => {
      version = Number(variants.value);
      const url = new URL(location.href);
      url.searchParams.set('version', String(version));
      try { history.replaceState(null, '', url); } catch (_) { /* Local file previews may restrict history. */ }
      launch(version);
    });
    fullscreen.addEventListener('click', async () => {
      const frame = area.querySelector('iframe');
      try {
        if (!frame?.requestFullscreen) { standalone.click(); return; }
        await frame.requestFullscreen();
      } catch (_) { announce.textContent = 'Full screen is unavailable here. Use “Open game in new tab” for more room.'; }
    });
    launch(version);
    showResources(params.get('resources') === '1' || location.hash === '#resources');
  } else {
    const skip = document.querySelector('.skip-link');
    skip.href = '#resource-panel';
    skip.textContent = 'Skip to tabletop kit';
    standalone.hidden = true;
    fullscreen.hidden = true;
    toggle.hidden = true;
    area.hidden = true;
    document.body.classList.add('tabletop-page');
    showResources(true);
    announce.textContent = 'Print, set up, and play · Qubit Touchdown is a tabletop game.';
  }
})();
