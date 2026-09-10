// Painterly portrait upgrade for NPC gallery. Visual-only and deliberately isolated from NPC data/rendering.
(function(){
  const hash=s=>[...String(s||'')].reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,2166136261)>>>0;
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function personName(el){
    const tile=el.closest('.npcTile'); if(tile?.dataset.npc)return tile.dataset.npc;
    const detail=el.closest('.npcDetail'); const h=detail?.querySelector('h2'); if(h)return h.textContent.trim();
    return 'Doskvol NPC';
  }
  function portraitSVG(name){
    const h=hash(name), id='r'+h;
    const skins=['#d0ae91','#b98569','#c99f82','#91654f','#d8b698','#a8765f','#c18c70'];
    const shadows=['#7d513f','#6b4436','#77503e','#53382f','#805845','#604137','#71493b'];
    const lights=['#efd3b7','#e2b89b','#e8c3a6','#bd9075','#f0ceb0','#cca087','#ddb092'];
    const hairs=['#151413','#241b17','#33251c','#0f1517','#4b3a2c','#1b171c','#2c2c2a'];
    const coats=['#17262a','#1c2028','#29221f','#131d22','#23272b','#21191e','#182922'];
    const accents=['#62cfc0','#5e89a4','#8b6f5a','#697f73','#4d9d91','#766f88'];
    const skin=skins[h%skins.length], shadow=shadows[(h>>3)%shadows.length], light=lights[(h>>6)%lights.length];
    const hair=hairs[(h>>9)%hairs.length], coat=coats[(h>>12)%coats.length], accent=accents[(h>>15)%accents.length];
    const jaw=(h>>18)%3, hairStyle=(h>>20)%6, facial=(h>>23)%5, sex=(h>>27)%2;
    const facePath=jaw===0?'M31 27 Q50 17 69 27 L71 54 Q68 75 50 81 Q32 75 29 54 Z':jaw===1?'M30 28 Q50 16 70 28 L68 60 Q64 78 50 83 Q36 78 32 60 Z':'M32 25 Q50 18 68 25 L72 50 Q68 70 60 79 Q50 86 40 79 Q32 70 28 50 Z';
    const hairPaths=[
      `M27 37Q29 14 50 13Q74 14 74 39Q64 27 49 28Q36 27 27 37Z`,
      `M25 42Q27 13 51 12Q76 15 76 45Q67 30 58 27Q50 34 38 28Q31 32 25 42Z M24 37Q19 64 29 78L32 48Z M76 38Q81 65 70 79L68 47Z`,
      `M29 31Q38 15 51 15Q67 15 72 32Q61 24 50 25Q39 24 29 31Z`,
      `M26 42Q27 12 50 12Q77 13 76 45Q66 31 53 27L46 39L40 27Q31 31 26 42Z`,
      `M30 29Q38 16 50 16Q63 16 70 30Q59 25 50 26Q40 25 30 29Z M31 63Q50 83 69 63Q66 84 50 88Q34 84 31 63Z`,
      `M25 41Q28 13 49 12Q73 12 77 41Q68 28 59 24L54 38L48 23L40 39L35 25Q28 30 25 41Z`
    ];
    const hairArt=`<path d="${hairPaths[hairStyle]}" fill="${hair}"/>`;
    const beard=facial===0?'':facial===1?`<path d="M33 60Q50 83 67 60Q64 83 50 88Q36 83 33 60Z" fill="${hair}" opacity=".88"/>`:facial===2?`<path d="M39 62Q50 68 61 62Q58 71 50 72Q42 71 39 62Z" fill="${hair}"/>`:facial===3?`<path d="M32 61Q50 79 68 61" stroke="${hair}" stroke-width="6" fill="none" stroke-linecap="round"/>`:'';
    const adorn=(h%7===0)?`<path d="M69 43q8 5 12-2" stroke="${accent}" stroke-width="2" fill="none"/><circle cx="81" cy="41" r="2.4" fill="${accent}"/>`:'';
    const scar=(h%5===0)?`<path d="M60 36L55 58" stroke="#7b3f40" stroke-width="1.5" opacity=".78"/>`:'';
    const femaleDetail=sex?`<path d="M39 65Q50 69 61 65" stroke="#8f545c" stroke-width="1.4" fill="none"/>`:`<path d="M40 66Q50 68 60 66" stroke="#724b45" stroke-width="1.25" fill="none"/>`;
    return `<svg class="npcPortraitArt realisticNpcPortrait" viewBox="0 0 100 120" role="img" aria-label="Campaign visualization portrait of ${esc(name)}">
      <defs>
        <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#14282d"/><stop offset=".46" stop-color="#0b1519"/><stop offset="1" stop-color="#030708"/></linearGradient>
        <linearGradient id="skin-${id}" x1=".2" y1=".05" x2=".8" y2="1"><stop stop-color="${light}"/><stop offset=".48" stop-color="${skin}"/><stop offset="1" stop-color="${shadow}"/></linearGradient>
        <linearGradient id="coat-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${coat}"/><stop offset="1" stop-color="#080d10"/></linearGradient>
        <radialGradient id="glow-${id}" cx="50%" cy="38%" r="58%"><stop stop-color="${accent}" stop-opacity=".20"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
        <filter id="paint-${id}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="${h%97}" result="noise"/><feColorMatrix in="noise" type="saturate" values="0" result="mono"/><feComponentTransfer in="mono" result="grain"><feFuncA type="table" tableValues="0 .07"/></feComponentTransfer><feBlend in="SourceGraphic" in2="grain" mode="soft-light"/></filter>
        <filter id="shadow-${id}"><feGaussianBlur stdDeviation="2.2"/></filter>
      </defs>
      <rect width="100" height="120" fill="url(#bg-${id})"/>
      <circle cx="50" cy="46" r="43" fill="url(#glow-${id})"/>
      <g opacity=".18" filter="url(#shadow-${id})"><path d="M9 119Q15 81 49 73Q86 81 92 119Z" fill="${accent}"/></g>
      <g filter="url(#paint-${id})">
        <path d="M7 120Q13 84 35 78L42 72H58L66 78Q88 84 94 120Z" fill="url(#coat-${id})"/>
        <path d="M39 75L44 69H56L61 75L57 91L50 98L43 91Z" fill="#11171a"/>
        <path d="${facePath}" fill="url(#skin-${id})"/>
        <path d="M30 47Q36 35 50 35Q64 35 70 47Q64 43 58 43Q54 43 50 46Q45 43 41 43Q35 43 30 47Z" fill="${skin}" opacity=".35"/>
        ${hairArt}
        <path d="M34 45Q40 41 46 44" stroke="#332a27" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M54 44Q61 41 66 45" stroke="#332a27" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M36 48Q41 45 46 48Q41 51 36 48Z" fill="#ece6d9"/><circle cx="41" cy="48" r="1.7" fill="#20292b"/><circle cx="41" cy="47.7" r=".6" fill="#84d8cb" opacity=".55"/>
        <path d="M54 48Q59 45 64 48Q59 51 54 48Z" fill="#ece6d9"/><circle cx="59" cy="48" r="1.7" fill="#20292b"/><circle cx="59" cy="47.7" r=".6" fill="#84d8cb" opacity=".55"/>
        <path d="M49 49Q46 58 48 60Q51 62 54 59" stroke="${shadow}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        <path d="M38 58Q50 62 62 58" stroke="${light}" stroke-width=".8" opacity=".35" fill="none"/>
        ${femaleDetail}${beard}${scar}${adorn}
        <path d="M24 113Q36 98 50 101Q64 98 78 113" stroke="${accent}" stroke-opacity=".22" fill="none"/>
      </g>
      <rect x="1.5" y="1.5" width="97" height="117" fill="none" stroke="#7fded0" stroke-opacity=".22"/>
      <path d="M4 13V4H13M87 4h9v9M4 107v9h9M87 116h9v-9" stroke="#7fded0" stroke-opacity=".28" fill="none"/>
    </svg>`;
  }
  function upgrade(root=document){
    root.querySelectorAll('.npcPortraitArt:not([data-realistic])').forEach(el=>{
      const name=personName(el); const wrap=document.createElement('div'); wrap.innerHTML=portraitSVG(name).trim(); const svg=wrap.firstElementChild; svg.dataset.realistic='1';
      if(el.classList.contains('portraitBig'))svg.classList.add('portraitBig'); el.replaceWith(svg);
    });
  }
  const obs=new MutationObserver(muts=>{for(const m of muts)for(const n of m.addedNodes)if(n.nodeType===1)upgrade(n.matches?.('.npcPortraitArt')?n.parentElement:n)});
  obs.observe(document.documentElement,{subtree:true,childList:true});
  upgrade();
})();