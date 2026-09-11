// Doskval NPC portraits v4 — one unique portrait per NPC from the uploaded 7x7 master sheet.
(function(){
  const SPRITE='assets/07B9A96D-9860-4F29-8214-BB3FD57D9947.png?v=master49b';
  const COLS=7, ROWS=7;
  // Every NPC below has a unique cell number (1..49). The portrait label strip is hidden by a slight zoom.
  const CELL={
    'Quellyn':1,'Flint':2,'Stazia':3,'Malista':4,'Telda':5,'Frake':6,'Fitz':7,'Dowler':8,
    'Laroze':27,'Amancio':26,'Adelaide Phroaig':21,'Rigney':22,'Lyssa':23,'Roric':24,'Bell':25,
    'Bazso Baz':9,'Pickett':29,'Henner':30,'Mylera Klev':10,'Slate':28,'Loop':36,'Nessa':37,
    'Hutch':33,'Hutton':38,'Sercy':42,'Derret':40,'Roslyn':39,'Irelen':43,'Eisele':32,'Griggs':31,
    'Margette Vale':34,'Bear':47,'Goldie':41,'Lord Scurlock':11,'Scurlock':11,'Setarra':45,
    'Seresh':48,'Tuhan':46,'Ulf Ironborn':35,'Havid':44,'Commander Clelland':18,'Captain Michter':20,
    'Captain Vale':49,'Bakoros':19,'Elder Rowan':12,'Preceptor Dunvil':17,'Una Farros':13,
    'The Tower':16,'The Star':14,'Grull':15
  };
  function cellToCoord(n){const z=n-1;return [z%COLS,Math.floor(z/COLS)]}
  function make(name,hero){
    const [c,r]=cellToCoord(CELL[name]||1),d=document.createElement('div');
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
      if(box.dataset.portraitV4===name)return;
      box.innerHTML='';box.appendChild(make(name,false));box.dataset.portraitV4=name;
    });
    const name=selected(),hero=document.querySelector('.npcHeroPortrait');
    if(name&&hero&&hero.dataset.portraitV4!==name){
      hero.innerHTML='';hero.appendChild(make(name,true));
      const lab=document.createElement('span');lab.className='vizLabel';lab.textContent='CAMPAIGN VISUALIZATION';hero.appendChild(lab);
      hero.dataset.portraitV4=name;
    }
    document.querySelector('.npcWorkspace')?.classList.add('premiumWorkspace');
    document.querySelector('.npcGallery')?.classList.add('premiumGallery');
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  obs.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',()=>setTimeout(apply,0),true);
  setTimeout(apply,50);setTimeout(apply,300);setTimeout(apply,900);
})();