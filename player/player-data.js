/* Player-facing campaign data only. Keep GM notes and unrevealed information out of this file. */
window.PLAYER_LEDGER = {
  crew: { name: 'The Sneaks', type: 'Shadows', tier: 'II', hold: 'Limited', reputation: 'Dangerous' },
  score: { title: 'No score is currently shared', detail: 'When the GM reveals a job, its player-safe briefing will appear here.' },
  districts: [
    ['Barrowcleft', 'Canal-edge streets, labourers, and old burial grounds.'],
    ['Brightstone', 'The wealthy district: estates, galleries, and well-guarded secrets.'],
    ["Charhollow", 'Crowded homes, hard work, and more eyes than anyone expects.'],
    ["Coalridge", 'Factories, rail lines, smoke, and the people who keep the city moving.'],
    ["Crow’s Foot", 'A volatile crossroads of old claims, narrow streets, and gang pressure.'],
    ["The Docks", 'Ships, cargo, leviathan crews, and trouble carried in from the Void Sea.'],
    ['Dunslough', 'A low, crowded district where survival comes before comfort.'],
    ['Nightmarket', 'Exotic goods, rare finds, and stranger deals—especially after dark.'],
    ['Six Towers', 'Fading noble homes, quiet lanes, and a great deal left unsaid.'],
    ['Silkshore', 'Theatre, vice, fine clothes, and influential patrons.'],
    ['Whitehollow', 'Gentry residences, old power, and very controlled appearances.'],
    ['The Deathlands', 'Beyond the lightning barrier: dangerous, haunted, and not for casual travel.']
  ],
  faces: [
    { name: 'Quellyn', role: 'Witch · Crew Contact', place: 'Six Towers', tone: 'trusted', desc: 'A young witch who lives in a small Six Towers cottage. The Sneaks have helped her before.' }
  ],
  factions: [
    { name: 'Gray Cloaks', status: 'Favourable', desc: 'The crew has their favour. The original reason has been lost to time.' },
    { name: 'Wraiths', status: 'Working arrangement', desc: 'The Sneaks have been paying tribute for the Nightmarket hunting ground.' },
    { name: 'Grinders', status: 'Hostile', desc: 'They are angry with the crew after a theft.' }
  ],
  clues: []
};
