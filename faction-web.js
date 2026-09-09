// Faction Web extension: starting situation + campaign-editable political relationships.
// Relationship values: 2 allied, 1 friendly, 0 neutral/unknown, -1 rival, -2 hostile, -3 war.
const factionWebFactions=['The Crows','The Lampblacks','The Red Sashes','The Wraiths','The Gray Cloaks','The Grinders','The Dimmer Sisters','The Hive','The Silver Nails'];
const factionWebDefaults={
 'The Crows|The Lampblacks':{v:-1,why:'Crow’s Foot is unstable after Roric’s murder. The Lampblacks are one of the powers pressing into the vacuum.',source:'Starting situation'},
 'The Crows|The Red Sashes':{v:-1,why:'Crow’s Foot is unstable after Roric’s murder. The Red Sashes are one of the powers pressing into the vacuum.',source:'Starting situation'},
 'The Lampblacks|The Red Sashes':{v:-3,why:'Open gang war for control and survival in Crow’s Foot.',source:'Starting situation'}
};
function fwKey(a,b){return [a,b].sort().join('|')}
const fwSaved=JSON.parse(localStorage.getItem('doskvol-faction-web')||'{}');
function fwGet(a,b){if(a===b)return {v:2,why:'Same faction.',source:'—'};return fwSaved[fwKey(a,b)]||factionWebDefaults[fwKey(a,b)]||{v:0,why:'No relationship has been established in this campaign yet.',source:'Unknown / TBD'}}
function fwSave(a,b,v,why,source='Campaign'){fwSaved[fwKey(a,b)]={v,why,source};localStorage.setItem('doskvol-faction-web',JSON.stringify(fwSaved));}
function fwLabel(v){return ({'-3':'WAR','-2':'Hostile','-1':'Rival','0':'Unknown / Neutral','1':'Friendly','2':'Allied'})[v]||'Unknown'}
function fwClass(v){return v<=-2?'fw-hostile':v===-1?'fw-rival':v>=1?'fw-friendly':'fw-neutral'}
function fwRender(){
 const selected=window.fwSelected||'The Crows';
 const rels=factionWebFactions.filter(x=>x!==selected).map(other=>{const r=fwGet(selected,other);return `<button class="fw-relation ${fwClass(r.v)}" data-fw-other="${other}"><span><b>${other}</b><small>${r.source}</small></span><strong>${fwLabel(r.v)}</strong></button>`}).join('');
 const crisis=selected==='The Crows'?`<div class="fw-crisis"><b>⚠ POWER VACUUM</b><p>Roric, former boss of the Crows, is dead. Lyssa killed him and now leads the faction. The Crows are Tier II with weak hold, while the Lampblacks and Red Sashes are also Tier II with weak hold. Crow’s Foot begins as a powder keg.</p></div>`:'';
 return head('Faction Web','Who hates whom — and what happens when the balance moves')+`<div class="fw-layout"><div class="card fw-selector"><h3>Focus faction</h3><div class="fw-faction-list">${factionWebFactions.map(f=>`<button class="${f===selected?'selected':''}" data-fw-focus="${f}">${f}</button>`).join('')}</div><p class="small">Tap a faction, then tap any relationship to inspect or change it. Changes are saved on this device.</p>${crisis}</div><div class="card fw-board"><div class="fw-center">♟<b>${selected}</b><small>FOCUS</small></div><div class="fw-spokes">${rels}</div></div><div class="card fw-editor" id="fwEditor"><h3>Select a relationship</h3><p>Choose another faction to see why they stand where they do.</p></div></div><div class="rule-strip"><b>Legend:</b> <span class="fw-friendly">Allied / Friendly</span> · <span class="fw-neutral">Unknown</span> · <span class="fw-rival">Rival</span> · <span class="fw-hostile">Hostile / War</span><br><span class="small">Starting-situation entries are preloaded; everything else remains deliberately unknown until established or edited.</span></div>`;
}
function fwWire(){
 document.querySelectorAll('[data-fw-focus]').forEach(b=>b.onclick=()=>{window.fwSelected=b.dataset.fwFocus;render()});
 document.querySelectorAll('[data-fw-other]').forEach(b=>b.onclick=()=>{const a=window.fwSelected||'The Crows',o=b.dataset.fwOther,r=fwGet(a,o),ed=document.querySelector('#fwEditor');ed.innerHTML=`<h3>${a} ↔ ${o}</h3><span class="tag ${fwClass(r.v)}">${fwLabel(r.v)}</span><p>${r.why}</p><p class="small">Source: ${r.source}</p><label class="fw-label">Relationship<select id="fwValue"><option value="2">Allied</option><option value="1">Friendly</option><option value="0">Unknown / Neutral</option><option value="-1">Rival</option><option value="-2">Hostile</option><option value="-3">WAR</option></select></label><label class="fw-label">Why<textarea id="fwWhy" rows="5">${esc(r.why)}</textarea></label><button id="fwCommit" class="primary">Save relationship</button>`;document.querySelector('#fwValue').value=String(r.v);document.querySelector('#fwCommit').onclick=()=>{fwSave(a,o,Number(document.querySelector('#fwValue').value),document.querySelector('#fwWhy').value,'Campaign');render()};});
}
// Extend the existing app without replacing its campaign data.
navItems.splice(3,0,['factionweb','⌘ Faction Web']);
const fwOriginalRender=render;
render=function(){if(state.page!=='factionweb'){fwOriginalRender();return;}renderNav();document.querySelector('#main').innerHTML=fwRender();fwWire();};
