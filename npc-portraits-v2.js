// Doskval NPC portraits v5 — strict one-to-one mapping across all 49 gallery NPCs.
(function(){
  const SPRITE='assets/07B9A96D-9860-4F29-8214-BB3FD57D9947.png?v=master49c';
  const COLS=7;
  const NAMES=[
    'Quellyn','Flint','Stazia','Malista','Telda','Frake','Fitz',
    'Dowler','Laroze','Amancio','Adelaide Phroaig','Rigney','Lyssa','Roric',
    'Bell','Bazso Baz','Pickett','Henner','Mylera Klev','Slate','Loop',
    'Nessa','Hutch','Hutton','Sercy','Derret','Roslyn','Irelen',
    'Eisele','Griggs','Margette Vale','Bear','Goldie','Lord Scurlock','Setarra',
    'Seresh','Tuhan','Ulf Ironborn','Havid','Commander Clelland','Captain Michter','Captain Vale',
    'Bakoros','Elder Rowan','Preceptor Dunvil','Una Farros','The Tower','The Star','Grull'
  ];
  const CELL=Object.fromEntries(NAMES.map((name,i)=>[name,i+1]));
  CELL['Scurlock']=CELL['Lord Scurlock'];
  const used=NAMES.map(n=>CELL[n]);
  if(new Set(used).size!==49) console.error('NPC portrait map contains duplicate cells');
  function cellToCoord(n){const z=n-1;return [z%COLS,Math.floor(z/COLS)]}
  function make(name,hero){
    const n=CELL[name];
    const [c,r]=cellToCoord(n||1),d=document.createElement('div');
    d.className=hero?'realNpcSprite realNpcHeroSprite allNpcPainted':'realNpcSprite allNpcPainted';
    d.setAttribute('role','img');
    d.setAttribute('aria-label','Campaign visualization portrait of '+name);
    d.style.backgroundImage=`url(${SPRITE})`;
    d.style.backgroundSize='700% 700%';
    d.style.backgroundPosition=`${c*(100/6)}% ${r*(100/6)}%`;
    d.style.backgroundRepeat='no-repeat';
    d.style.imageRendering='auto';
    d.style.transform='scale(1.08)';
    d.style.transformOrigin='50% 42%';
    return d;
  }
  function selected(){return document.querySelector('.npcTile.selected')?.dataset?.npc||document.querySelector('.npcDetail h2')?.textContent?.trim()||''}
  function apply(){
    document.querySelectorAll('.npcTile').forEach(tile=>{
      const name=tile.dataset.npc||tile.querySelector('.npcTileText b')?.textContent?.trim(),box=tile.querySelector('.npcTilePortrait');
      if(!name||!box)return;
      if(box.dataset.portraitV5===name)return;
      box.innerHTML='';box.appendChild(make(name,false));box.dataset.portraitV5=name;
    });
    const name=selected(),hero=document.querySelector('.npcHeroPortrait');
    if(name&&hero&&hero.dataset.portraitV5!==name){
      hero.innerHTML='';hero.appendChild(make(name,true));
      const lab=document.createElement('span');lab.className='vizLabel';lab.textContent='CAMPAIGN VISUALIZATION';hero.appendChild(lab);
      hero.dataset.portraitV5=name;
    }
    document.querySelector('.npcWorkspace')?.classList.add('premiumWorkspace');
    document.querySelector('.npcGallery')?.classList.add('premiumGallery');
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  obs.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',()=>setTimeout(apply,0),true);
  setTimeout(apply,50);setTimeout(apply,300);setTimeout(apply,900);
})();