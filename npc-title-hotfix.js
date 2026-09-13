// Final NPC title cleanup: keep the navigation and opened NPC page label consistent.
(function(){
  function fixNpcTitle(){
    if (typeof state !== 'undefined' && state.page === 'faces') {
      const heading = document.querySelector('.npcPageHead h1, .pagehead h1, .pagehead h2');
      if (heading && /npc.*faces|faces.*npc/i.test(heading.textContent || '')) heading.textContent = 'NPC';
    }
  }

  const originalRender = window.render;
  if (typeof originalRender === 'function') {
    window.render = function(){
      const result = originalRender.apply(this, arguments);
      requestAnimationFrame(fixNpcTitle);
      return result;
    };
  }

  requestAnimationFrame(fixNpcTitle);
})();
