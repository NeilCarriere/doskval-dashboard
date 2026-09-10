// Ensure every NPC/Faces card uses painted campaign artwork rather than the fallback cartoon SVG.
(function(){
  const SPRITE='assets/npc-portrait-sprite.jpg';
  function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function coord(name){const n=hash(name)%16;return [n%4,Math.floor(n/4)]}
  function make(name,hero){const [c,r]=coord(name),d=document.createElement('div');d.className=hero?'realNpcSprite realNpcHeroSprite allNpcPainted':'realNpcSprite allNpcPainted';d.setAttribute('role','img');d.setAttribute('aria-label','Campaign visualization portrait of '+name);d.style.backgroundImage=`url(${SPRITE})`;d.style.backgroundSize='400% 400%';d.style.backgroundPosition=`${c*33.333333}% ${r*33.333333}%`;const h=hash(name);d.style.filter=`saturate(${.82+(h%13)/100}) contrast(${1.05+(h%7)/100}) brightness(${.91+(h%8)/100})`;if((h>>5)%2)d.style.transform='scaleX(-1)';return d}
  function selected(){return document.querySelector('.npcTile.selected')?.dataset?.npc||document.querySelector('.npcDetail h2')?.textContent?.trim()||''}
  function apply(){
    document.querySelectorAll('.npcTile').forEach(tile=>{const name=tile.dataset.npc||tile.querySelector('.npcTileText b')?.textContent?.trim(),box=tile.querySelector('.npcTilePortrait');if(!name||!box)return;if(box.dataset.allPainted===name)return;box.innerHTML='';box.appendChild(make(name,false));box.dataset.allPainted=name});
    const name=selected(),hero=document.querySelector('.npcHeroPortrait');if(name&&hero&&hero.dataset.allPainted!==name){hero.innerHTML='';hero.appendChild(make(name,true));const lab=document.createElement('span');lab.className='vizLabel';lab.textContent='CAMPAIGN VISUALIZATION';hero.appendChild(lab);hero.dataset.allPainted=name}
    document.querySelector('.npcWorkspace')?.classList.add('premiumWorkspace');
    document.querySelector('.npcGallery')?.classList.add('premiumGallery');
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));obs.observe(document.documentElement,{subtree:true,childList:true});document.addEventListener('click',()=>setTimeout(apply,0),true);setTimeout(apply,100);setTimeout(apply,500);
})();