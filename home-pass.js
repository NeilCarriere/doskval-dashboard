// Home cockpit layout matching the approved ghostly/electric dashboard direction.
(function(){
  const priorRender=window.render;
  function pipLine(filled,size){return `<span class="clock-pips">${Array.from({length:size},(_,i)=>`<i class="${i<filled?'on':''}"></i>`).join('')}</span>`}
  function rel(name){const f=(window.baseFactions||[]).find?.(x=>x.name===name); const v=(window.state?.factionStatus?.[name] ?? f?.status ?? 0); return v>0?'good':v<0?'bad':'neutral'}
  function statusText(name){const f=(window.baseFactions||[]).find?.(x=>x.name===name); const v=(window.state?.factionStatus?.[name] ?? f?.status ?? 0); return v>0?`+${v}`:String(v)}
  function homeHTML(){
    const c0=window.state?.clocks?.[0]||{name:'Grinders retaliate',size:6,filled:2};
    const c1=window.state?.clocks?.[1]||{name:'Wraith suspicion',size:4,filled:0};
    return `<div class="home-cockpit">
      <div class="home-stack">
        <section class="card"><div class="crew-overview"><div class="crew-hood" aria-hidden="true"></div><div class="crew-meta"><p class="eyebrow">THE SNEAKS</p><h3>Cutthroats · Opportunists · Survivors</h3><p><b>Tier:</b> II</p><p><b>Hold:</b> Limited</p><p><b>Reputation:</b> Dangerous</p><p><b>Playbook:</b> Shadows</p><p><b>Base:</b> Campaign-defined</p><div class="home-mini-actions"><button data-page="crew">View Crew</button><button data-page="notes">Session Notes</button></div></div></div></section>
        <section class="card"><h3>Active Crew Clocks</h3><div class="clock-row"><span>${esc(c0.name)}</span>${pipLine(c0.filled,c0.size)}</div><div class="clock-row"><span>${esc(c1.name)}</span>${pipLine(c1.filled,c1.size)}</div><div class="clock-row"><span>Next major score</span>${pipLine(2,6)}</div><div class="home-mini-actions"><button data-page="clocks">Open All Clocks</button></div></section>
        <section class="card"><h3>Recent Events</h3><div class="events-list"><div class="event-line"><time>Sep 8</time><span>Paid Wraith tribute in Nightmarket.</span></div><div class="event-line"><time>Sep 5</time><span>Gray Cloaks continue to favor The Sneaks; exact character-creation reason remains intentionally undefined.</span></div><div class="event-line"><time>Sep 3</time><span>Nightmarket remains an important operating ground.</span></div><div class="event-line"><time>Aug 31</time><span>Spirit Wardens remain a pressure worth watching.</span></div></div></section>
      </div>
      <div class="home-stack">
        <section class="card home-faction-card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center"><div><p class="eyebrow">LIVE CITY PRESSURE</p><h3>Faction Web</h3></div><button data-page="factionweb">Open Full Web</button></div><div class="home-faction-stage"><div class="home-faction-center"><div>${hoodIcon?hoodIcon():''}<b>THE SNEAKS</b></div></div><div class="home-node n1 ${rel('The Lampblacks')}"><b>The Lampblacks</b><small>${statusText('The Lampblacks')}</small></div><div class="home-node n2 ${rel('The Dimmer Sisters')}"><b>The Dimmer Sisters</b><small>${statusText('The Dimmer Sisters')}</small></div><div class="home-node n3 ${rel('The Wraiths')}"><b>The Wraiths</b><small>${statusText('The Wraiths')}</small></div><div class="home-node n4 ${rel('The Red Sashes')}"><b>The Red Sashes</b><small>${statusText('The Red Sashes')}</small></div><div class="home-node n5 ${rel('The Hive')}"><b>The Hive</b><small>${statusText('The Hive')}</small></div><div class="home-node n6 ${rel('The Crows')}"><b>The Crows</b><small>${statusText('The Crows')}</small></div><div class="home-node n7 ${rel('Gray Cloaks')}"><b>Gray Cloaks</b><small>${statusText('Gray Cloaks')}</small></div><div class="home-node n8 ${rel('The Grinders')}"><b>The Grinders</b><small>${statusText('The Grinders')}</small></div></div></section>
        <section class="card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center"><h3>Doskvol Districts</h3><button data-page="locations">View All</button></div><div class="district-strip"><div class="district-tile"><b>⚓ The Docks</b><span>Labour, trade, sailors, warehouses, violence.</span></div><div class="district-tile"><b>☾ Nightmarket</b><span>Rare goods, rail trade, illicit and arcane commerce.</span></div><div class="district-tile"><b>♜ Six Towers</b><span>Faded nobility, haunted estates, Quellyn’s cottage.</span></div><div class="district-tile"><b>⚙ Coalridge</b><span>Factories, soot, labour unrest, industrial pressure.</span></div></div></section>
        <div class="home-bottom"><section class="card checklist"><h3>Next Session</h3><label><input type="checkbox"> Resolve current score fallout</label><label><input type="checkbox"> Advance relevant faction clocks</label><label><input type="checkbox"> Run downtime actions</label><label><input type="checkbox"> Update faction relationships</label><label><input type="checkbox"> Prep one strong opportunity</label></section><section class="card gm-notes"><h3>GM Notes</h3><p>Follow up with Quellyn in Six Towers.</p><p>Keep Wraith tribute arrangement visible.</p><p>Remember the Grinders have cause to be angry.</p><p>Use published canon as the baseline; campaign events override it.</p><div class="home-mini-actions"><button data-page="notes">Open Notes</button><button data-page="lore">Canon & Lore</button></div></section></div>
      </div>
    </div>`;
  }
  window.render=function(){
    if(window.state?.page!=='home'){return priorRender();}
    renderNav();
    document.querySelector('#main').innerHTML=homeHTML();
    document.querySelectorAll('#main [data-page]').forEach(b=>b.onclick=()=>{state.page=b.dataset.page;render();});
  };
})();
