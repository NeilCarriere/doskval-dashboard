// Doskval NPC portraits v8 — exact pixel crop from 100-face sheet; prevents adjacent-cell bleed.
(function(){
  const SPRITE='assets/F7096ECF-A363-4258-98AA-5C2DD3364C38.png?v=curated100c';
  const IMG_W=1312, IMG_H=1199;
  // Measured separator lines in the generated 10x10 portrait sheet.
  const X=[3,131,259,389,518,653,781,921,1053,1184,1310];
  const Y=[4,118,231,348,466,578,693,805,919,1022,1137];
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

  function cellToCoord(n){const z=n-1;return [z%10,Math.floor(z/10)]}
  function paint(el,name){
    const [c,r]=cellToCoord(CELL[name]||1);
    // Inset slightly inside each separator so no neighboring frame/portrait can appear.
    const padX=4,padY=4;
    const x0=X[c]+padX, x1=X[c+1]-padX;
    const y0=Y[r]+padY, y1=Y[r+1]-padY;
    const cw=x1-x0, ch=y1-y0;
    const rect=el.getBoundingClientRect();
    const bw=Math.max(1,rect.width), bh=Math.max(1,rect.height);
    // 'cover' the element with the selected source cell. This guarantees both the
    // visible width and height stay entirely inside that one portrait cell.
    const s=Math.max(bw/cw,bh/ch);
    const scaledW=IMG_W*s, scaledH=IMG_H*s;
    const cellW=cw*s, cellH=ch*s;
    const left=-(x0*s)+(bw-cellW)/2;
    const top=-(y0*s)+(bh-cellH)/2;
    el.style.backgroundImage=`url(${SPRITE})`;
    el.style.backgroundSize=`${scaledW}px ${scaledH}px`;
    el.style.backgroundPosition=`${left}px ${top}px`;
    el.style.backgroundRepeat='no-repeat';
  }
  function make(name,hero){
    const d=document.createElement('div');
    d.className=hero?'realNpcSprite realNpcHeroSprite allNpcPainted':'realNpcSprite allNpcPainted';
    d.setAttribute('role','img');d.setAttribute('aria-label','Campaign visualization portrait of '+name);
    Object.assign(d.style,{position:'absolute',inset:'0',width:'100%',height:'100%',overflow:'hidden',transform:'none',backgroundColor:'#05090b',imageRendering:'auto'});
    d.dataset.portraitName=name;
    requestAnimationFrame(()=>paint(d,name));
    return d;
  }
  function selected(){return document.querySelector('.npcTile.selected')?.dataset?.npc||document.querySelector('.npcDetail h2')?.textContent?.trim()||''}
  function apply(){
    document.querySelectorAll('.npcTilePortrait').forEach(box=>{box.style.position='relative';box.style.overflow='hidden';});
    document.querySelectorAll('.npcTile').forEach(tile=>{
      const name=tile.dataset.npc||tile.querySelector('.npcTileText b')?.textContent?.trim(),box=tile.querySelector('.npcTilePortrait');
      if(!name||!box)return;
      if(box.dataset.portraitV8===name)return;
      box.innerHTML='';box.appendChild(make(name,false));box.dataset.portraitV8=name;
    });
    const name=selected(),hero=document.querySelector('.npcHeroPortrait');
    if(name&&hero){hero.style.position='relative';hero.style.overflow='hidden';
      if(hero.dataset.portraitV8!==name){hero.innerHTML='';hero.appendChild(make(name,true));const lab=document.createElement('span');lab.className='vizLabel';lab.textContent='CAMPAIGN VISUALIZATION';hero.appendChild(lab);hero.dataset.portraitV8=name;}
    }
    document.querySelector('.npcWorkspace')?.classList.add('premiumWorkspace');document.querySelector('.npcGallery')?.classList.add('premiumGallery');
    requestAnimationFrame(()=>document.querySelectorAll('.realNpcSprite').forEach(el=>paint(el,el.dataset.portraitName||'')));
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  obs.observe(document.documentElement,{subtree:true,childList:true});
  const ro=new ResizeObserver(()=>requestAnimationFrame(()=>document.querySelectorAll('.realNpcSprite').forEach(el=>paint(el,el.dataset.portraitName||''))));
  ro.observe(document.documentElement);
  document.addEventListener('click',()=>setTimeout(apply,0),true);
  window.addEventListener('resize',()=>requestAnimationFrame(apply));
  setTimeout(apply,50);setTimeout(apply,300);setTimeout(apply,900);
})();