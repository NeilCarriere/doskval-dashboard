// Core Blades in the Dark faction baseline for the Doskval Dashboard.
// Canon is the starting state; campaign changes stored in state override it.
(function(){
  const coreAdditions=[
    ['The Unseen','IV','Strong','Underworld'],
    ['The Circle of Flame','III','Strong','Underworld'],
    ['Lord Scurlock','III','Strong','Underworld'],
    ['The Fog Hounds','I','Weak','Underworld'],
    ['The Lost','I','Weak','Underworld'],
    ['Ulf Ironborn','I','Strong','Underworld'],
    ['Imperial Military','VI','Strong','Institutions'],
    ['City Council','V','Strong','Institutions'],
    ['Leviathan Hunters','V','Strong','Institutions'],
    ['Ministry of Preservation','V','Strong','Institutions'],
    ['Ironhook Prison','IV','Strong','Institutions'],
    ['Sparkwrights','IV','Strong','Institutions'],
    ['Iruvian Consulate','III','Strong','Institutions'],
    ['Skovlan Consulate','III','Weak','Institutions'],
    ['The Brigade','II','Strong','Institutions'],
    ['Dagger Isles Consulate','I','Strong','Institutions'],
    ['Severosi Consulate','I','Strong','Institutions'],
    ['The Foundation','IV','Strong','Labor & Trade'],
    ['Dockers','III','Strong','Labor & Trade'],
    ['Laborers','III','Weak','Labor & Trade'],
    ['Sailors','III','Weak','Labor & Trade'],
    ['Cabbies','II','Weak','Labor & Trade'],
    ['Cyphers','II','Strong','Labor & Trade'],
    ['Ink Rakes','II','Weak','Labor & Trade'],
    ['Rail Jacks','II','Weak','Labor & Trade'],
    ['Servants','II','Weak','Labor & Trade'],
    ['The Forgotten Gods','III','Weak','The Fringe'],
    ['The Horde','III','Strong','The Fringe'],
    ['The Path of Echoes','III','Strong','The Fringe'],
    ['The Reconciled','III','Strong','The Fringe'],
    ['Skovlander Refugees','III','Weak','The Fringe'],
    ['Deathlands Scavengers','II','Weak','The Fringe'],
    ['The Weeping Lady','II','Weak','The Fringe']
  ];
  const deepCutsAdditions=[
    ['Covenant','VI','Strong','Institutions','A major Imperial institution expanded in Deep Cuts.'],
    ['Unity Commission','V','Strong','Institutions','A major civic institution introduced in Deep Cuts.'],
    ['Rowan House','IV','Strong','Institutions','A powerful institution introduced in Deep Cuts.'],
    ['Ironworks Labor','II','Strong','Labor & Trade','Coalridge and Charhollow laborers organizing against brutal conditions and union busting.'],
    ['Ragskulla','II','Strong','The Fringe','A fringe faction introduced in Deep Cuts.']
  ];

  const existing=new Set(factions.map(f=>f.name));
  coreAdditions.forEach(([name,tier,hold,category])=>{
    if(!existing.has(name)) factions.push({
      name,tier,hold,category,crew:0,icon:'◇',
      canon:`Published Core faction · ${category}. Tier ${tier}, ${hold.toLowerCase()} hold.`,
      source:'Core rulebook'
    });
  });
  deepCutsAdditions.forEach(([name,tier,hold,category,canon])=>{
    if(!existing.has(name)) factions.push({name,tier,hold,category,crew:0,icon:'◇',canon,source:'Deep Cuts'});
  });

  const addRel=(a,b,status,why)=>{const k=relationKey(a,b); if(!baselineRels[k]) baselineRels[k]={status,why};};

  ['Imperial Military','Sailors','Severosi Consulate'].forEach(x=>addRel('The Silver Nails',x,'friendly','Core canon: listed ally of the Silver Nails.'));
  ['The Circle of Flame','The Grinders','Skovlan Consulate','Skovlander Refugees','Spirit Wardens'].forEach(x=>addRel('The Silver Nails',x,'hostile','Core canon: listed enemy of the Silver Nails.'));

  ['The Lampblacks'].forEach(x=>addRel('Gondoliers',x,'friendly','Core canon: listed ally of the Gondoliers.'));
  ['The Red Sashes','Spirit Wardens'].forEach(x=>addRel('Gondoliers',x,'hostile','Core canon: listed enemy of the Gondoliers.'));

  ['Dockers','The Lampblacks'].forEach(x=>addRel('The Fog Hounds',x,'friendly','Core canon: listed ally of the Fog Hounds.'));
  ['Bluecoats'].forEach(x=>addRel('The Fog Hounds',x,'hostile','Core canon: listed enemy of the Fog Hounds.'));

  ['City Council','Leviathan Hunters','Ministry of Preservation'].forEach(x=>addRel('Sparkwrights',x,'friendly','Core canon: listed ally of the Sparkwrights.'));
  ['The Path of Echoes','The Reconciled','The Foundation'].forEach(x=>addRel('Sparkwrights',x,'hostile','Core canon: listed enemy of the Sparkwrights.'));
  addRel('Sailors','Imperial Military','hostile','Deep Cuts: forced military conscription puts the Sailors in direct conflict with Imperial forces.');
  addRel('Ironworks Labor','Bluecoats','hostile','Deep Cuts: Bluecoat union-busting puts them directly against organized labor.');
  addRel('Ironworks Labor','City Council','hostile','Deep Cuts: the Council opposes the labor movement and its demands.');
  addRel('Ironworks Labor','The Lampblacks','friendly','Deep Cuts lists the Lampblacks among Ironworks Labor’s allies.');

  const byName=Object.fromEntries(factions.map(f=>[f.name,f]));
  const deepCutsExpanded=new Set(['The Hive','The Circle of Flame','The Silver Nails','Lord Scurlock','The Crows','The Lampblacks','The Red Sashes','The Dimmer Sisters','City Council','Ministry of Preservation','Ironhook Prison','Sparkwrights','The Foundation','Dockers','Gondoliers','Church of Ecstasy','The Forgotten Gods','The Reconciled','Skovlander Refugees','Deathlands Scavengers']);
  deepCutsExpanded.forEach(name=>{if(byName[name])byName[name].source='Core Book + Deep Cuts';});
  if(byName['The Crows']) byName['The Crows'].canon='Tier II, weak hold. Lyssa leads after Roric’s death; Crow’s Foot begins in a volatile three-way struggle.';
  if(byName['The Lampblacks']) byName['The Lampblacks'].canon='Tier II, weak hold. One of the central powers in the starting war in Crow’s Foot.';
  if(byName['The Red Sashes']) byName['The Red Sashes'].canon='Tier II, weak hold. One of the central powers in the starting war in Crow’s Foot.';
  if(byName['The Silver Nails']) byName['The Silver Nails'].canon='Tier III, strong hold. Severosi mercenaries and renowned ghost killers, pushing toward the Lost District.';
  if(byName['Gondoliers']) byName['Gondoliers'].canon='Tier III, strong hold. Ancient canal operators with occult knowledge and a long tradition of dealing with supernatural threats.';

  factions.sort((a,b)=>{
    const tier=n=>({VI:6,V:5,IV:4,III:3,II:2,I:1}[n.tier]||0);
    return tier(b)-tier(a)||a.name.localeCompare(b.name);
  });

  const webPriority=['The Crows','The Lampblacks','The Red Sashes','The Wraiths','Gray Cloaks','The Grinders','The Dimmer Sisters','The Hive','The Silver Nails','Spirit Wardens','Bluecoats','Lord Scurlock'];
  const ordered=[];
  webPriority.forEach(n=>{const i=factions.findIndex(f=>f.name===n);if(i>=0) ordered.push(...factions.splice(i,1));});
  factions.unshift(...ordered);

  if(typeof render==='function') render();
})();
