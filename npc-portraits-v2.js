// Doskval NPC portraits v6 — curated one-to-one assignments from the 100-face reserve library.
(function(){
  const SPRITE='assets/F7096ECF-A363-4258-98AA-5C2DD3364C38.png?v=curated100a';
  const COLS=10;
  // Each NPC has a unique cell selected to fit age, role, faction and occult character.
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
    d.style.backgroundSize='1000% 1000%';
    d.style.backgroundPosition=`${c*(100/9)}% ${r*(100/9)}%`;
    d.style.backgroundRepeat='no-repeat';d.style.imageRendering='auto';
    d.style.transform='scale(1.10)';d.style.transformOrigin='50% 43%';
    return d;
  }
  function selected(){return document.querySelector('.npcTile.selected')?.dataset?.npc||document.querySelector('.npcDetail h2')?.textContent?.trim()||''}
  function apply(){
    document.querySelectorAll('.npcTile').forEach(tile=>{const name=tile.dataset.npc||tile.querySelector('.npcTileText b')?.textContent?.trim(),box=tile.querySelector('.npcTilePortrait');if(!name||!box)return;if(box.dataset.portraitV6===name)return;box.innerHTML='';box.appendChild(make(name,false));box.dataset.portraitV6=name});
    const name=selected(),hero=document.querySelector('.npcHeroPortrait');if(name&&hero&&hero.dataset.portraitV6!==name){hero.innerHTML='';hero.appendChild(make(name,true));const lab=document.createElement('span');lab.className='vizLabel';lab.textContent='CAMPAIGN VISUALIZATION';hero.appendChild(lab);hero.dataset.portraitV6=name}
    document.querySelector('.npcWorkspace')?.classList.add('premiumWorkspace');document.querySelector('.npcGallery')?.classList.add('premiumGallery');
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));obs.observe(document.documentElement,{subtree:true,childList:true});document.addEventListener('click',()=>setTimeout(apply,0),true);setTimeout(apply,50);setTimeout(apply,300);setTimeout(apply,900);
})();