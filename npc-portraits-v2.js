// Doskval NPC portraits v3 — one unique portrait per NPC from the 7x7 master sheet.
(function(){
  const SPRITE='assets/07B9A96D-9860-4F29-8214-BB3FD57D9947.png?v=master49a';
  const COLS=7, ROWS=7;
  const NAMES=[
    'Quellyn','Flint','Stazia','Malista','Telda','Frake','Fitz',
    'Dowler','Bazso Baz','Mylera Klev','Lord Scurlock','The Spider','Lyssa','Roric',
    'Bell','Slate','Loop','Nessa','Hutch','Hutton','Sercy','Derret','Roslyn','Irelen','Eisele','Griggs','Margette Vale','Bear','Goldie','Setarra','Seresh','Tuhan','Ulf Ironborn','Havid','Commander Clelland','Captain Michter','Captain Vale','Bakoros','Elder Rowan','Preceptor Dunvil','Una Farros','The Tower','The Star','Grull','Laroze','Amancio','Adelaide Phroaig','Rigney','Pickett','Henner'
  ];
  const MAP=Object.fromEntries(NAMES.map((name,i)=>[name,[i%COLS,Math.floor(i/COLS)]]));
  // Alias used elsewhere in the app.
  MAP['Scurlock']=MAP['Lord Scurlock'];
  function make(name,hero){
    const [c,r]=MAP[name]||[0,0];
    const d=document.createElement('div');
    d.className=hero?'realNpcSprite realNpcHeroSprite allNpcPainted':'realNpcSprite allNpcPainted';
    d.setAttribute('role','img');
    d.setAttribute('aria-label','Campaign visualization portrait of '+name);
    d.style.backgroundImage=`url(${SPRITE})`;
    d.style.backgroundSize='700% 700%';
    d.style.backgroundPosition=`${c*(100/6)}% ${r*(100/6)}%`;
    d.style.backgroundRepeat='no-repeat';
    d.style.imageRendering='auto';
    return d;
  }
  function selected(){return document.querySelector('.npcTile.selected')?.dataset?.npc||document.querySelector('.npcDetail h2')?.textContent?.trim()||''}
  function apply(){
    document.querySelectorAll('.npcTile').forEach(tile=>{
      const name=tile.dataset.npc||tile.querySelector('.npcTileText b')?.textContent?.trim();
      const box=tile.querySelector('.npcTilePortrait');
      if(!name||!box)return;
      if(box.dataset.portraitV3===name)return;
      box.innerHTML='';box.appendChild(make(name,false));box.dataset.portraitV3=name;
    });
    const name=selected(),hero=document.querySelector('.npcHeroPortrait');
    if(name&&hero&&hero.dataset.portraitV3!==name){
      hero.innerHTML='';hero.appendChild(make(name,true));
      const lab=document.createElement('span');lab.className='vizLabel';lab.textContent='CAMPAIGN VISUALIZATION';hero.appendChild(lab);
      hero.dataset.portraitV3=name;
    }
    document.querySelector('.npcWorkspace')?.classList.add('premiumWorkspace');
    document.querySelector('.npcGallery')?.classList.add('premiumGallery');
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  obs.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',()=>setTimeout(apply,0),true);
  setTimeout(apply,50);setTimeout(apply,300);setTimeout(apply,900);
})();