// Self-contained resilient renderer for the Doskvol Dashboard home screen.
// Loaded last so the dashboard remains usable even if an earlier enhancement script fails.
(function(){
  const nav=document.getElementById('nav');
  const main=document.getElementById('main');
  if(!nav||!main) return;

  const state={page:'home'};
  const navItems=[
    ['home','⌂ Home'],['crew','♣ The Sneaks'],['factions','♟ Factions'],['factionweb','⌘ Faction Web'],
    ['locations','⌖ Districts'],['clocks','◷ Clocks'],['npcs','♙ NPCs'],['gather','◉ Gather Info'],
    ['score','⚔ Scores'],['notes','▤ Session Notes'],['lore','✦ Canon & Lore'],['oracle','◈ Action Oracle']
  ];

  const factions=[
    ['Gray Cloaks','+2','Friendly','They favor The Sneaks; the exact character-creation reason remains intentionally undefined.'],
    ['The Wraiths','+1','Working arrangement','Nightmarket hunting ground; tribute has been paid faithfully.'],
    ['The Grinders','−2','Hostile','The Sneaks stole from them.'],
    ['The Crows','0','Unestablished','Crow’s Foot begins in a leadership crisis after Roric’s death.'],
    ['The Lampblacks','0','Unestablished','Major Crow’s Foot faction in conflict with the Red Sashes.'],
    ['The Red Sashes','0','Unestablished','Iruvian sword-school gang fighting the Lampblacks.'],
    ['The Dimmer Sisters','0','Unestablished','Occult faction with deep spirit-trade interests.'],
    ['The Hive','0','Unestablished','Powerful merchant/criminal faction.']
  ];

  const districts=[
    ['Nightmarket','Rare goods, rail trade, illicit and arcane commerce.'],
    ['Six Towers','Faded nobility, haunted estates, Quellyn’s cottage.'],
    ['Crow’s Foot','Gang turf and the unstable struggle after Roric’s death.'],
    ['The Docks','Warehouses, sailors, labor, smuggling and violence.'],
    ['Coalridge','Factories, soot and labor unrest.'],
    ['Charhollow','Crowded working-class tenements and hard lives.']
  ];

  const qs=s=>document.querySelector(s);
  const html=(strings,...vals)=>strings.reduce((a,s,i)=>a+s+(vals[i]??''),'');
  const card=(title,body)=>`<section class="card"><h3>${title}</h3>${body}</section>`;
  const pips=(n,total=6)=>`<span class="clock-pips">${Array.from({length:total},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</span>`;

  function renderNav(){
    nav.innerHTML=navItems.map(([id,label])=>`<button class="navbtn ${state.page===id?'active':''}" data-safe-page="${id}">${label}</button>`).join('');
    nav.querySelectorAll('[data-safe-page]').forEach(b=>b.onclick=()=>{state.page=b.dataset.safePage;render();});
  }

  function home(){
    return `<div class="home-cockpit">
      <div class="home-stack">
        ${card('The Sneaks',`<div class="crew-overview"><div class="crew-hood"></div><div class="crew-meta"><p class="eyebrow">PRIVATE GM LEDGER</p><p><b>Crew:</b> Shadows</p><p><b>Reputation:</b> Dangerous</p><p><b>Known contact:</b> Quellyn, Six Towers</p><p><b>Current pressures:</b> Wraith tribute, Gray Cloak favour, Grinder hostility</p><button data-safe-page="crew">Open Crew</button></div></div>`)}
        ${card('Active Crew Clocks',`<div class="clock-row"><span>Grinders retaliate</span>${pips(2,6)}</div><div class="clock-row"><span>Wraith suspicion</span>${pips(0,4)}</div><div class="clock-row"><span>Crow’s Foot instability</span>${pips(2,8)}</div><button data-safe-page="clocks">Open Clocks</button>`)}
        ${card('Recent Events',`<div class="events-list"><div class="event-line"><time>Sep 8</time><span>Wraith tribute paid in Nightmarket.</span></div><div class="event-line"><time>Sep 5</time><span>Gray Cloaks continue to favour The Sneaks.</span></div><div class="event-line"><time>Campaign</time><span>Grinders remain angry after being robbed.</span></div></div>`)}
      </div>
      <div class="home-stack">
        ${card('Faction Web',`<p class="eyebrow">LIVE CITY PRESSURE</p><div class="home-faction-stage"><div class="home-faction-center"><div><div class="crew-hood mini"></div><b>THE SNEAKS</b></div></div>${factions.slice(0,8).map((f,i)=>`<div class="home-node n${i+1} ${f[1].startsWith('+')?'good':f[1].startsWith('−')?'bad':'neutral'}"><b>${f[0]}</b><small>${f[1]}</small></div>`).join('')}</div><button data-safe-page="factionweb">Open Full Web</button>`)}
        ${card('Doskvol Districts',`<div class="district-strip">${districts.slice(0,4).map(d=>`<div class="district-tile"><b>${d[0]}</b><span>${d[1]}</span></div>`).join('')}</div><button data-safe-page="locations">Explore Districts</button>`)}
        <div class="home-bottom">
          ${card('Next Session',`<div class="checklist"><label><input type="checkbox"> Resolve current score fallout</label><label><input type="checkbox"> Advance faction clocks</label><label><input type="checkbox"> Run downtime</label><label><input type="checkbox"> Update relationships</label><label><input type="checkbox"> Prep one strong opportunity</label></div>`)}
          ${card('GM Notes',`<p>Follow up with Quellyn in Six Towers.</p><p>Keep the Wraith arrangement visible.</p><p>Remember: published canon is the baseline; campaign play overrides it.</p><button data-safe-page="notes">Open Notes</button>`)}
        </div>
      </div>
    </div>`;
  }

  function page(){
    if(state.page==='factions'||state.page==='factionweb') return `<div class="section-head"><div><p class="eyebrow">THE HAUNTED CITY</p><h2>Faction ${state.page==='factionweb'?'Web':'Ledger'}</h2><p>Core canon → Deep Cuts → The Sneaks campaign</p></div></div><div class="cards">${factions.map(f=>card(f[0],`<span class="tag ${f[1].startsWith('+')?'good':f[1].startsWith('−')?'bad':''}">${f[1]} · ${f[2]}</span><p>${f[3]}</p>`)).join('')}</div>`;
    if(state.page==='locations') return `<div class="section-head"><div><p class="eyebrow">DOSKVOL</p><h2>Districts</h2><p>Fast campaign reference</p></div></div><div class="cards">${districts.map(d=>card(d[0],`<p>${d[1]}</p>`)).join('')}</div>`;
    if(state.page==='clocks') return `<div class="section-head"><div><p class="eyebrow">PRESSURE</p><h2>Clocks</h2><p>Visible consequences</p></div></div><div class="cards">${card('Grinders retaliate',pips(2,6))}${card('Wraith suspicion',pips(0,4))}${card('Crow’s Foot instability',pips(2,8))}</div>`;
    if(state.page==='npcs') return `<div class="section-head"><div><p class="eyebrow">FACES IN THE FOG</p><h2>NPCs</h2></div></div><div class="cards">${card('Quellyn',`<p>Young witch in Six Towers. Cottage behind a low stone fence, fungus-heavy garden sustained by a little magic, drying herbs inside.</p>`)}</div>`;
    if(state.page==='lore') return `<div class="section-head"><div><p class="eyebrow">SOURCE LAYERS</p><h2>Canon & Lore</h2></div></div><div class="cards">${card('1 · Core Book',`<p>Official Doskvol baseline: factions, districts, starting situation, clocks and city lore.</p>`)}${card('2 · Deep Cuts',`<p>Expanded lore and factions layered over the core book.</p>`)}${card('3 · The Sneaks',`<p>Your campaign state overrides published assumptions whenever play changes the city.</p>`)}</div>`;
    if(state.page==='crew') return `<div class="section-head"><div><p class="eyebrow">THE SNEAKS</p><h2>Crew Ledger</h2></div></div>${card('Campaign State',`<p>Shadows crew. Quellyn is a trusted contact. Gray Cloaks favour the crew. Wraith tribute has been paid. Grinders are hostile after being robbed.</p>`)}`;
    if(state.page==='notes') return `<div class="section-head"><div><p class="eyebrow">GM LEDGER</p><h2>Session Notes</h2></div></div>${card('Notes',`<textarea id="safeNotes" rows="14" style="width:100%;background:#071014;color:#e6f7f5;border:1px solid #23c8d8;padding:12px">${localStorage.getItem('doskvol-safe-notes')||''}</textarea><p><button id="saveSafeNotes">Save Notes</button></p>`)}`;
    if(state.page==='oracle') return `<div class="section-head"><div><p class="eyebrow">GM TOOL</p><h2>Action Oracle</h2></div></div>${card('Quick Roll',`<p id="safeOracleResult">Ready.</p><button id="safeRoll">Roll d6</button>`)}`;
    return `<div class="section-head"><div><p class="eyebrow">DOSKVOL DASHBOARD</p><h2>${navItems.find(x=>x[0]===state.page)?.[1]||'Tool'}</h2></div></div>${card('Available',`<p>This workspace is active. Additional campaign-specific tooling will continue to be layered here without hiding the core dashboard.</p>`)}`;
  }

  function wire(){
    main.querySelectorAll('[data-safe-page]').forEach(b=>b.onclick=()=>{state.page=b.dataset.safePage;render();});
    const save=qs('#saveSafeNotes'); if(save) save.onclick=()=>localStorage.setItem('doskvol-safe-notes',qs('#safeNotes').value);
    const roll=qs('#safeRoll'); if(roll) roll.onclick=()=>{qs('#safeOracleResult').textContent='Result: '+(1+Math.floor(Math.random()*6));};
  }

  function render(){renderNav();main.innerHTML=state.page==='home'?home():page();wire();}
  render();

  // Wire the always-visible quick rail too.
  const die=document.getElementById('die');
  const rollDie=document.getElementById('rollDie');
  if(rollDie&&die) rollDie.onclick=()=>{die.textContent=String(1+Math.floor(Math.random()*6));};
  const comp=document.getElementById('complication');
  const compBtn=document.getElementById('rollComplication');
  const comps=['Unwanted attention arrives.','A faction notices.','Evidence is left behind.','The position worsens.','A useful resource is lost.','A clock advances.'];
  if(compBtn&&comp) compBtn.onclick=()=>{comp.textContent=comps[Math.floor(Math.random()*comps.length)];};
  const barg=document.getElementById('bargain');
  const bargBtn=document.getElementById('rollBargain');
  const bars=['A rival learns what you are doing.','Someone innocent is put at risk.','Tick a danger clock now.','You owe an inconvenient favour.','The supernatural notices you.'];
  if(bargBtn&&barg) bargBtn.onclick=()=>{barg.textContent=bars[Math.floor(Math.random()*bars.length)];};
})();
