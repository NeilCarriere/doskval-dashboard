// High-resolution NPC/Faces artwork pass with curated portrait assignments.
(function(){
  const SPRITE='assets/npc-hires-5x4.jpg?v=20260910-curated1';
  const COLS=5, ROWS=4;
  // Coordinates refer to the 5x4 portrait sheet, left-to-right / top-to-bottom.
  // First ten NPCs map directly to the portraits created for them.
  const MAP={
    'Quellyn':[0,0],'Flint':[1,0],'Stazia':[2,0],'Malista':[3,0],'Telda':[4,0],
    'Frake':[0,1],'Fitz':[1,1],'Dowler':[2,1],'Bazso Baz':[3,1],'Mylera Klev':[4,1],
    'Lord Scurlock':[0,2],'Scurlock':[0,2],'The Spider':[1,2],
    'Lyssa':[4,1],'Roric':[1,2],'Bell':[2,1],'Pickett':[0,1],'Henner':[3,1],
    'Slate':[3,2],'Loop':[1,1],'Nessa':[4,1],'Hutch':[2,1],'Hutton':[3,1],
    'Sercy':[2,1],'Derret':[0,1],'Roslyn':[3,0],'Irelen':[2,0],'Eisele':[3,0],
    'Griggs':[1,2],'Margette Vale':[4,1],'Bear':[0,1],'Goldie':[2,0],
    'Setarra':[4,2],'Seresh':[2,2],'Tuhan':[2,1],'Ulf Ironborn':[3,1],'Havid':[0,1],
    'Commander Clelland':[4,3],'Captain Michter':[2,1],'Captain Vale':[4,3],
    'Bakoros':[3,3],'Elder Rowan':[4,3],'Preceptor Dunvil':[1,2],'Una Farros':[3,0],
    'The Tower':[0,3],'The Star':[3,3],'Grull':[2,1],
    'Laroze':[4,3],'Amancio':[2,1],'Adelaide Phroaig':[3,0],'Rigney':[1,1]
  };
  function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function coord(name){return MAP[name]||[hash(name)%COLS,Math.floor((hash(name)%20)/COLS)]}
  function make(name,hero){
    const [c,r]=coord(name),d=document.createElement('div');
    d.className=hero?'realNpcSprite realNpcHeroSprite allNpcPainted':'realNpcSprite allNpcPainted';
    d.setAttribute('role','img');
    d.setAttribute('aria-label','Campaign visualization portrait of '+name);
    d.style.backgroundImage=`url(${SPRITE})`;
    d.style.backgroundSize=`${COLS*100}% ${ROWS*100}%`;
    d.style.backgroundPosition=`${c*(100/(COLS-1))}% ${r*(100/(ROWS-1))}%`;
    d.style.backgroundRepeat='no-repeat';
    d.style.imageRendering='auto';
    const h=hash(name);
    d.style.filter=`saturate(${.90+(h%7)/100}) contrast(${1.02+(h%4)/100}) brightness(${.95+(h%5)/100})`;
    return d;
  }
  function selected(){return document.querySelector('.npcTile.selected')?.dataset?.npc||document.querySelector('.npcDetail h2')?.textContent?.trim()||''}
  function apply(){
    document.querySelectorAll('.npcTile').forEach(tile=>{
      const name=tile.dataset.npc||tile.querySelector('.npcTileText b')?.textContent?.trim(),box=tile.querySelector('.npcTilePortrait');
      if(!name||!box)return;
      if(box.dataset.hiresPainted===name)return;
      box.innerHTML='';box.appendChild(make(name,false));box.dataset.hiresPainted=name;
    });
    const name=selected(),hero=document.querySelector('.npcHeroPortrait');
    if(name&&hero&&hero.dataset.hiresPainted!==name){
      hero.innerHTML='';hero.appendChild(make(name,true));
      const lab=document.createElement('span');lab.className='vizLabel';lab.textContent='CAMPAIGN VISUALIZATION';hero.appendChild(lab);
      hero.dataset.hiresPainted=name;
    }
    document.querySelector('.npcWorkspace')?.classList.add('premiumWorkspace');
    document.querySelector('.npcGallery')?.classList.add('premiumGallery');
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  obs.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',()=>setTimeout(apply,0),true);
  setTimeout(apply,100);setTimeout(apply,500);
})();