// Doskvol faction/lore extension. Loaded after app.js; campaign edits persist in localStorage.
const DDATA=window.DOSKVOL_DATA;
const factionWebFactions=['The Sneaks',...DDATA.factions.map(f=>f.name)];
const fwDefaults={};
[...DDATA.canonRelations,...DDATA.campaignRelations].forEach(r=>fwDefaults[fwKey(r.a,r.b)]={...r});
function fwKey(a,b){return [a,b].sort().join('|')}
const fwSaved=JSON.parse(localStorage.getItem('doskvol-faction-web-v2')||'{}');
function fwGet(a,b){if(a===b)return {v:2,why:'Same faction.',source:'campaign'};return fwSaved[fwKey(a,b)]||fwDefaults[fwKey(a,b)]||{v:0,why:'No relationship is established in the published starting material or current campaign notes.',source:'unknown'}}
function fwSave(a,b,v,why){fwSaved[fwKey(a,b)]={a,b,v,why,source:'campaign'};localStorage.setItem('doskvol-faction-web-v2',JSON.stringify(fwSaved));}
function fwLabel(v){return ({'-3':'WAR','-2':'Hostile','-1':'Rival','0':'Unknown / Neutral','1':'Friendly','2':'Allied'})[v]||'Unknown'}
function fwClass(v){return v<=-2?'fw-hostile':v===-1?'fw-rival':v>=1?'fw-friendly':'fw-neutral'}
function fwSourceLabel(s){return s==='campaign'?'CAMPAIGN':s==='deep'?'DEEP CUTS':s==='core'?'CORE BOOK':'UNESTABLISHED'}
function factionMeta(name){if(name==='The Sneaks')return {name,category:'Crew',source:'campaign',tier:'—',hold:'—',situation:DDATA.crew.summary};return DDATA.factions.find(f=>f.name===name)||{name,category:'Unknown',source:'core'};}
function hoodIcon(){return `<span class="hood-icon" aria-label="The Sneaks hooded figure"><span class="hood-head"></span><span class="hood-cowl"></span></span>`}
function fwRender(){
 const selected=window.fwSelected||'The Sneaks';
 const meta=factionMeta(selected);
 const search=(window.fwFilter||'').toLowerCase();
 const visible=factionWebFactions.filter(x=>x===selected||!search||x.toLowerCase().includes(search)||factionMeta(x).category.toLowerCase().includes(search));
 const rels=visible.filter(x=>x!==selected).map(other=>{const r=fwGet(selected,other);return `<button class="fw-relation ${fwClass(r.v)}" data-fw-other="${esc(other)}"><span><b>${esc(other)}</b><small>${fwSourceLabel(r.source)}</small></span><strong>${fwLabel(r.v)}</strong></button>`}).join('');
 const crisis=selected==='The Crows'?`<div class="fw-crisis"><b>⚠ LEADERSHIP CRISIS</b><p>Roric is dead. Lyssa leads, but Crow’s Foot begins unstable while the Lampblacks and Red Sashes press the vacuum. Treat this as a living starting situation, not a frozen fact.</p></div>`:'';
 return head('Faction Web','Published canon gives the starting pressure. Your campaign decides what happens next.')+`<div class="source-ribbon"><span>CORE BOOK</span><b>→</b><span>DEEP CUTS</span><b>→</b><span>THE SNEAKS CAMPAIGN</span><small>Campaign changes override published assumptions.</small></div><div class="fw-layout"><div class="card fw-selector"><h3>Focus faction</h3><input id="fwSearch" class="search" placeholder="Filter factions or categories…" value="${esc(window.fwFilter||'')}"><div class="fw-faction-list">${visible.map(f=>`<button class="${f===selected?'selected':''}" data-fw-focus="${esc(f)}">${f==='The Sneaks'?hoodIcon():''}${esc(f)}</button>`).join('')}</div><p class="small">${DDATA.factions.length} published faction entries loaded, plus The Sneaks. Tap a relationship to inspect or change it.</p>${crisis}</div><div class="card fw-board"><div class="fw-center">${selected==='The Sneaks'?hoodIcon():'♟'}<b>${esc(selected)}</b><small>${esc(meta.category)} · ${fwSourceLabel(meta.source.includes?.('deep')?'deep':meta.source.includes?.('core')?'core':meta.source)}</small></div><div class="fw-spokes">${rels||'<p class="small">No factions match this filter.</p>'}</div></div><div class="card fw-editor" id="fwEditor"><h3>${esc(selected)}</h3><p>${esc(meta.situation||'Choose a relationship to inspect the evidence behind it.')}</p><p class="small">Tier ${meta.tier??'—'} · ${meta.hold??'—'} hold · ${esc(meta.category)}</p></div></div><div class="rule-strip"><b>Legend:</b> <span class="fw-friendly">Allied / Friendly</span> · <span class="fw-neutral">Unknown</span> · <span class="fw-rival">Rival</span> · <span class="fw-hostile">Hostile / War</span><br><span class="small">Unknown means “not established,” not “definitely neutral.” This prevents the app from inventing canon.</span></div>`;
}
function fwWire(){
 const s=document.querySelector('#fwSearch'); if(s)s.oninput=()=>{window.fwFilter=s.value;render()};
 document.querySelectorAll('[data-fw-focus]').forEach(b=>b.onclick=()=>{window.fwSelected=b.dataset.fwFocus;render()});
 document.querySelectorAll('[data-fw-other]').forEach(b=>b.onclick=()=>{const a=window.fwSelected||'The Sneaks',o=b.dataset.fwOther,r=fwGet(a,o),ed=document.querySelector('#fwEditor');ed.innerHTML=`<h3>${esc(a)} ↔ ${esc(o)}</h3><span class="tag ${fwClass(r.v)}">${fwLabel(r.v)}</span><span class="source-chip source-${r.source}">${fwSourceLabel(r.source)}</span><p>${esc(r.why)}</p><label class="fw-label">Relationship<select id="fwValue"><option value="2">Allied</option><option value="1">Friendly</option><option value="0">Unknown / Neutral</option><option value="-1">Rival</option><option value="-2">Hostile</option><option value="-3">WAR</option></select></label><label class="fw-label">Campaign note / reason<textarea id="fwWhy" rows="5">${esc(r.why)}</textarea></label><button id="fwCommit" class="primary">Save as campaign canon</button>`;document.querySelector('#fwValue').value=String(r.v);document.querySelector('#fwCommit').onclick=()=>{fwSave(a,o,Number(document.querySelector('#fwValue').value),document.querySelector('#fwWhy').value);render()};});
}
function factionAtlasRender(){
 const q=(window.atlasFilter||'').toLowerCase(),cat=window.atlasCategory||'All';
 const cats=['All',...new Set(DDATA.factions.map(f=>f.category))];
 const rows=DDATA.factions.filter(f=>(cat==='All'||f.category===cat)&&(!q||[f.name,f.category,f.situation||'',f.source].join(' ').toLowerCase().includes(q)));
 return head('Faction Atlas','Core book baseline + Deep Cuts expansion, kept separate from campaign overrides')+`<div class="source-ribbon"><span>CORE BOOK</span><b>+</b><span>DEEP CUTS LORE</span><b>+</b><span>CAMPAIGN OVERRIDES</span><small>Alternate Deep Cuts rules are intentionally not enabled here.</small></div><div class="atlas-tools"><input id="atlasSearch" class="search" placeholder="Search factions…" value="${esc(window.atlasFilter||'')}"><select id="atlasCategory">${cats.map(c=>`<option ${c===cat?'selected':''}>${esc(c)}</option>`).join('')}</select></div><div class="faction-atlas">${rows.map(f=>`<article class="card atlas-card"><div class="atlas-top"><h3>${esc(f.name)}</h3><span class="source-chip source-${f.source.includes('deep')?'deep':'core'}">${f.source==='core+deep'?'CORE + DEEP CUTS':fwSourceLabel(f.source)}</span></div><p class="small">Tier ${f.tier} · ${esc(f.hold)} hold · ${esc(f.category)}</p>${f.situation?`<p>${esc(f.situation)}</p>`:'<p class="small">Full published faction entry available as reference; campaign state not yet altered.</p>'}<button class="ghost-btn" data-atlas-focus="${esc(f.name)}">Open in faction web</button></article>`).join('')}</div>`;
}
function factionAtlasWire(){
 const s=document.querySelector('#atlasSearch'),c=document.querySelector('#atlasCategory'); if(s)s.oninput=()=>{window.atlasFilter=s.value;render()}; if(c)c.onchange=()=>{window.atlasCategory=c.value;render()}; document.querySelectorAll('[data-atlas-focus]').forEach(b=>b.onclick=()=>{window.fwSelected=b.dataset.atlasFocus;state.page='factionweb';render()});
}
function loreRender(){return head('Canon Layers','What the app knows — and which source wins when they disagree')+`<div class="lore-layer-grid">${DDATA.loreLayers.map((x,i)=>`<div class="card lore-layer"><div class="layer-number">0${i+1}</div><h3>${x.title}</h3><p>${x.rule}</p></div>`).join('')}</div><div class="card"><h3>Deep Cuts scope enabled</h3><p><b>Lore/factions:</b> enabled. <b>Catalysts:</b> tracked as optional world-state material. <b>Alternate Harm, Advancement, Downtime, Load, and Action rules:</b> not enabled yet.</p></div><div class="card"><h3>Known campaign canon</h3><p><b>Quellyn:</b> Six Towers cottage, low stone fence, fungus-heavy magically sustained garden, drying herbs inside.</p><p><b>Gray Cloaks:</b> favor The Sneaks; exact character-creation reason intentionally unknown.</p><p><b>Wraiths:</b> Nightmarket hunting ground; tribute paid faithfully.</p><p><b>Grinders:</b> angry after being stolen from.</p></div>`}
if(!navItems.some(x=>x[0]==='factionweb')) navItems.splice(3,0,['factionweb','⌘ Faction Web']);
if(!navItems.some(x=>x[0]==='lore')) navItems.splice(5,0,['lore','✦ Canon & Lore']);
const originalRender=render;
render=function(){
 if(state.page==='factionweb'){renderNav();document.querySelector('#main').innerHTML=fwRender();fwWire();return;}
 if(state.page==='factions'){renderNav();document.querySelector('#main').innerHTML=factionAtlasRender();factionAtlasWire();return;}
 if(state.page==='lore'){renderNav();document.querySelector('#main').innerHTML=loreRender();return;}
 originalRender();
};
