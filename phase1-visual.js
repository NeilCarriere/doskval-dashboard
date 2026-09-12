// Phase 1 — map + aesthetics only. Intentionally contains no audio.
(function(){
  function addAtmosphere(){
    if(document.querySelector('.p1-gaslights')) return;
    const lights=document.createElement('div');
    lights.className='p1-gaslights';
    lights.setAttribute('aria-hidden','true');
    lights.innerHTML='<i></i><i></i><i></i>';
    document.body.appendChild(lights);
  }

  function refineMap(){
    const main=document.getElementById('main');
    if(!main || !main.classList.contains('mapMode')) return;

    // Quellyn belongs in Six Towers written intelligence, not as a map marker.
    main.querySelectorAll('[data-mid="quellyn"]').forEach(el=>el.remove());

    // Clarify that map faction pins are intentionally selective.
    main.querySelectorAll('[data-layer="factions"]').forEach(btn=>{
      if(btn.textContent.trim()==='FACTIONS') btn.childNodes.forEach(n=>{
        if(n.nodeType===Node.TEXT_NODE && n.textContent.includes('FACTIONS')) n.textContent=' MAJOR FACTIONS';
      });
      btn.title='Show major faction presence without cluttering the city map';
    });

    // Highlight the district currently being viewed without changing map logic.
    const dossierTitle=main.querySelector('.mapDossierHead h2')?.textContent?.trim();
    if(dossierTitle){
      main.querySelectorAll('.districtMarker').forEach(marker=>{
        marker.classList.toggle('selectedDistrict',marker.querySelector('b')?.textContent?.trim()===dossierTitle);
      });
    }

    // Add a quiet legend note once.
    const tools=main.querySelector('.mapTools');
    if(tools && !tools.querySelector('.p1-map-note')){
      const note=document.createElement('span');
      note.className='p1-map-note';
      note.textContent='District click = local factions · pins = major/campaign presence';
      note.style.cssText='margin-left:auto;color:#748985;font:600 .65rem/1.25 Georgia,serif;letter-spacing:.05em;max-width:250px;text-align:right';
      tools.appendChild(note);
    }
  }

  addAtmosphere();
  refineMap();

  const main=document.getElementById('main');
  if(main){
    new MutationObserver(()=>refineMap()).observe(main,{childList:true,subtree:true});
    main.addEventListener('click',()=>requestAnimationFrame(refineMap));
  }
})();
