(function(){
  const ns='http://www.w3.org/2000/svg';
  function key(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function faceSVG(name){
    const k=key(name);
    const common=`viewBox="0 0 100 100" role="img" aria-label="${name} portrait"`;
    const eye='#8ef2df', skin='#c9b49f', dark='#071014', ink='#10191d';
    if(k==='quellyn')return `<svg ${common}><rect width="100" height="100" fill="#0b171b"/><circle cx="50" cy="39" r="22" fill="#c8b7a8"/><path d="M18 100q4-30 32-31t32 31" fill="#132126"/><path d="M25 38q8-30 28-30 19 1 25 28l-7-6-4 22-7-30-6 18-8-19-5 24-8-15z" fill="#10151a"/><path d="M39 42l7 1m8 0l7-1" stroke="#233238" stroke-width="2"/><path d="M46 57q5 3 10 0" stroke="#7e5d58" fill="none"/><circle cx="37" cy="20" r="4" fill="#76d9c7" opacity=".5"/><path d="M15 84q16-13 28-9m42 9q-16-13-28-9" stroke="#4a9286" fill="none" opacity=".6"/></svg>`;
    if(k==='lyssa')return `<svg ${common}><rect width="100" height="100" fill="#0d1118"/><path d="M28 35q5-25 23-25 21 0 25 28v25H24V39z" fill="#181420"/><ellipse cx="50" cy="43" rx="21" ry="24" fill="#cfb7a6"/><path d="M26 34q7-26 28-24 18 2 22 25-12-6-24-3-12 3-26 2z" fill="#101116"/><path d="M37 43l8-1m10 0l8 1" stroke="#29323c" stroke-width="2"/><path d="M42 59q8 4 16 0" stroke="#7d5358" fill="none"/><path d="M18 100q8-28 32-29 25 1 32 29" fill="#24202c"/><circle cx="72" cy="23" r="3" fill="#8d6abd" opacity=".7"/></svg>`;
    if(k==='roric')return `<svg ${common}><rect width="100" height="100" fill="#071014"/><ellipse cx="50" cy="42" rx="21" ry="24" fill="#a99686"/><path d="M25 36q5-24 25-25 20 1 25 25-10-9-25-9t-25 9z" fill="#11181c"/><path d="M31 51q19 16 38 0-4 25-19 25T31 51z" fill="#1b2529"/><path d="M38 43l7-1m10 0l7 1" stroke="#26343a" stroke-width="2"/><path d="M16 100q9-28 34-28t34 28" fill="#151e22"/><path d="M22 18l56 56" stroke="#7fb9ad" stroke-width="1" opacity=".18"/></svg>`;
    if(k==='ragged-tom')return `<svg ${common}><rect width="100" height="100" fill="#120d09"/><ellipse cx="50" cy="40" rx="21" ry="23" fill="#c2a184"/><path d="M26 35q8-24 25-24 18 0 24 25-8-8-16-8-8 0-15 5-8-5-18 2z" fill="#332116"/><path d="M30 49q19 28 40 0-2 28-20 30-18-2-20-30z" fill="#4a2d1d"/><path d="M37 43l8-1m10 0l8 1" stroke="#3d2c24" stroke-width="2"/><path d="M18 100q7-27 32-28 25 1 32 28" fill="#241912"/><path d="M67 16l12 7" stroke="#e2a052" stroke-width="2" opacity=".7"/></svg>`;
    if(k==='iruvian-dusk')return `<svg ${common}><rect width="100" height="100" fill="#070914"/><ellipse cx="50" cy="42" rx="20" ry="23" fill="#9aa4c4"/><path d="M17 100q8-35 33-35 26 0 33 35" fill="#11182d"/><path d="M22 42q5-31 28-33 23 2 28 33-8-10-14-13l-3 24-11-28-10 28-4-24q-7 4-14 13z" fill="#0a0d18"/><path d="M37 43l8-1m10 0l8 1" stroke="#17233e" stroke-width="2"/><path d="M42 59q8 2 16 0" stroke="#53618b" fill="none"/><circle cx="50" cy="18" r="3" fill="#78b9ef" opacity=".75"/></svg>`;
    return `<svg ${common}><rect width="100" height="100" fill="#091114"/><circle cx="50" cy="37" r="21" fill="#b8aa9b"/><path d="M18 100q6-31 32-32 26 1 32 32" fill="#172126"/><path d="M29 33q8-22 21-22t21 22q-8-5-21-5t-21 5z" fill="#11181c"/><circle cx="42" cy="42" r="2" fill="${eye}"/><circle cx="58" cy="42" r="2" fill="${eye}"/></svg>`;
  }
  function findName(el){
    const p=el.closest('button,.panel,.card,article,div');
    if(!p)return '';
    const b=p.querySelector('b,h3,h2');
    return b?b.textContent.trim():'';
  }
  function upgrade(){
    document.querySelectorAll('.miniavatar,.avatar').forEach(el=>{
      if(el.dataset.portraitDone)return;
      let name=findName(el);
      if(!name && el.textContent.trim()==='Q')name='Quellyn';
      el.innerHTML=faceSVG(name);
      el.classList.add('portrait-'+key(name));
      el.dataset.portraitDone='1';
    });
    const city=document.querySelector('.cityline');
    if(city)city.setAttribute('title','Doskvol skyline');
  }
  const obs=new MutationObserver(upgrade);
  obs.observe(document.documentElement,{subtree:true,childList:true});
  upgrade();
})();