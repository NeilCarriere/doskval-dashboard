// Doskval NPC portraits v7 — curated 100-face library with corrected 10x10 sprite geometry.
(function(){
  const SPRITE='assets/F7096ECF-A363-4258-98AA-5C2DD3364C38.png?v=curated100b';
  const COLS=10;
  // The uploaded sheet has a footer below the 10 portrait rows, so vertical positioning
  // cannot use a simple 1000% x 1000% grid. These row positions compensate for that footer.
  const ROW_POS=[0,10.6853,21.0943,31.8718,42.7413,53.0582,63.6514,74.3368,84.4694,93.9573];
  const CELL={
    'Quellyn':86,'Flint':88,'Stazia':59,'Malista':69,'Telda':74,'Frake':93,'Fitz':11,
    'Dowler':25,'Laroze':34,'Amancio':9,'Adelaide Phroaig':21,'Rigney':16,
    'Lyssa':17,'Roric':12,'Bell':39,'Bazso Baz':22,'Pickett':5,'Henner':14,
    'Mylera Klev':24,'Slate':60,'Loop':20,'Nessa':42,'Hutch':54,'Hutton':68,
    'Sercy':67,'Derret':41,'Roslyn':65,'Irelen':51,'Eisele':98,'Griggs':61,
    'Margette Vale':29,'Bear':90,'Goldie':80,'Lord Scurlock':4,'Scurlock':4,
    'Setarra':50,'Seresh':63,'Tuhan':36,'Ulf Ironborn':75,'Havid':96,
    'Commander Clelland':43,'Captain Michter':27,'Captain Vale':40,
    'Bakoros':10,'Elder Rowan':89,'Preceptor Dunvil':35,'Una Farros':26,
    'The Tower':92,'The Star':37,'Grull':30
  };
  const canonical=Object.keys(CELL).filter(n=>n!=='Scurlock');
  const used=canonical.map(n=>CELL[n]);
  if(new Set(used).size!==used.length) console.error('NPC portrait map contains duplicate cells');
  function cellToCoord(n){const z=n-1;return [z%COLS,Math.floor(z/COLS)]}
  function make(name,hero){
    const [c,r]=cellToCoord(CELL[name]||1),d=document.createElement('div');
    d.className=hero?'realNpcSprite realNpcHeroSprite allNpcPainted':'realNpcSprite allNpcPainted';
    d.setAttribute('role','img');d.setAttribute('aria-label','Campaign visualization portrait of '+name);
    d.style.backgroundImage=`url(${SPRITE})`;
    // 1057.32% vertically maps the 10 portrait rows while excluding the footer from the grid math.
    d.style.backgroundSize='1000% 1057.32%';
    d.style.backgroundPosition=`${c*(100/9)}% ${ROW_POS[r]}%`;
    d.style.backgroundRepeat='no-repeat';
    d.style.imageRendering='auto';
    d.style.transform='none';
    d.style.transformOrigin='center';
    d.style.overflow='hidden';
    return d;
  }
  function selected(){return document.querySelector('.npcTile.selected')?.dataset?.npc||document.querySelector('.npcDetail h2')?.textContent?.trim()||''}
  function apply(){
    document.querySelectorAll('.npcTile').forEach(tile=>{
      const name=tile.dataset.npc||tile.querySelector('.npcTileText b')?.textContent?.trim(),box=tile.querySelector('.npcTilePortrait');
      if(!name||!box)return;
      box.style.overflow='hidden';
      if(box.dataset.portraitV7===name)return;
      box.innerHTML='';box.appendChild(make(name,false));box.dataset.portraitV7=name;
    });
    const name=selected(),hero=document.querySelector('.npcHeroPortrait');
    if(name&&hero){
      hero.style.overflow='hidden';
      if(hero.dataset.portraitV7!==name){
        hero.innerHTML='';hero.appendChild(make(name,true));
        const lab=document.createElement('span');lab.className='vizLabel';lab.textContent='CAMPAIGN VISUALIZATION';hero.appendChild(lab);
        hero.dataset.portraitV7=name;
      }
    }
    document.querySelector('.npcWorkspace')?.classList.add('premiumWorkspace');document.querySelector('.npcGallery')?.classList.add('premiumGallery');
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));obs.observe(document.documentElement,{subtree:true,childList:true});document.addEventListener('click',()=>setTimeout(apply,0),true);setTimeout(apply,50);setTimeout(apply,300);setTimeout(apply,900);
})();