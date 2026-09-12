// Phase 1 — map + aesthetics only. Intentionally contains no audio.
(function(){
  const lamp = '<svg viewBox="0 0 32 64" aria-hidden="true"><path d="M16 1v7M8 12l8-5 8 5M7 17h18l-3 31H10zM9 51h14M16 52v10" fill="none" stroke="currentColor" stroke-width="2"/><path class="gas-flame" d="M16 21c-1 7-6 10-5 16 0 8 11 8 10 0-1-5-4-9-5-16z"/><path d="M7 17l3-5h12l3 5M12 18l1 30M20 18l-1 30" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  function addAtmosphere(){
    const mast = document.querySelector('.masthead');
    if (!mast || mast.querySelector('.city-weather')) return;
    document.querySelector('.p1-gaslights')?.remove();
    const weather = document.createElement('div');
    weather.className = 'city-weather';
    weather.setAttribute('aria-hidden','true');
    weather.innerHTML = '<div class="cloud-bank cloud-far"></div><div class="cloud-bank cloud-near"></div><div class="harbour-fog"></div><div class="sky-gaslight gaslight">'+lamp+'</div><div class="sky-gaslight gaslight">'+lamp+'</div>';
    mast.prepend(weather);
    const pause = document.createElement('button');
    pause.className = 'weather-toggle';
    let paused = false;
    try { paused = localStorage.getItem('doskval-weather-paused') === 'true'; } catch (_) {}
    function sync(){
      document.documentElement.dataset.weatherPaused = String(paused);
      pause.textContent = paused ? 'Resume motion' : 'Pause motion';
      pause.setAttribute('aria-pressed',String(paused));
      pause.setAttribute('aria-label',paused ? 'Resume decorative city animation' : 'Pause decorative city animation');
    }
    pause.addEventListener('click',()=>{paused=!paused;sync();try{localStorage.setItem('doskval-weather-paused',String(paused));}catch(_) {}});
    sync();mast.appendChild(pause);
    document.addEventListener('visibilitychange',()=>{
      document.documentElement.dataset.weatherHidden = String(document.hidden);
    });
  }
  function decoratePanels(){
    const kinds=[['.crewhero','crew'],['.developments','developments'],['.webstage','web'],['.clocklist','clocks'],['.checklist','session'],['.quickoracle','oracle'],['.scorequick','score'],['.facequick','contacts'],['.minimap','city']];
    document.querySelectorAll('.dashboard-grid > .panel').forEach((panel,index)=>{
      if(panel.dataset.deskKind) return;
      const match=kinds.find(([selector])=>panel.querySelector(selector));
      if(!match) return;
      panel.dataset.deskKind=match[1];
      const light=document.createElement('span');
      light.className='panel-gaslight gaslight';light.setAttribute('aria-hidden','true');
      light.style.setProperty('--lamp-delay',(-index*1.37)+'s');
      light.innerHTML=lamp;panel.appendChild(light);
    });
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
  decoratePanels();

  const main=document.getElementById('main');
  if(main){
    new MutationObserver(()=>{refineMap();decoratePanels();}).observe(main,{childList:true,subtree:true});
    main.addEventListener('click',()=>requestAnimationFrame(refineMap));
  }
})();
