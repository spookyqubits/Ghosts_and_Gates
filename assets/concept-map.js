(() => {
  const map = document.querySelector('#concepts');
  const controls = map.querySelector('#concept-map-controls');
  const buttons = [...controls.querySelectorAll('[data-concept-filter]')];
  const search = controls.querySelector('#concept-search');
  const status = controls.querySelector('#concept-status');
  const normalize = value => value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const groups = [...map.querySelectorAll('[data-concept-group]')].map(element => ({
    element,
    id: element.dataset.conceptGroup,
    title: normalize(element.querySelector('h3').textContent),
    rows: [...element.querySelectorAll('.concept-row')].map(row => ({
      element: row,
      text: normalize(row.querySelector('.concept-node').textContent),
      games: [...row.querySelectorAll('[data-concept-game]')].map(game => ({
        element: game,
        id: game.dataset.conceptGame,
        text: normalize(game.textContent),
      })),
    })),
  }));
  let active = groups[0].id;

  function update() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    const includesTerms = target => terms.every(term => target.includes(term));
    const found = new Set();
    let total = 0;
    for (const group of groups) {
      const selected = active === 'all' || group.id === active;
      let groupCount = 0;
      for (const row of group.rows) {
        const topic = group.title + ' ' + row.text;
        let hasMatch = false;
        for (const game of row.games) {
          const visible = selected && includesTerms(topic + ' ' + game.text);
          game.element.hidden = !visible;
          if (visible) {
            hasMatch = true;
            found.add(game.id);
          }
        }
        row.element.hidden = !hasMatch;
        if (hasMatch) groupCount++;
      }
      group.element.hidden = groupCount === 0;
      total += groupCount;
    }
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.conceptFilter === active));
    status.textContent = total
      ? `${total} ${total === 1 ? 'concept' : 'concepts'} · ${found.size} ${found.size === 1 ? 'game or activity' : 'games and activities'}`
      : 'No matches. Try a different search or choose All topics.';
  }

  function revealAnchor() {
    const anchor = groups.flatMap(group => group.rows).find(row => '#' + row.element.id === location.hash);
    if (anchor) {
      active = anchor.element.closest('[data-concept-group]').dataset.conceptGroup;
      search.value = '';
      update();
      anchor.element.scrollIntoView();
    }
  }

  for (const button of buttons) button.addEventListener('click', () => {
    active = button.dataset.conceptFilter;
    update();
  });
  search.addEventListener('input', () => {
    active = 'all';
    update();
  });
  window.addEventListener('hashchange', revealAnchor);
  controls.hidden = false;
  update();
  revealAnchor();
})();
