(() => {
  function forwardMovedSection() {
    const hash = location.hash;
    if (hash === '#classroom') location.replace('educators.html');
    if (hash === '#games') location.replace('ghosts-and-gates.html');
    if (hash === '#concepts' || hash.startsWith('#concept-')) location.replace('concepts.html' + hash);
  }
  forwardMovedSection();
  window.addEventListener('hashchange', forwardMovedSection);
})();
