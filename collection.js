(() => {
  const controls = document.querySelector('#filter-bar');
  const cards = [...document.querySelectorAll('.game-card')];
  controls.hidden = false;
  const buttons = [...controls.querySelectorAll('[data-filter]')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => { card.hidden = selected !== 'all' && card.dataset.concept !== selected; });
    const count = cards.filter(card => !card.hidden).length;
    document.querySelector('#filter-result').textContent = `${count} ${count === 1 ? 'game' : 'games'} to explore`;
  }));
})();
