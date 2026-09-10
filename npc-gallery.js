// NPC/Faces visual gallery — portrait-forward layout inspired by the approved mockup.
(function(){
  const E=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const hash=s=>[...String(s)].reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,17)>>>0;
  function portrait(name,big=false){
    const h=hash(name), hue=h%80+160, face=['#bca18d','#c9ad98','#9d8271','#d0b59e','#8c766c'][h%5];
    const hair=['#0a1014','#17151a','#241b18','#151d20','#2b2928'][(h>>3)%5];
    const coat=['#0c1c22','#151722','#172027','#1a1519','#101b19'][(h>>7)%5];
    const style=(h>>11)%5;
    let hairPath='';
    if(style===0)hairPath='<path d="M18 43Q23 8 51 7q30 2 34 39-11-13-22-16l-6 28-9-31-11 29-4-27q-8 4-15 14z" fill="'+hair+'"/>';
    if(style===1)hairPath='<path d="M20 38Q27 9 52 9q25 0 31 31-11-12-31-10T20 38z" fill="'+hair+'"/><path d="M26 35q-8 28 3 48M75 35q8 28-2 48" stroke="'+hair+'" stroke-width="9"/>';
    if(style===2)hairPath='<path d="M23 31Q34 12 50 12q20 0 29 21-14-8-29-5t-27 3z" fill="'+hair+'"/><path d="M29 57q21 23 43 0-5 26-22 28-17-2-21-28z" fill="'+hair+'"/>';
    if(style===3)hairPath='<path d="M18 40Q25 6 51 8q28 1 34 36-8-8-16-11l-5 19-8-27-9 24-8-18-5 21-5-18q-6 2-11 6z" fill="'+hair+'"/>';
    if(style===4)hairPath='<path d="M25 28Q36 11 50 11q17 0 27 18-12-5-27-4t-25 3z" fill="'+hair+'"/><path d="M22 63q28 17 56 0-4 20-28 23-24-3-28-23z" fill="'+hair+'" opacity=".92"/>';
    const scar=(h%4===0)?'<path d="M62 35l-7 25" stroke="#6a3837" stroke-width="1.6" opacity=".75"/>':'';
    const eye=(h%7===0)?'#79eee1':'#1d2527';
    const adorn=(h%6===0)?'<circle cx="75" cy="28" r="3" fill="#77e6d5" opacity=".8"/>':'';
    return `<svg class="npcPortraitArt ${big?'portraitBig':''}" viewBox="0 0 100 120" role="img" aria-label="Campaign visualization portrait of ${E(name)}"><defs><linearGradient id="bg${h}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${hue},28%,18%)"/><stop offset="1" stop-color="#05090c"/></linearGradient><radialGradient id="mist${h}"><stop stop-color="#74ddcf" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><rect width="100" height="120" fill="url(#bg${h})"/><circle cx="50" cy="48" r="36" fill="url(#mist${h})"/><path d="M9 120q5-38 41-43 37 5 42 43z" fill="${coat}"/><ellipse cx="50" cy="46" rx="22" ry="27" fill="${face}"/>${hairPath}<path d="M36 45l9-2m10 0 9 2" stroke="#3b3130" stroke-width="2" stroke-linecap="round"/><circle cx="42" cy="46" r="2" fill="${eye}"/><circle cx="59" cy="46" r="2" fill="${eye}"/><path d="M49 48l-2 10 5 1" stroke="#6e584f" fill="none"/><path d="M42 65q8 4 16 0" stroke="#70464a" stroke-width="1.5" fill="none"/>${scar}${adorn}<path d="M16 104q17-13 34-9 18-4 35 9" stroke="#5ecfbe" stroke-opacity=".22" fill="none"/><rect x="2" y="2" width="96" height="116" fill="none" stroke="#7fe3d3" stroke-opacity=".28"/></svg>`;
  }
  function buildPeople(){
    const L=window.DOSKVAL_LORE||{contacts:[],lore:{}};
    const by=new Map();
    (L.contacts||[]).forEach(c=>by.set(c.name,{name:c.name,role:c.role||'Contact',group:c.group||'Crew Contact',desc:c.sentence||'',status:c.status||'Contact',source:c.group?.includes('Campaign')?'Campaign':'Core contact',kind:'contact'}));
    Object.entries(L.lore||{}).forEach(([f,d])=>(d.npcs||[]).forEach(n=>{
      const existing=by.get(n[0]);
      const p={name:n[0],role:(n[1].split(';')[0]||'Faction figure').replace(/\.$/,''),group:f,desc:n[1],status:'Faction',source:'Published canon',kind:'faction'};
      if(existing) by.set(n[0],{...p,...existing,group:existing.group+' · '+f,desc:existing.desc+' '+p.desc}); else by.set(n[0],p);
    }));
    return [...by.values()];
  }
  function tags(p){
    const t=[]; if(p.kind==='contact')t.push('Crew Contact'); if(/witch|seer|arcane|spirit|demon|occult/i.test(p.role+' '+p.desc))t.push('Occult'); if(/leader|boss|captain|chief|second/i.test(p.role+' '+p.desc))t.push('Faction Leader'); if(/Bluecoat|Watch/i.test(p.group+' '+p.role))t.push('Law'); if(/Six Towers/i.test(p.desc+' '+p.group))t.push('Six Towers'); if(p.status==='Friend')t.push('Friendly'); if(p.status==='Rival')t.push('Rival'); return t.slice(0,5);
  }
  let selected='Quellyn', filter='all', query='';
  function card(p){return `<button class="npcTile ${p.name===selected?'selected':''}" data-npc="${E(p.name)}"><div class="npcTilePortrait">${portrait(p.name)}</div><div class="npcTileText"><b>${E(p.name)}</b><small>${E(p.group)}</small></div></button>`}
  function detail(p){const tg=tags(p);return `<aside class="npcDetail panel"><header><span>☻</span><div><h2>${E(p.name)}</h2><small>${E(p.role)} · ${E(p.group)}</small></div></header><div class="npcHeroPortrait">${portrait(p.name,true)}<span class="vizLabel">CAMPAIGN VISUALIZATION</span></div><div class="npcFacts"><div><label>ROLE</label><b>${E(p.role)}</b></div><div><label>CONNECTION</label><b>${E(p.status)}</b></div><div><label>SOURCE</label><b>${E(p.source)}</b></div></div><div class="npcTags">${tg.map(x=>`<span>${E(x)}</span>`).join('')}</div><section><h3>DESCRIPTION</h3><p>${E(p.desc||'No further description established yet.')}</p></section><section><h3>USE AT THE TABLE</h3><p>${p.kind==='contact'?'This person can provide information, access, leverage, complications, or a personal stake for the crew.':'Use this face to personify the faction’s interests, demands, opportunities and retaliation.'}</p></section><div class="npcDetailBtns"><button data-page="notes">VIEW NOTES</button><button data-page="factions">FACTION LEDGER</button></div></aside>`}
  function renderFaces(){
    const people=buildPeople();
    if(!people.find(p=>p.name===selected))selected=people[0]?.name||'';
    let shown=people.filter(p=>filter==='all'||(filter==='contacts'&&p.kind==='contact')||(filter==='leaders'&&tags(p).includes('Faction Leader'))||(filter==='factions'&&p.kind==='faction'));
    if(query)shown=shown.filter(p=>(p.name+' '+p.role+' '+p.group+' '+p.desc).toLowerCase().includes(query.toLowerCase()));
    const sel=people.find(p=>p.name===selected)||shown[0]||people[0];
    const main=document.getElementById('main'); if(!main)return;
    main.innerHTML=`<div class="npcPageHead"><div><p>PEOPLE WHO MATTER IN DOSKVOL</p><h1>NPCs / Faces</h1></div><div class="npcSearch"><span>⌕</span><input id="npcSearch" placeholder="Search people, factions, roles…" value="${E(query)}"></div></div><div class="npcToolbar"><button class="${filter==='all'?'active':''}" data-npcfilter="all">All NPCs <span>${people.length}</span></button><button class="${filter==='contacts'?'active':''}" data-npcfilter="contacts">Crew Contacts</button><button class="${filter==='leaders'?'active':''}" data-npcfilter="leaders">Faction Leaders</button><button class="${filter==='factions'?'active':''}" data-npcfilter="factions">Faction Figures</button></div><div class="npcWorkspace"><section class="npcGallery panel"><header><span>◉</span><h2>${filter==='all'?'THE HUMAN WEB':filter.toUpperCase()}</h2><small>${shown.length} shown</small></header><div class="npcTiles">${shown.map(card).join('')||'<p class="npcEmpty">No matching faces.</p>'}</div></section>${sel?detail(sel):''}</div>`;
    bindFaces();
  }
  function bindFaces(){
    document.querySelectorAll('[data-npc]').forEach(b=>b.onclick=()=>{selected=b.dataset.npc;renderFaces()});
    document.querySelectorAll('[data-npcfilter]').forEach(b=>b.onclick=()=>{filter=b.dataset.npcfilter;renderFaces()});
    const q=document.getElementById('npcSearch'); if(q)q.oninput=()=>{query=q.value;renderFaces();const nq=document.getElementById('npcSearch');if(nq){nq.focus();nq.setSelectionRange(query.length,query.length)}};
    document.querySelectorAll('.npcDetail [data-page]').forEach(b=>b.onclick=()=>setPage(b.dataset.page));
  }
  const previous=window.render;
  window.render=function(){previous(); if(state.page==='faces')renderFaces();};
  if(state?.page==='faces')renderFaces();
})();