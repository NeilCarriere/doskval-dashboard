// Faction intelligence desk: illustrated emblems, focused relationship web, and usable ledger.
(function(){
  const DATA=window.FACTION_ICON_DATA||{};
  const E=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const CAMPAIGN=['The Crows','The Lampblacks','The Red Sashes','The Wraiths','Gray Cloaks','The Grinders','The Dimmer Sisters','The Hive','The Silver Nails','Spirit Wardens','Bluecoats','Lord Scurlock'];
  const ICONS={
    'The Crows':'crow','The Lampblacks':'oilCan','The Red Sashes':'khanda','The Wraiths':'maskFace','Gray Cloaks':'userSecret','The Grinders':'gear','The Dimmer Sisters':'houseChimneyCrack','The Hive':'bug','The Silver Nails':'hammer','Bluecoats':'shieldHalved','Inspectors':'eye','Spirit Wardens':'maskFace','Church of Ecstasy':'church','Billhooks':'khanda','The Billhooks':'khanda','Gondoliers':'water','The Unseen':'userSecret','The Circle of Flame':'fireFlameCurved','Lord Scurlock':'skull','The Fog Hounds':'dog','The Lost':'handFist','Ulf Ironborn':'hammer','Imperial Military':'helmetSafety','City Council':'buildingColumns','Leviathan Hunters':'fish','Ministry of Preservation':'train','Ironhook Prison':'dungeon','Sparkwrights':'bolt','Iruvian Consulate':'landmark','Skovlan Consulate':'landmark','The Brigade':'fireExtinguisher','Dagger Isles Consulate':'passport','Severosi Consulate':'horseHead','The Foundation':'bridge','Dockers':'anchor','Laborers':'hammer','Sailors':'ship','Cabbies':'horseHead','Cyphers':'envelope','Ink Rakes':'newspaper','Rail Jacks':'train','Servants':'key','The Forgotten Gods':'handsPraying','The Horde':'peopleGroup','The Path of Echoes':'ghost','The Reconciled':'ghost','Skovlander Refugees':'peopleGroup','Deathlands Scavengers':'roadBarrier','The Weeping Lady':'water','Covenant':'crown','Unity Commission':'handshake','Rowan House':'landmark','Ironworks Labor':'industry','Ragskulla':'skullCrossbones'
  };
  let webMode='campaign', webFocus='The Sneaks', edgePair=['The Sneaks','The Crows'], ledgerSelected='The Crows', ledgerSearch='', ledgerCategory='All', ledgerTab='info';
  const byName=n=>factions.find(f=>f.name===n);
  const loreFor=f=>f?.lore||{summary:f?.canon||'No dossier is available yet.',npcs:[],allies:[],enemies:[],clocks:[]};
  const sourceFor=f=>f?.source||(f?.lore?'Core Book + Deep Cuts':'Core Book');
  const categoryFor=f=>f?.lore?.category||f?.category||'Other';
  const stand=f=>state.factionStatus[f.name]??f.crew??0;
  const standWord=v=>v>=3?'Allied':v===2?'Friendly':v===1?'Helpful':v===0?'Neutral':v===-1?'Wary':v===-2?'Hostile':'At War';
  const relClass=s=>/allied|friendly/i.test(s)?'friend':/hostile|war|enemy/i.test(s)?'enemy':/rival|wary|tense/i.test(s)?'tense':'neutral';
  function iconSVG(name,label=name){
    const d=DATA[ICONS[name]||'chessRook']||DATA.chessRook;if(!d)return `<span class="fallbackMark">${E(name.slice(0,2).toUpperCase())}</span>`;
    const paths=Array.isArray(d.p)?d.p.map(p=>`<path d="${p}"></path>`).join(''):`<path d="${d.p}"></path>`;
    return `<svg class="factionIcon" viewBox="0 0 ${d.w} ${d.h}" role="img" aria-label="${E(label)} emblem">${paths}</svg>`;
  }
  function emblem(f,large=false){return `<span class="factionSeal ${large?'large':''} ${relClass(standWord(stand(f)))}">${iconSVG(f.name)}</span>`;}
  function relation(a,b){
    if(a==='The Sneaks'||b==='The Sneaks'){const n=a==='The Sneaks'?b:a,f=byName(n),v=f?stand(f):0;return {status:standWord(v),why:f?.campaign||'No campaign event has defined this relationship yet.'};}
    try{return getRel(a,b)||{status:'unknown',why:'No relationship recorded.'};}catch{return {status:'unknown',why:'No relationship recorded.'};}
  }
  function relationLine(a,b,pa,pb){const r=relation(a,b),c=relClass(r.status);return `<g class="factionEdge" data-a="${E(a)}" data-b="${E(b)}"><line class="edgeHit" x1="${pa.x}" y1="${pa.y}" x2="${pb.x}" y2="${pb.y}"></line><line class="edgeLine ${c}" x1="${pa.x}" y1="${pa.y}" x2="${pb.x}" y2="${pb.y}"></line></g>`;}
  function relatedNames(name){
    if(name==='The Sneaks')return CAMPAIGN.filter(byName);
    const f=byName(name),d=loreFor(f),first=[...(d.allies||[]),...(d.enemies||[])].filter(byName),pool=(webMode==='campaign'?CAMPAIGN:factions.map(x=>x.name)).filter(n=>n!==name&&byName(n));
    return [...new Set([...first,...pool])].slice(0,webMode==='campaign'?11:13);
  }
  function nodeHTML(name,p,center=false){
    if(name==='The Sneaks')return `<button class="factionNode center sneaks" style="--x:${p.x}%;--y:${p.y}%" data-focus="The Sneaks">${hood}<b>THE SNEAKS</b><small>CAMPAIGN CENTRE</small></button>`;
    const f=byName(name),v=stand(f);return `<button class="factionNode ${center?'center':''} ${relClass(standWord(v))}" style="--x:${p.x}%;--y:${p.y}%" data-focus="${E(name)}">${emblem(f,center)}<b>${E(name)}</b><small>TIER ${E(f.tier)} · ${E(standWord(v))}</small></button>`;
  }
  function networkHTML(){
    const outer=relatedNames(webFocus),center={x:50,y:50},pos=outer.map((_,i)=>{const a=(Math.PI*2*i/outer.length)-Math.PI/2,r=outer.length>11?42:39;return{x:50+r*Math.cos(a),y:50+r*Math.sin(a)}}),points=Object.fromEntries(outer.map((n,i)=>[n,pos[i]]));points[webFocus]=center;
    let lines=outer.map(n=>relationLine(webFocus,n,center,points[n]));
    for(let i=0;i<outer.length;i++)for(let j=i+1;j<outer.length;j++){const r=relation(outer[i],outer[j]);if(relClass(r.status)!=='neutral')lines.push(relationLine(outer[i],outer[j],points[outer[i]],points[outer[j]]));}
    return `<div class="factionMapStage"><svg class="factionLines" viewBox="0 0 100 100" preserveAspectRatio="none">${lines.join('')}</svg>${nodeHTML(webFocus,center,true)}${outer.map((n,i)=>nodeHTML(n,pos[i])).join('')}<div class="mapLegend"><span class="friend">ALLY</span><span class="tense">TENSE</span><span class="enemy">HOSTILE</span><span class="neutral">UNKNOWN</span></div></div>`;
  }
  function chips(names,cls){return names?.length?`<div class="factionChips">${names.filter(byName).map(n=>`<button class="${cls}" data-focus="${E(n)}">${iconSVG(n)}<span>${E(n)}</span></button>`).join('')}</div>`:'<p class="emptyIntel">None recorded.</p>';}
  function clockRows(f){const d=loreFor(f),named=(d.clocks||[]);return named.length?named.map(c=>`<div class="publishedClock"><span class="clockRune">◷</span><p><b>${E(c)}</b><small>Published faction objective</small></p></div>`).join(''):'<p class="emptyIntel">No published clock is listed in this dossier.</p>';}
  function inspectorHTML(name){
    if(name==='The Sneaks')return `<aside class="factionInspector"><div class="inspectorTop sneaksTop">${hood}<div><small>CAMPAIGN CENTRE</small><h2>The Sneaks</h2><p>Shadows in a city that remembers.</p></div></div><div class="campaignBrief"><b>CURRENT PRESSURE</b><p>Gray Cloaks favourable · Wraith tribute paid · Grinders hostile · Quellyn trusted.</p></div><p>Select a faction emblem to redraw the web around that faction and inspect its published relationships.</p></aside>`;
    const f=byName(name),d=loreFor(f),v=stand(f);return `<aside class="factionInspector"><div class="inspectorTop">${emblem(f,true)}<div><small>${E(sourceFor(f))}</small><h2>${E(f.name)}</h2><p>${E(categoryFor(f))}</p></div></div><div class="tierStrip"><span>TIER <b>${E(f.tier)}</b></span><span>${E(f.hold)} HOLD</span><span class="${relClass(standWord(v))}">${E(standWord(v))} ${v>0?'+':''}${v}</span></div><p class="factionSummary">${E(d.summary||f.canon)}</p>${f.campaign?`<div class="campaignBrief"><b>SNEAKS CAMPAIGN</b><p>${E(f.campaign)}</p></div>`:''}<h3>IMPORTANT FACES</h3>${d.npcs?.length?d.npcs.map(n=>`<p class="faceLine"><b>${E(n[0])}</b> — ${E(n[1])}</p>`).join(''):'<p class="emptyIntel">No named leader is included in the current source notes.</p>'}<h3>ALLIES</h3>${chips(d.allies,'friend')}<h3>ENEMIES</h3>${chips(d.enemies,'enemy')}<h3>ACTIVE PURPOSE</h3>${clockRows(f)}<div class="inspectorActions"><button data-ledger="${E(f.name)}">OPEN LEDGER DOSSIER</button><button data-fnotes="${E(f.name)}">CAMPAIGN NOTES</button><button class="addFactionClock" data-faction="${E(f.name)}">ADD CAMPAIGN CLOCK</button></div></aside>`;
  }
  function editorHTML(){const [a,b]=edgePair,r=relation(a,b);return `<section class="relationStrip"><div><small>SELECTED CONNECTION</small><h3>${E(a)} <span>↔</span> ${E(b)}</h3><p>${E(r.status)} — ${E(r.why)}</p></div><button class="editRelation">EDIT RELATIONSHIP</button></section>`;}
  function renderFactionWeb(){
    const main=document.getElementById('main');if(!main)return;main.classList.add('factionMode');
    main.innerHTML=`<div class="factionPageHead"><div><p>THE CITY IS A KNOT OF KNIVES</p><h1>Faction Web</h1><span>Tap a seal to pull that faction—and everyone tied to it—into focus.</span></div><div class="webControls"><button data-webmode="campaign" class="${webMode==='campaign'?'active':''}">CAMPAIGN WEB</button><button data-webmode="city" class="${webMode==='city'?'active':''}">WHOLE CITY</button><select id="factionJump" aria-label="Focus faction"><option value="The Sneaks">The Sneaks</option>${factions.map(f=>`<option ${f.name===webFocus?'selected':''}>${E(f.name)}</option>`).join('')}</select></div></div><div class="factionWebLayout"><section class="factionMap panel">${networkHTML()}</section>${inspectorHTML(webFocus)}</div>${editorHTML()}`;
    bindFactionUI();
  }
  function relationPips(v){return `<div class="standingPips" aria-label="Standing ${v}">${[-3,-2,-1,0,1,2,3].map(n=>`<i class="${n===v?'on '+relClass(standWord(v)):''}"></i>`).join('')}</div>`;}
  function ledgerCard(f){const d=loreFor(f),v=stand(f),hasNote=Boolean(state.factionNotes?.[f.name]?.trim());return `<button class="ledgerCard ${f.name===ledgerSelected?'selected':''}" data-ledger="${E(f.name)}"><div class="ledgerCardTop">${emblem(f)}<div><small>${E(sourceFor(f))}${hasNote?' · CAMPAIGN NOTE':''}</small><h2>${E(f.name)}</h2><p>Tier ${E(f.tier)} · ${E(f.hold)} hold</p></div></div><p>${E(d.summary||f.canon)}</p><div class="ledgerFoot"><span class="${relClass(standWord(v))}">${E(standWord(v))}</span>${relationPips(v)}</div></button>`;}
  function ledgerDossier(f){
    const d=loreFor(f),v=stand(f),note=state.factionNotes?.[f.name]||'',hasNote=Boolean(note.trim());
    const info=`<div class="dossierPane"><p>${E(d.summary||f.canon)}</p>${f.campaign?`<div class="campaignBrief"><b>SNEAKS CAMPAIGN</b><p>${E(f.campaign)}</p></div>`:''}<div class="standingEditor"><label>STANDING WITH THE SNEAKS</label><div><button data-fdelta="-1" aria-label="Reduce standing">−</button><b class="${relClass(standWord(v))}">${E(standWord(v))} ${v>0?'+':''}${v}</b><button data-fdelta="1" aria-label="Increase standing">+</button></div></div><h3>IMPORTANT FACES</h3>${d.npcs?.length?d.npcs.map(n=>`<p class="faceLine"><b>${E(n[0])}</b> — ${E(n[1])}</p>`).join(''):'<p class="emptyIntel">No named faces in the current source notes.</p>'}<h3>ALLIES</h3>${chips(d.allies,'friend')}<h3>ENEMIES</h3>${chips(d.enemies,'enemy')}<h3>FACTION CLOCKS</h3>${clockRows(f)}<div class="inspectorActions"><button data-focus="${E(f.name)}">OPEN IN FACTION WEB</button><button class="addFactionClock" data-faction="${E(f.name)}">ADD CAMPAIGN CLOCK</button></div></div>`;
    const notes=`<div class="dossierPane factionNotesPane"><label for="factionNotes">WHAT CHANGED—AND WHY?</label><p>Record encounters, favours, insults, betrayals and anything else that should affect this faction’s opinion of The Sneaks.</p><textarea id="factionNotes" data-faction="${E(f.name)}" placeholder="Example: The Sneaks embarrassed the Crows during the Nightmarket score…">${E(note)}</textarea><div class="noteSaveState"><span>●</span> SAVES AUTOMATICALLY</div><div class="notePrompt"><b>USEFUL THINGS TO RECORD</b><span>What the crew did</span><span>Who witnessed it</span><span>How the faction responded</span><span>Why their standing changed</span></div></div>`;
    return `<aside class="ledgerDossier">${emblem(f,true)}<small>${E(sourceFor(f))} · ${E(categoryFor(f))}</small><h2>${E(f.name)}</h2><div class="tierStrip"><span>TIER <b>${E(f.tier)}</b></span><span>${E(f.hold)} HOLD</span></div><div class="dossierTabs" role="tablist"><button data-ftab="info" class="${ledgerTab==='info'?'active':''}">DOSSIER</button><button data-ftab="notes" class="${ledgerTab==='notes'?'active':''}">CAMPAIGN NOTES${hasNote?' ●':''}</button></div>${ledgerTab==='notes'?notes:info}</aside>`;
  }
  function renderFactionLedger(){
    const cats=['All',...new Set(factions.map(categoryFor))],shown=factions.filter(f=>(ledgerCategory==='All'||categoryFor(f)===ledgerCategory)&&(!ledgerSearch||(f.name+' '+loreFor(f).summary+' '+categoryFor(f)).toLowerCase().includes(ledgerSearch.toLowerCase()))),f=byName(ledgerSelected)||shown[0]||factions[0];
    const main=document.getElementById('main');if(!main)return;main.classList.add('factionMode');main.innerHTML=`<div class="factionPageHead ledgerHead"><div><p>INTELLIGENCE, LEVERAGE, CONSEQUENCE</p><h1>Faction Ledger</h1><span>Published lore and Sneaks campaign changes remain visibly separate.</span></div><div class="ledgerTools"><input id="ledgerSearch" value="${E(ledgerSearch)}" placeholder="Search factions…"><select id="ledgerCategory">${cats.map(c=>`<option ${c===ledgerCategory?'selected':''}>${E(c)}</option>`).join('')}</select></div></div><div class="factionLedgerLayout">${ledgerDossier(f)}<section class="ledgerGrid" aria-label="Faction dossiers">${shown.map(ledgerCard).join('')||'<p class="emptyIntel">No factions match this search.</p>'}</section></div>`;bindFactionUI();
  }
  function editRelationship(){const [oldA,oldB]=edgePair,a=prompt('First faction or The Sneaks:',oldA);if(!a)return;const b=prompt('Second faction:',oldB);if(!b||a===b)return;const current=relation(a,b),status=prompt('Relationship: allied, friendly, neutral, rival, hostile, or war',current.status)||current.status,why=prompt('Why?',current.why)||current.why;if(a==='The Sneaks'||b==='The Sneaks'){const n=a==='The Sneaks'?b:a,f=byName(n),map={allied:3,friendly:2,helpful:1,neutral:0,wary:-1,rival:-1,hostile:-2,war:-3};if(f)state.factionStatus[f.name]=map[String(status).toLowerCase()]??stand(f);}else state.rels[relationKey(a,b)]={status,why};save();edgePair=[a,b];renderFactionWeb();}
  function addClock(name){const label=prompt('Clock name:',`${name}: make a move`);if(!label)return;let size=+(prompt('Segments: 4, 6, or 8?','6')||6);if(![4,6,8].includes(size))size=6;state.clocks.push({name:label,size,filled:0,faction:name});save();alert(`Added ${size}-segment clock: ${label}`);}
  function bindFactionUI(){
    document.querySelectorAll('[data-webmode]').forEach(b=>b.onclick=()=>{webMode=b.dataset.webmode;renderFactionWeb()});
    document.querySelector('#factionJump')?.addEventListener('change',e=>{webFocus=e.target.value;renderFactionWeb()});
    document.querySelectorAll('.factionNode[data-focus],.factionChips [data-focus]').forEach(b=>b.onclick=()=>{webFocus=b.dataset.focus;state.page='web';save();renderFactionWeb()});
    document.querySelectorAll('.factionEdge').forEach(g=>g.onclick=()=>{edgePair=[g.dataset.a,g.dataset.b];document.querySelector('.relationStrip')?.scrollIntoView({behavior:'smooth',block:'nearest'});document.querySelector('.relationStrip').outerHTML=editorHTML();document.querySelector('.editRelation').onclick=editRelationship;});
    document.querySelector('.editRelation')?.addEventListener('click',editRelationship);
    document.querySelectorAll('[data-ledger]').forEach(b=>b.onclick=()=>{ledgerSelected=b.dataset.ledger;ledgerTab='info';state.page='factions';save();renderFactionLedger()});
    document.querySelectorAll('[data-fnotes]').forEach(b=>b.onclick=()=>{ledgerSelected=b.dataset.fnotes;ledgerTab='notes';state.page='factions';save();renderFactionLedger()});
    document.querySelectorAll('[data-ftab]').forEach(b=>b.onclick=()=>{ledgerTab=b.dataset.ftab;renderFactionLedger()});
    document.querySelector('#ledgerSearch')?.addEventListener('input',e=>{ledgerSearch=e.target.value;renderFactionLedger();const q=document.querySelector('#ledgerSearch');q?.focus();q?.setSelectionRange(ledgerSearch.length,ledgerSearch.length)});
    document.querySelector('#ledgerCategory')?.addEventListener('change',e=>{ledgerCategory=e.target.value;renderFactionLedger()});
    document.querySelectorAll('[data-fdelta]').forEach(b=>b.onclick=()=>{const f=byName(ledgerSelected),next=Math.max(-3,Math.min(3,stand(f)+Number(b.dataset.fdelta)));state.factionStatus[f.name]=next;save();renderFactionLedger()});
    document.querySelector('#factionNotes')?.addEventListener('input',e=>{
      state.factionNotes=state.factionNotes||{};state.factionNotes[e.target.dataset.faction]=e.target.value;save();
      const status=document.querySelector('.noteSaveState');if(!status)return;status.classList.add('saved');status.innerHTML='<span>●</span> SAVED';clearTimeout(status._timer);status._timer=setTimeout(()=>{status.classList.remove('saved');status.innerHTML='<span>●</span> SAVES AUTOMATICALLY';},900);
    });
    document.querySelectorAll('.addFactionClock').forEach(b=>b.onclick=()=>addClock(b.dataset.faction));
    document.querySelectorAll('.ledgerDossier [data-focus]').forEach(b=>b.onclick=()=>{webFocus=b.dataset.focus;state.page='web';save();render();});
  }
  const previous=window.render;
  window.render=function(){previous();const main=document.getElementById('main');main?.classList.toggle('factionMode',state.page==='factions'||state.page==='web');if(state.page==='web')renderFactionWeb();if(state.page==='factions')renderFactionLedger();};
  if(state.page==='web')renderFactionWeb();if(state.page==='factions')renderFactionLedger();
})();
