/* Phase 2 — a varied, table-safe Doskvol soundscape and full Gather Information contact desk. */
(function(){
  const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sceneData={
    street:{
      name:'Rain on the Narrow Streets',
      desc:'Cold rain, pipe steam, passing feet, a rare bell, and a foghorn somewhere beyond the mist.',
      mix:{ambience:68,music:40,events:45,horns:42},
      layers:{rain:.92,steam:.55,city:.42,hearth:0,feet:.28,carriage:.22,bell:.52,horn:.3,occult:0},
      bell:[46000,82000,18000,30000],horn:[62000,105000,10000,17000],
      musicHint:'Gaslight Waltz'
    },
    docks:{
      name:'Docks & Leviathan Canal',
      desc:'Canal wash, wet pilings, heavy machinery, and recurring low foghorns from the black water.',
      mix:{ambience:72,music:28,events:40,horns:80},
      layers:{rain:.5,steam:.72,city:.78,hearth:0,feet:.16,carriage:.05,bell:.18,horn:.92,occult:0},
      bell:[76000,132000,30000,50000],horn:[15000,28000,2500,5500],
      musicHint:'No music or Clockwork Tension'
    },
    tavern:{
      name:'The Back-Room Tavern',
      desc:'Hearth crackle, low room presence, worn floorboards, and rain ticking patiently at the shutters.',
      mix:{ambience:62,music:52,events:54,horns:5},
      layers:{rain:.22,steam:.08,city:.05,hearth:1,feet:.68,carriage:0,bell:.04,horn:.03,occult:0},
      bell:[150000,220000,80000,105000],horn:[190000,260000,90000,110000],
      musicHint:'Gaslight Waltz'
    },
    haunt:{
      name:'Six Towers Haunt',
      desc:'Dripping stone, tired pipes, an empty lane, and a bell that arrives too late to be comforting.',
      mix:{ambience:48,music:30,events:38,horns:35},
      layers:{rain:.48,steam:.27,city:.14,hearth:0,feet:.08,carriage:0,bell:.68,horn:.25,occult:.34},
      bell:[48000,90000,14000,24000],horn:[78000,134000,21000,36000],
      musicHint:'The Hollow Dirge'
    },
    rooftops:{
      name:'Rooftops in the Fog',
      desc:'Wind over slate, far-off rain, chimney breath, and the city sounding very far below.',
      mix:{ambience:56,music:24,events:30,horns:54},
      layers:{rain:.33,steam:.36,city:.3,hearth:0,feet:.12,carriage:0,bell:.32,horn:.52,occult:0},
      bell:[68000,116000,22000,39000],horn:[44000,79000,5000,10000],
      musicHint:'No music or The Hollow Dirge'
    },
    score:{
      name:'Score Underway',
      desc:'A tense city bed: rain, pressure in the pipes, quick footsteps, and a distant harbour signal.',
      mix:{ambience:57,music:55,events:66,horns:48},
      layers:{rain:.56,steam:.8,city:.64,hearth:0,feet:.52,carriage:.05,bell:.26,horn:.45,occult:.08},
      bell:[60000,104000,18000,30000],horn:[36000,69000,6000,10000],
      musicHint:'Clockwork Tension'
    },
    occult:{
      name:'Electroplasmic Vigil',
      desc:'Thin rain, a sickly electrical hum, uncertain whispers, and the sense that something has noticed.',
      mix:{ambience:44,music:38,events:48,horns:24},
      layers:{rain:.26,steam:.42,city:.12,hearth:0,feet:.02,carriage:0,bell:.55,horn:.16,occult:1},
      bell:[52000,92000,15000,26000],horn:[90000,150000,26000,44000],
      musicHint:'The Hollow Dirge'
    }
  };
  const musicModes={
    off:{name:'No music',desc:'Keep only the city soundscape.'},
    waltz:{name:'Gaslight Waltz',desc:'Original, foreboding strings in a slow Victorian waltz.'},
    dirge:{name:'The Hollow Dirge',desc:'Sparse, haunted strings for Six Towers and occult work.'},
    tension:{name:'Clockwork Tension',desc:'A restrained, ticking string pattern for an active score.'}
  };
  const defaultMix={ambience:62,music:42,events:46,horns:52};
  let stored={};
  try{stored=JSON.parse(localStorage.getItem('doskval-atmosphere')||'{}')||{};}catch(_){}
  const storedMix=stored.mix||{};
  const mix={};
  Object.keys(defaultMix).forEach(key=>{
    const value=Number(storedMix[key]);
    mix[key]=Number.isFinite(value)?Math.max(0,Math.min(100,value)):defaultMix[key];
  });
  let config={
    scene:sceneData[stored.scene]?stored.scene:'street',
    music:musicModes[stored.music]?stored.music:'waltz',
    playing:false,
    mix:mix
  };
  let ctx=null,master=null,buses=null,nodes=[],timers=new Set(),noise={},generation=0;

  function persist(){
    localStorage.setItem('doskval-atmosphere',JSON.stringify({
      scene:config.scene,music:config.music,mix:config.mix
    }));
  }
  function register(node){nodes.push(node);return node;}
  function clearTimers(){
    timers.forEach(timer=>clearTimeout(timer));
    timers.clear();
  }
  function dispose(){
    clearTimers();
    nodes.forEach(node=>{
      try{if(node.stop)node.stop();}catch(_){}
      try{node.disconnect();}catch(_){}
    });
    nodes=[];
    master=null;
    buses=null;
  }
  function wait(fn,delay){
    const timer=setTimeout(()=>{
      timers.delete(timer);
      if(config.playing)fn();
    },delay);
    timers.add(timer);
    return timer;
  }
  function random(min,max){return min+Math.random()*(max-min);}
  function recurring(fn,min,max,firstMin,firstMax){
    const tick=()=>{
      if(!config.playing)return;
      fn();
      wait(tick,random(min,max));
    };
    wait(tick,random(firstMin||min,firstMax||max));
  }
  function noiseBuffer(kind){
    if(noise[kind])return noise[kind];
    const buffer=ctx.createBuffer(1,ctx.sampleRate*4,ctx.sampleRate);
    const data=buffer.getChannelData(0);
    let brown=0,pink=0;
    for(let i=0;i<data.length;i++){
      const white=Math.random()*2-1;
      if(kind==='brown'){
        brown=(brown+white*.035)*.997;
        data[i]=brown*3.2;
      }else if(kind==='blue'){
        pink=pink*.985+white*.08;
        data[i]=white-pink*.6;
      }else{
        pink=pink*.985+white*.08;
        data[i]=pink*1.8;
      }
    }
    noise[kind]=buffer;
    return buffer;
  }
  function gain(bus,amount){
    const node=register(ctx.createGain());
    node.gain.value=amount;
    node.connect(bus);
    return node;
  }
  function buildGraph(){
    master=register(ctx.createGain());
    master.gain.setValueAtTime(.0001,ctx.currentTime);
    master.connect(ctx.destination);
    buses={
      ambience:gain(master,config.mix.ambience/100),
      music:gain(master,config.mix.music/100),
      events:gain(master,config.mix.events/100),
      horns:gain(master,config.mix.horns/100)
    };
    master.gain.linearRampToValueAtTime(.92,ctx.currentTime+.55);
  }
  function setLiveMix(key){
    const bus=buses&&buses[key];
    if(!bus)return;
    const now=ctx.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setTargetAtTime(config.mix[key]/100,now,.07);
  }
  function filteredLoop(kind,bus,amount,options){
    if(!amount)return null;
    const src=register(ctx.createBufferSource());
    const high=register(ctx.createBiquadFilter());
    const low=register(ctx.createBiquadFilter());
    const out=gain(bus,amount);
    src.buffer=noiseBuffer(kind);
    src.loop=true;
    src.playbackRate.value=options.rate||1;
    high.type='highpass';
    high.frequency.value=options.high||0;
    low.type='lowpass';
    low.frequency.value=options.low||18000;
    low.Q.value=options.q||0;
    src.connect(high);
    high.connect(low);
    low.connect(out);
    src.start();
    return out;
  }
  function modulate(target,min,max,seconds){
    if(!target)return;
    const lfo=register(ctx.createOscillator());
    const lfoGain=register(ctx.createGain());
    const now=ctx.currentTime;
    target.gain.setValueAtTime((min+max)/2,now);
    lfo.frequency.value=1/seconds;
    lfoGain.gain.value=(max-min)/2;
    lfo.connect(lfoGain);
    lfoGain.connect(target.gain);
    lfo.start();
  }
  function noiseBurst(kind,bus,amount,options){
    if(!amount)return;
    const src=register(ctx.createBufferSource());
    const high=register(ctx.createBiquadFilter());
    const low=register(ctx.createBiquadFilter());
    const out=gain(bus,.0001);
    const now=ctx.currentTime;
    const duration=options.duration||.12;
    src.buffer=noiseBuffer(kind);
    src.playbackRate.value=options.rate||1;
    high.type='highpass';
    high.frequency.value=options.high||0;
    low.type='lowpass';
    low.frequency.value=options.low||18000;
    low.Q.value=options.q||0;
    src.connect(high);
    high.connect(low);
    low.connect(out);
    out.gain.setValueAtTime(.0001,now);
    out.gain.exponentialRampToValueAtTime(Math.max(.0002,amount),now+(options.attack||.008));
    out.gain.exponentialRampToValueAtTime(.0001,now+duration);
    src.start(now,Math.random()*.9);
    src.stop(now+duration+.03);
  }
  function tone(bus,frequency,start,duration,amount,options){
    const oscillator=register(ctx.createOscillator());
    const filter=register(ctx.createBiquadFilter());
    const out=gain(bus,.0001);
    oscillator.type=options.type||'sine';
    oscillator.frequency.setValueAtTime(frequency,start);
    if(options.detune)oscillator.detune.value=options.detune;
    filter.type=options.filterType||'lowpass';
    filter.frequency.value=options.filter||2800;
    oscillator.connect(filter);
    filter.connect(out);
    out.gain.setValueAtTime(.0001,start);
    out.gain.exponentialRampToValueAtTime(Math.max(.0002,amount),start+(options.attack||.025));
    out.gain.exponentialRampToValueAtTime(.0001,start+duration);
    oscillator.start(start);
    oscillator.stop(start+duration+.05);
    return {oscillator:oscillator,out:out};
  }
  function rain(scene){
    const level=scene.layers.rain;
    if(!level)return;
    const mist=filteredLoop('pink',buses.ambience,level*.036,{high:880,low:6800,rate:.73});
    const roof=filteredLoop('brown',buses.ambience,level*.018,{high:200,low:1800,rate:.51});
    modulate(mist,level*.022,level*.048,7.2);
    modulate(roof,level*.007,level*.023,12);
    recurring(()=>noiseBurst('blue',buses.events,level*random(.004,.012),{
      high:1700+Math.random()*2200,low:5000+Math.random()*2800,
      duration:random(.025,.11),rate:random(.8,1.35)
    }),240,780,100,300);
  }
  function steam(scene){
    const level=scene.layers.steam;
    if(!level)return;
    const hiss=filteredLoop('pink',buses.ambience,level*.025,{high:150,low:1280,rate:.36,q:1.4});
    modulate(hiss,level*.007,level*.032,5.5);
    const hum=tone(buses.ambience,39,ctx.currentTime,180,level*.011,{type:'sine',filter:210,attack:.18});
    const wobble=register(ctx.createOscillator());
    const wobbleGain=register(ctx.createGain());
    wobble.frequency.value=.09;
    wobbleGain.gain.value=4.2;
    wobble.connect(wobbleGain);
    wobbleGain.connect(hum.oscillator.detune);
    wobble.start();
    recurring(()=>noiseBurst('brown',buses.events,level*random(.015,.035),{
      high:80,low:760,duration:random(.16,.42),rate:random(.55,.9)
    }),4800,11400,1500,3600);
  }
  function cityBed(scene){
    const level=scene.layers.city;
    if(!level)return;
    const wash=filteredLoop('brown',buses.ambience,level*.018,{high:65,low:590,rate:.43});
    modulate(wash,level*.006,level*.024,16);
    const base=tone(buses.ambience,47,ctx.currentTime,180,level*.007,{type:'triangle',filter:190,attack:.35});
    const sway=register(ctx.createOscillator());
    const swayGain=register(ctx.createGain());
    sway.frequency.value=.045;
    swayGain.gain.value=2.6;
    sway.connect(swayGain);
    swayGain.connect(base.oscillator.detune);
    sway.start();
  }
  function hearth(scene){
    const level=scene.layers.hearth;
    if(!level)return;
    const fire=filteredLoop('brown',buses.ambience,level*.017,{high:80,low:670,rate:.62});
    modulate(fire,level*.006,level*.023,8.6);
    const room=filteredLoop('pink',buses.ambience,level*.008,{high:350,low:1500,rate:.41});
    modulate(room,level*.003,level*.012,13);
    recurring(()=>noiseBurst('blue',buses.events,level*random(.008,.022),{
      high:620,low:3400,duration:random(.015,.06),rate:random(.65,1.35)
    }),360,1260,100,380);
  }
  function footstep(level){
    noiseBurst('brown',buses.events,level*random(.026,.052),{
      high:75,low:460,duration:random(.07,.14),rate:random(.55,.95)
    });
  }
  function carriagePass(level){
    const beats=4+Math.floor(Math.random()*4);
    for(let i=0;i<beats;i++)wait(()=>footstep(level*.78),i*random(260,410));
    wait(()=>noiseBurst('brown',buses.events,level*.025,{
      high:55,low:350,duration:.38,rate:.43
    }),beats*330);
  }
  function streetCues(scene){
    const feet=scene.layers.feet||0;
    const carriage=scene.layers.carriage||0;
    if(feet)recurring(()=>footstep(feet),5200,13300,1600,4200);
    if(carriage)recurring(()=>carriagePass(carriage),28000,54000,10000,18000);
  }
  function distantBell(scene){
    const level=scene.layers.bell||0;
    if(!level)return;
    const now=ctx.currentTime;
    const root=gain(buses.events,.0001);
    const frequency=174+Math.random()*13;
    const duration=3.5+Math.random()*1.4;
    root.gain.setValueAtTime(.0001,now);
    root.gain.exponentialRampToValueAtTime(level*random(.012,.025),now+.025);
    root.gain.exponentialRampToValueAtTime(.0001,now+duration);
    [1,2.01,2.68,3.77].forEach((ratio,index)=>{
      const oscillator=register(ctx.createOscillator());
      const partial=gain(root,index===0?1:index===1?.38:index===2?.16:.08);
      oscillator.type=index===0?'triangle':'sine';
      oscillator.frequency.value=frequency*ratio;
      oscillator.detune.value=(Math.random()-.5)*7;
      oscillator.connect(partial);
      oscillator.start(now);
      oscillator.stop(now+duration+.08);
    });
  }
  function foghorn(scene){
    const level=scene.layers.horn||0;
    if(!level)return;
    const now=ctx.currentTime;
    const duration=random(3.5,6.1);
    const fundamental=random(67,83);
    const root=gain(buses.horns,.0001);
    const hornOscillators=[];
    root.gain.setValueAtTime(.0001,now);
    root.gain.exponentialRampToValueAtTime(.011+level*.035,now+.3);
    root.gain.setValueAtTime(.011+level*.035,now+duration*.58);
    root.gain.exponentialRampToValueAtTime(.0001,now+duration);
    [[1,1],[1.5,.28],[2,.15]].forEach(pair=>{
      const oscillator=register(ctx.createOscillator());
      const partial=gain(root,pair[1]);
      oscillator.type=pair[0]===1?'sine':'triangle';
      oscillator.frequency.value=fundamental*pair[0];
      oscillator.connect(partial);
      oscillator.start(now);
      oscillator.stop(now+duration+.08);
      hornOscillators.push(oscillator);
    });
    const drift=register(ctx.createOscillator());
    const driftGain=register(ctx.createGain());
    drift.frequency.value=.18+Math.random()*.08;
    driftGain.gain.value=4+Math.random()*3;
    drift.connect(driftGain);
    hornOscillators.forEach(oscillator=>driftGain.connect(oscillator.detune));
    drift.start(now);
    drift.stop(now+duration+.08);
    const wash=register(ctx.createBufferSource());
    const high=register(ctx.createBiquadFilter());
    const low=register(ctx.createBiquadFilter());
    const washGain=gain(root,.018);
    wash.buffer=noiseBuffer('brown');
    high.type='highpass';
    high.frequency.value=50;
    low.type='lowpass';
    low.frequency.value=310;
    wash.connect(high);
    high.connect(low);
    low.connect(washGain);
    wash.start(now,Math.random()*.8);
    wash.stop(now+duration+.08);
  }
  function occult(scene){
    const level=scene.layers.occult;
    if(!level)return;
    const breath=filteredLoop('blue',buses.ambience,level*.008,{high:900,low:3900,rate:.24});
    modulate(breath,level*.001,level*.014,10.8);
    recurring(()=>{
      const note=[146.83,155.56,174.61,196][Math.floor(Math.random()*4)];
      tone(buses.events,note,ctx.currentTime,random(1.8,3.2),level*.006,{
        type:'sine',filter:900,attack:.34,detune:Math.random()*12-6
      });
    },12000,27000,4500,9000);
  }
  function midi(value){return 440*Math.pow(2,(value-69)/12);}
  function stringNote(note,start,duration,amount,brightness){
    const root=gain(buses.music,.0001);
    root.gain.setValueAtTime(.0001,start);
    root.gain.linearRampToValueAtTime(amount,start+.035);
    root.gain.exponentialRampToValueAtTime(.0001,start+duration);
    [[1,'triangle',1],[2,'sine',.23],[3,'sine',.07]].forEach(part=>{
      const oscillator=register(ctx.createOscillator());
      const filter=register(ctx.createBiquadFilter());
      const partial=gain(root,part[2]);
      oscillator.type=part[1];
      oscillator.frequency.value=midi(note)*part[0];
      oscillator.detune.value=(Math.random()-.5)*5;
      filter.type='lowpass';
      filter.frequency.value=brightness||1900;
      oscillator.connect(filter);
      filter.connect(partial);
      oscillator.start(start);
      oscillator.stop(start+duration+.06);
    });
  }
  function waltzMeasure(step){
    const beat=60/58;
    const chord=[[50,57,62,65],[48,55,60,63],[45,52,57,60],[43,50,55,58],[45,52,57,64],[47,54,59,62]][step%6];
    const start=ctx.currentTime+.06;
    const inversion=step%4===3?12:0;
    stringNote(chord[0]-12,start,beat*.94,.028,1200);
    stringNote(chord[1]+inversion,start,beat*2.55,.014,1700);
    stringNote(chord[2]+inversion,start,beat*2.55,.012,1900);
    stringNote(chord[3]+inversion,start+beat,beat*.72,.02,2300);
    stringNote(chord[2]+12,start+beat*2,beat*.68,.018,2450);
    return beat*3;
  }
  function dirgeMeasure(step){
    const beat=60/48;
    const chord=[[38,45,50,53],[36,43,48,51],[33,40,45,50],[31,38,43,46]][step%4];
    const start=ctx.currentTime+.06;
    stringNote(chord[0],start,beat*3.65,.026,1050);
    stringNote(chord[1],start,beat*3.45,.013,1350);
    stringNote(chord[2],start+beat*1.65,beat*1.75,.016,1700);
    stringNote(chord[3]+12,start+beat*2.25,beat*1.2,.013,1850);
    return beat*4;
  }
  function tensionMeasure(step){
    const beat=60/76;
    const scale=[50,53,55,57,60,62,64,67];
    const start=ctx.currentTime+.06;
    const root=[38,41,43,45][step%4];
    stringNote(root,start,beat*3.65,.024,1050);
    for(let i=0;i<5;i++){
      const note=scale[(step*2+i*2+(i===4?1:0))%scale.length]+(i===3?12:0);
      stringNote(note,start+beat*(i*.7+.15),beat*.42,.016+(i===0?.006:0),2100);
    }
    return beat*3.8;
  }
  function startMusic(){
    if(config.music==='off')return;
    const token=generation;
    let step=0;
    const next=()=>{
      if(!config.playing||token!==generation)return;
      let duration=3;
      if(config.music==='waltz')duration=waltzMeasure(step);
      if(config.music==='dirge')duration=dirgeMeasure(step);
      if(config.music==='tension')duration=tensionMeasure(step);
      step++;
      wait(next,duration*1000);
    };
    next();
  }
  function buildSoundscape(scene){
    rain(scene);
    steam(scene);
    cityBed(scene);
    hearth(scene);
    streetCues(scene);
    occult(scene);
    if(scene.layers.bell)recurring(()=>distantBell(scene),scene.bell[0],scene.bell[1],scene.bell[2],scene.bell[3]);
    if(scene.layers.horn)recurring(()=>foghorn(scene),scene.horn[0],scene.horn[1],scene.horn[2],scene.horn[3]);
    startMusic();
  }
  async function start(){
    const token=++generation;
    dispose();
    ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
    await ctx.resume();
    if(token!==generation)return;
    config.playing=true;
    buildGraph();
    buildSoundscape(sceneData[config.scene]);
    persist();
  }
  function stop(){
    const token=++generation;
    config.playing=false;
    persist();
    clearTimers();
    if(!master||!ctx){dispose();return;}
    const now=ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(.0001,now,.08);
    setTimeout(()=>{if(token===generation)dispose();},330);
  }
  function setScene(id){
    if(!sceneData[id])return;
    config.scene=id;
    config.mix=Object.assign({},sceneData[id].mix);
    persist();
    if(config.playing)start();
    renderCurrent();
  }
  function setMusic(id){
    if(!musicModes[id])return;
    config.music=id;
    persist();
    if(config.playing)start();
    renderCurrent();
  }
  function controls(){
    const labels={
      ambience:'CITY AMBIENCE',
      music:'MUSIC',
      events:'BELLS & STREET CUES',
      horns:'HARBOUR FOGHORNS'
    };
    return Object.keys(labels).map(key=>
      '<div class="mixControl"><label>'+labels[key]+'<output id="out-'+key+'">'+config.mix[key]+'%</output></label>'+
      '<input data-mix="'+key+'" type="range" min="0" max="100" value="'+config.mix[key]+'" aria-label="'+labels[key]+' volume"></div>'
    ).join('');
  }
  function sceneCards(){
    return Object.entries(sceneData).map(entry=>{
      const id=entry[0],scene=entry[1];
      return '<button class="sceneCard '+(config.scene===id?'active':'')+'" data-scene="'+id+'">'+
        '<b>'+safe(scene.name)+'</b><small>'+safe(scene.desc)+'</small>'+
        '<em>Best with '+safe(scene.musicHint)+'</em></button>';
    }).join('');
  }
  function musicCards(){
    return Object.entries(musicModes).map(entry=>{
      const id=entry[0],mode=entry[1];
      return '<button class="musicChoice '+(config.music===id?'active':'')+'" data-music="'+id+'">'+
        '<b>'+safe(mode.name)+'</b><small>'+safe(mode.desc)+'</small></button>';
    }).join('');
  }
  function atmospherePage(){
    const scene=sceneData[config.scene];
    const status=config.playing?
      'SOUND RUNNING · '+(config.music==='off'?'CITY ONLY':'CITY + '+musicModes[config.music].name.toUpperCase()):
      'SOUND STANDBY · AUDIO STARTS ONLY WHEN YOU TAP START';
    return '<div class="pagehead"><div><p>DOSKVAL · TABLE ATMOSPHERE</p><h2>Atmosphere</h2><span>Period-appropriate city sound and an optional original score.</span></div><b>♨ ✦ ♨</b></div>'+
      '<div class="atmoDeck"><section class="panel atmoHero"><h3>THE CITY BREATHES</h3>'+
      '<p>Each scene has its own live mix: rain, rooms, pipework, hearths, street cues, rare bells, and harbour foghorns. The sounds vary instead of cycling as one constant noise bed.</p>'+
      '<div class="atmoState '+(config.playing?'playing':'')+'"><i></i><span>'+safe(status)+'</span></div>'+
      '<div class="atmoActions"><button id="atmoToggle" class="primary">'+(config.playing?'FADE OUT ATMOSPHERE':'START ATMOSPHERE')+'</button></div>'+
      '<section class="musicShelf"><header><span>♫</span><div><h3>MUSIC LAYER</h3><p>Independent from ambience. Choose a score or keep the city unscored.</p></div></header>'+
      '<div class="musicGrid">'+musicCards()+'</div></section>'+
      '<div class="sceneGrid">'+sceneCards()+'</div>'+
      '<div class="atmoRule"><b>LOCKED SOUND RULE</b> Old-city ambience only: rain, bells, steam, carts, hoofbeats, hearths, and early harbour signals. No modern traffic, contemporary engines, sirens, or aircraft. Bells and foghorns arrive occasionally on their own; there is no cue button to hammer.</div>'+
      '</section><aside class="atmoMix"><section class="panel"><header><span>⚙</span><h2>MIX DESK</h2></header>'+controls()+
      '</section><section class="panel atmoCue"><h3>CURRENT CUE</h3><p class="cueText" id="atmoCueText">'+safe(scene.desc)+'</p><p class="hint">Recommended score: '+safe(scene.musicHint)+'. Sound remains local to this dashboard and never starts automatically.</p></section></aside></div>';
  }
  function contactData(){return window.DOSKVAL_LORE?.contacts||[];}
  function gatherPage(){
    const contacts=contactData();
    const cards=contacts.map(c=>
      '<button class="gatherContact" data-contact="'+safe(c.name)+'" data-kind="'+(/crew/i.test(c.group)?'crew':c.status.toLowerCase())+'">'+
      '<span class="contactTag">'+safe(c.group)+'</span><span class="status">'+safe(c.status)+'</span>'+
      '<h3>'+safe(c.name)+'</h3><b>'+safe(c.role)+'</b><p>'+safe(c.sentence)+'</p></button>'
    ).join('');
    return '<div class="pagehead"><div><p>DOSKVAL · INFORMATION NETWORK</p><h2>Gather Information</h2><span>Choose the person who can actually move the investigation forward.</span></div><b>◉ ✦ ◉</b></div>'+
      '<section class="panel atmoContactIntro"><h3>THE SNEAKS’ CONTACTS</h3><p>All character and Shadows crew contacts are here—not just Quellyn. Tap one to set the kind of information they can provide, then choose the quality of the result.</p>'+
      '<div class="contactFilter"><button class="active" data-contact-filter="all">ALL CONTACTS · '+contacts.length+'</button><button data-contact-filter="friend">FRIENDS</button><button data-contact-filter="rival">RIVALS</button><button data-contact-filter="crew">CREW CONTACTS</button></div>'+
      '<div class="gatherContactGrid" id="gatherContactGrid">'+cards+'</div></section><section class="panel gatherDetail" id="gatherDetail" hidden></section>'+
      '<section class="panel"><h3>QUESTIONS THAT MOVE PLAY</h3><p>What is really going on here? · What should I be worried about? · Where is the weakness? · Who benefits if this goes wrong? · What opportunity is everyone overlooking?</p></section>';
  }
  function gatherResult(name,quality){
    const detail={
      limited:'The lead is true, but the crucial detail needs another source.',
      standard:'They provide a usable lead and a clear next step.',
      great:'They expose hidden leverage as well as the lead.'
    }[quality];
    return '<b>'+quality.toUpperCase()+' INFORMATION</b><p><strong>'+safe(name)+'</strong> says: '+safe(detail)+'</p><p class="hint">Use the NPC / Faces panel for that contact’s detailed activity, rumours, and generated dossier.</p>';
  }
  function bindGather(){
    const grid=document.getElementById('gatherContactGrid');
    if(!grid)return;
    const contacts=contactData();
    document.querySelectorAll('[data-contact-filter]').forEach(button=>button.onclick=()=>{
      document.querySelectorAll('[data-contact-filter]').forEach(item=>item.classList.toggle('active',item===button));
      const filter=button.dataset.contactFilter;
      grid.querySelectorAll('.gatherContact').forEach(card=>{card.hidden=!(filter==='all'||card.dataset.kind===filter);});
    });
    grid.querySelectorAll('.gatherContact').forEach(button=>button.onclick=()=>{
      const contact=contacts.find(item=>item.name===button.dataset.contact);
      const detail=document.getElementById('gatherDetail');
      detail.hidden=false;
      detail.innerHTML='<h3>ASK '+safe(contact.name.toUpperCase())+'</h3><p><b>'+safe(contact.role)+'</b> · '+safe(contact.group)+'</p><p>'+safe(contact.sentence)+'</p>'+
        '<fieldset><legend>RESULT QUALITY</legend><label><input type="radio" name="gq" value="limited"> Limited</label><label><input type="radio" name="gq" value="standard" checked> Standard</label><label><input type="radio" name="gq" value="great"> Great</label></fieldset>'+
        '<button id="askContact" class="primary">GATHER INFORMATION</button><div id="gatherAnswer" class="intelResult"><span>Choose a result quality and ask the question.</span></div>';
      detail.querySelector('#askContact').onclick=()=>detail.querySelector('#gatherAnswer').innerHTML=gatherResult(contact.name,detail.querySelector('input[name="gq"]:checked').value);
      detail.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  }
  function bindAtmo(){
    document.getElementById('atmoToggle')?.addEventListener('click',async()=>{
      if(config.playing)stop();else await start();
      renderCurrent();
    });
    document.querySelectorAll('[data-scene]').forEach(button=>button.onclick=()=>setScene(button.dataset.scene));
    document.querySelectorAll('[data-music]').forEach(button=>button.onclick=()=>setMusic(button.dataset.music));
    document.querySelectorAll('[data-mix]').forEach(input=>input.oninput=()=>{
      config.mix[input.dataset.mix]=Number(input.value);
      document.getElementById('out-'+input.dataset.mix).textContent=input.value+'%';
      setLiveMix(input.dataset.mix);
      persist();
    });
  }
  const baseRender=window.render;
  function renderCurrent(){
    baseRender();
    if(state.page==='atmosphere'){
      $('#main').innerHTML=atmospherePage();
      bindAtmo();
    }
    if(state.page==='gather'){
      $('#main').innerHTML=gatherPage();
      bindGather();
    }
  }
  if(!nav.some(item=>item[0]==='atmosphere'))nav.splice(nav.findIndex(item=>item[0]==='gather'),0,['atmosphere','♨','Atmosphere','Set the Mood']);
  window.render=renderCurrent;
  renderCurrent();
  window.addEventListener('beforeunload',stop);
})();
