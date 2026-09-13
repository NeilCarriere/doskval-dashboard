// Home-screen cartography and navigation label hotfix.
// Keeps the compact Home map aligned with the canonical map desk.
(function () {
  const homeDistricts = [
    { name: 'Whitecrown', x: 32, y: 10 },
    { name: 'Brightstone', x: 72, y: 27 },
    { name: 'Charterhall', x: 57, y: 45 },
    { name: 'Six Towers', x: 77, y: 42 },
    { name: 'Silkshore', x: 24, y: 51 },
    { name: 'Nightmarket', x: 82, y: 67 },
    { name: "Crow’s Foot", x: 39, y: 43 },
    { name: 'The Docks', x: 38, y: 28 },
    { name: 'Barrowcleft', x: 12, y: 68 },
    { name: 'Coalridge', x: 64, y: 68 },
    { name: 'Charhollow', x: 43, y: 59 },
    { name: 'Dunslough', x: 43, y: 82 }
  ];

  function fixNpcLabel() {
    if (typeof nav !== 'undefined') {
      const npc = nav.find(item => item[0] === 'faces');
      if (npc) npc[2] = 'NPC';
    }
  }

  function fixHomeMap() {
    const map = document.querySelector('.minimap');
    if (!map || map.dataset.canonicalHomeMap === 'true') return;

    map.dataset.canonicalHomeMap = 'true';
    map.classList.add('canonicalHomeMap');
    map.innerHTML = homeDistricts.map(district =>
      `<button class="homeDistrictPin" style="--hx:${district.x}%;--hy:${district.y}%" type="button" aria-label="Open ${district.name} on the Doskvol map"><span>◆</span><b>${district.name}</b></button>`
    ).join('') + '<span class="homeMapCompass" aria-hidden="true">N<br>✦</span>';

    map.querySelectorAll('.homeDistrictPin').forEach(button => {
      button.addEventListener('click', () => {
        if (typeof setPage === 'function') setPage('map');
      });
    });
  }

  function applyHotfix() {
    fixNpcLabel();
    fixHomeMap();
  }

  fixNpcLabel();

  if (typeof window.render === 'function') {
    const previousRender = window.render;
    window.render = function (...args) {
      const result = previousRender.apply(this, args);
      applyHotfix();
      return result;
    };
  }

  applyHotfix();
  if (typeof window.render === 'function') window.render();
})();
