// High-resolution NPC/Faces artwork pass.
(function(){
  const SPRITE='assets/npc-hires-5x4.jpg?v=20260910-hires';
  const COLS=5, ROWS=4, CELLS=COLS*ROWS;
  function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function coord(name){const n=hash(name)%CELLS;return [n%COLS,Math.floor(n/COLS)]}
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
    d.style.filter=`saturate(${.88+(h%10)/100}) contrast(${1.03+(h%5)/100}) brightness(${.94+(h%6)/100})`;
    if((h>>5)%2)d.style.transform='scaleX(-1)';
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