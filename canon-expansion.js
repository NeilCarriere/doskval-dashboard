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

  const existing=new Set(factions.map(f=>f.name));
  coreAdditions.forEach(([name,tier,hold,category])=>{
    if(!existing.has(name)) factions.push({
      name,tier,hold,category,crew:0,icon:'◇',
      canon:`Published Core faction · ${category}. Tier ${tier}, ${hold.toLowerCase()} hold.`,
      source:'Core rulebook'
    });
  });

  // Explicit starting allies/enemies from core faction entries we have verified.
  const addRel=(a,b,status,why)=>{const k=relationKey(a,b); if(!baselineRels[k]) baselineRels[k]={status,why};};

  // Silver Nails
  ['Imperial Military','Sailors','Severosi Consulate'].forEach(x=>addRel('The Silver Nails',x,'friendly','Core canon: listed ally of the Silver Nails.'));
  ['The Circle of Flame','The Grinders','Skovlan Consulate','Skovlander Refugees','Spirit Wardens'].forEach(x=>addRel('The Silver Nails',x,'hostile','Core canon: listed enemy of the Silver Nails.'));

  // Gondoliers
  ['The Lampblacks'].forEach(x=>addRel('Gondoliers',x,'friendly','Core canon: listed ally of the Gondoliers.'));
  ['The Red Sashes','Spirit Wardens'].forEach(x=>addRel('Gondoliers',x,'hostile','Core canon: listed enemy of the Gondoliers.'));

  // Fog Hounds
  ['Dockers','The Lampblacks'].forEach(x=>addRel('The Fog Hounds',x,'friendly','Core canon: listed ally of the Fog Hounds.'));
  ['Bluecoats'].forEach(x=>addRel('The Fog Hounds',x,'hostile','Core canon: listed enemy of the Fog Hounds.'));

  // Sparkwrights
  ['City Council','Leviathan Hunters','Ministry of Preservation'].forEach(x=>addRel('Sparkwrights',x,'friendly','Core canon: listed ally of the Sparkwrights.'));
  ['The Path of Echoes','The Reconciled','The Foundation'].forEach(x=>addRel('Sparkwrights',x,'hostile','Core canon: listed enemy of the Sparkwrights.'));

  // Improve labels for already-present factions without overwriting campaign state.
  const byName=Object.fromEntries(factions.map(f=>[f.name,f]));
  if(byName['The Crows']) byName['The Crows'].canon='Tier II, weak hold. Lyssa leads after Roric’s death; Crow’s Foot begins in a volatile three-way struggle.';
  if(byName['The Lampblacks']) byName['The Lampblacks'].canon='Tier II, weak hold. One of the central powers in the starting war in Crow’s Foot.';
  if(byName['The Red Sashes']) byName['The Red Sashes'].canon='Tier II, weak hold. One of the central powers in the starting war in Crow’s Foot.';
  if(byName['The Silver Nails']) byName['The Silver Nails'].canon='Tier III, strong hold. Severosi mercenaries and renowned ghost killers, pushing toward the Lost District.';
  if(byName['Gondoliers']) byName['Gondoliers'].canon='Tier III, strong hold. Ancient canal operators with occult knowledge and a long tradition of dealing with supernatural threats.';

  // Make the faction page easier to browse: core baseline first, then campaign standing remains overlaid.
  factions.sort((a,b)=>{
    const tier=n=>({VI:6,V:5,IV:4,III:3,II:2,I:1}[n.tier]||0);
    return tier(b)-tier(a)||a.name.localeCompare(b.name);
  });

  // Keep the most campaign-relevant factions at the front of the visual web.
  const webPriority=['The Crows','The Lampblacks','The Red Sashes','The Wraiths','Gray Cloaks','The Grinders','The Dimmer Sisters','The Hive','The Silver Nails','Spirit Wardens','Bluecoats','Lord Scurlock'];
  const ordered=[];
  webPriority.forEach(n=>{const i=factions.findIndex(f=>f.name===n);if(i>=0) ordered.push(...factions.splice(i,1));});
  factions.unshift(...ordered.reverse());

  if(typeof render==='function') render();
})();