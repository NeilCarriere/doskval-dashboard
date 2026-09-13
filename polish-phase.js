// Polish Phase — a final compatibility layer for the live Doskvol Dashboard.
// It keeps the established map, faction, NPC, and local-save systems intact.
(function () {
  const E = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);

  const retiredPages = new Set(['advance', 'settings', 'lore']);
  function tuneNavigation() {
    for (let index = nav.length - 1; index >= 0; index -= 1) {
      if (retiredPages.has(nav[index][0])) nav.splice(index, 1);
    }
    const mapIndex = nav.findIndex(item => item[0] === 'map');
    const factionIndex = nav.findIndex(item => item[0] === 'factions');
    if (mapIndex > factionIndex && factionIndex >= 0) {
      const [mapItem] = nav.splice(mapIndex, 1);
      nav.splice(factionIndex, 0, mapItem);
    }
    const webItem = nav.find(item => item[0] === 'web');
    if (webItem) {
      webItem[2] = 'Relations';
      webItem[3] = 'Faction Web';
    }
  }

  tuneNavigation();

  const scoreSparkExpansion = [
    'A railway switchman has one chance to divert a sealed carriage before the Ministry notices the discrepancy.',
    'A Brightstone collector wants a scandal removed from an auction catalogue before the first guest arrives.',
    'A mourning family hires deniable hands to retrieve a ghost bottle before the Spirit Wardens inventory the dead.',
    'A canal lock has been jammed with something that should not float; three factions want it before dawn.',
    'A document courier is carrying two mutually contradictory orders, and neither patron knows the other exists.',
    'A forgotten service tunnel beneath Charterhall opens only while the evening bell is ringing.',
    'Someone is selling a map of the Lost District that is accurate enough to get a crew killed.',
    'A masked seller at Nightmarket offers a reliquary to the first buyer who can prove it is not cursed.',
    'A disgraced noble needs one impossible room entered before a rival’s house party ends.',
    'A severed electroplasm line has left a whole block dark—and made one guarded vault suddenly vulnerable.',
    'A Bluecoat evidence clerk wants a single ledger removed, but the ledger has already attracted another buyer.',
    'A demon’s debt is being collected through perfectly ordinary rent notices in Silkshore.',
    'A barge carrying refinery blood will dock for seven minutes with its manifest deliberately wrong.',
    'An Ironhook work gang has found something in the mud that every prisoner is pretending not to see.',
    'A famous duel is cover for an exchange of blackmail; the seconds need someone who can move unseen.',
    'A private séance is about to expose the wrong murderer unless the room is altered before the spirit arrives.',
    'A factory foreman is paying two rival gangs for protection and cannot afford either to learn it.',
    'A stolen painting is only valuable because of the message hidden under its last layer of varnish.',
    'A leviathan-hunter captain has a captive witness aboard ship and leaves port at first bell.',
    'A respected charity’s food carts are being used to move an item no one is willing to name aloud.',
    'A new drug has made its buyers briefly able to hear ghosts; its maker needs the first batch recovered.',
    'A coach driver has been making the same midnight detour for weeks, but only on foggy nights.',
    'A Whisper’s apprentice has vanished with a ritual key and a list of everyone who could use it.',
    'A set of counterfeit Spirit Warden masks has reached the street before their owner can retrieve them.',
    'A rail-jack has seen a deathlands route that bypasses customs, but the route is only safe for one night.',
    'A corpse has been delivered to Bellweather under a false name, and its real identity changes a faction war.',
    'A broker offers a clean score against the Hive, but wants the crew to leave one specific thing untouched.',
    'A theatre’s opening-night illusion is actually a containment ward; someone intends to break it for the finale.',
    'A forged inheritance makes one person rich and another person legally dead; both need the papers first.',
    'An accountant has hidden coin in a tenement’s communal boiler and hired different crews to collect it.',
    'A stray hull has appeared in the harbor with no crew, no name, and a cargo that hums at low tide.',
    'A fixer wants a dangerous prisoner transferred to a different cell without any guard noticing the switch.',
    'An outlaw printer has one night to move a press before the Bluecoats raid the wrong building.',
    'A ruined manor’s servants have begun receiving instructions from a voice in the walls.',
    'A child has been drawing the floor plan of a place no adult in the district admits exists.',
    'A merchant family is hiring thieves to steal back a public gift before its supernatural flaw is discovered.',
    'A widow wants a sealed letter from her husband’s ghost, but the ghost has sold it to someone else.',
    'A smuggler’s safehouse is empty except for a wounded stranger and an impossible amount of bloodless coin.',
    'An official parade gives a rival a moving blind spot through Whitecrown—if the crew can keep pace.',
    'A faction lieutenant has begun using a laundress’s delivery route to pass coded messages across the city.',
    'A new fence claims to have a buyer for any relic, but every seller who takes the deal loses a memory.',
    'A council aide needs a compromising guest removed from a locked carriage without delaying the train.',
    'A stolen blueprint shows a shortcut into a lightning-barrier relay, and every copy is already compromised.',
    'A public execution will create a ghost at noon unless someone changes what the crowd believes happened.',
    'A derelict gondola surfaces with a live passenger, a dead captain, and a cargo tag from a vanished company.',
    'A radical cell needs proof of corruption delivered to the Ink Rakes before their source is disappeared.',
    'A private collector is hosting a game where the stakes are favors, secrets, and one artifact that should not exist.',
    'A noble’s body double has stopped showing up for appointments, making a staged appearance suddenly urgent.',
    'A funeral procession will cross three hostile turfs carrying a box that none of the mourners are allowed to open.',
    'A bookbinder has discovered a confession stitched into a volume being sent to the Circle of Flame.',
    'A small debt has become dangerous because its creditor is now a ghost with a legal claim.',
    'A charming con artist has sold the same impossible job to the crew, the Crows, and the Red Sashes.',
    'A dredging crew pulled up a brass door from the canal and plans to sell it before anyone asks where it came from.',
    'A traitor wants extraction from a faction meeting but insists that the meeting must appear to continue normally.',
    'A tenant’s eviction notice is a coded warning that an entire building is about to be searched.',
    'A caged spirit knows where a score went wrong years ago, but it only answers one question per person.',
    'A forgotten god’s procession is being rehearsed in a warehouse where the wrong witnesses may recognize the route.',
    'An actor has been hired to impersonate a dead magistrate long enough to sign one document.',
    'A scavenger needs escorts through the rail yards to collect a cache before someone’s clock reaches midnight.',
    'A faction wants a rival embarrassed, not harmed: replace one ceremonial object during a crowded public rite.'
  ];
  scoreHooks.push(...scoreSparkExpansion.filter(hook => !scoreHooks.includes(hook)));

  const bargainExpansion = [
    'Leave a recognizable piece of evidence behind; the Bluecoats will know the crew was involved.',
    'A witness sees your face and remembers one useful detail about you.',
    'Take +1 Heat after the score, whether the action succeeds or fails.',
    'A rival faction learns the target, route, or purpose of this job.',
    'A current ally hears a version of this that makes them doubt your motives.',
    'Someone innocent is blamed first unless the crew spends time clearing their name.',
    'A faction clock gains one segment because you made this move.',
    'A contact has to burn a favour to help; they will need something back later.',
    'You leave a trace in an occult field that a Whisper can follow.',
    'Your disguise or cover identity works now, but it cannot be used again.',
    'The crew owes a small but specific favour to the person who made this possible.',
    'A useful item is damaged, depleted, or left behind during the action.',
    'The target recognizes the crew’s style even if they do not know individual names.',
    'A neutral faction decides this was an insult and starts wary of the crew.',
    'An innocent bystander is hurt, displaced, frightened, or put at risk by the fallout.',
    'The score creates an inconvenient ghost or supernatural echo that must be dealt with later.',
    'A valuable secret becomes public to the wrong audience.',
    'A rival gets the same opportunity and now knows the crew is competing for it.',
    'The crew gains the prize, but the person who wanted it learns who took it.',
    'Someone you rely on is called in for questioning because of this move.',
    'A door is opened now, but it can never be used as a quiet route again.',
    'A faction hears that the Sneaks were involved and demands an explanation before the next score.',
    'The action leaves an unpaid debt, bribe, or replacement cost that becomes due after the score.',
    'A trusted contact is seen with the crew and suffers social or faction pressure for it.',
    'The crew’s name becomes useful to someone who wants to impersonate them.',
    'A piece of evidence points at another crew, creating an ugly future misunderstanding.',
    'A valuable tool is left with the target; recover it later or lose it permanently.',
    'A witness survives and starts telling a distorted but dangerous story about what happened.',
    'A faction gains leverage over the crew’s hunting ground or a favourite local route.',
    'The action causes collateral property damage that someone ordinary cannot afford to absorb.',
    'A helpful rumor spreads, but it identifies the crew as capable enough to attract dangerous work.',
    'A Bluecoat patrol starts paying special attention to this district for the next few weeks.',
    'The crew’s escape leaves behind a personal possession that can be used as leverage.',
    'A spirit notices the crew and follows at a distance until someone deals with it.',
    'The job’s real patron learns the crew can be manipulated by a false premise.',
    'A friend’s name appears in a ledger, registry, or whispered report connected to the action.',
    'Someone loses a job, home, or standing because the crew changes the situation this way.',
    'The crew must choose later between keeping the prize and protecting an innocent person caught in the wake.',
    'The target will be guarded by a better prepared faction the next time the crew comes near it.',
    'A minor scandal becomes public and disrupts a contact’s relationship with their faction.',
    'An enemy gets a copy of the evidence, object, or information even if the crew succeeds.',
    'A favour is called in at a bad time: the crew must do a brief job for someone else before downtime.',
    'A known faction figure sees enough to form an opinion—and it is not a charitable one.',
    'The action taints a safe place; it will draw attention until the crew cleans up the consequence.',
    'The crew solves the immediate problem but moves a danger clock somewhere else in the city.',
    'A witness is willing to stay quiet only if the crew later helps them with a personal problem.',
    'The take is marked, traceable, haunted, or politically recognizable until it is laundered.',
    'A rival gets to name the story about what happened before the crew can control the narrative.',
    'The crew leaves someone owing them a debt they never wanted, and that resentment will matter later.',
    'A faction’s internal politics shift against a person the crew hoped to keep useful.',
    'The action makes a current local problem worse: more patrols, more fear, or a louder gang presence.',
    'An enemy learns a name, route, habit, or weak spot that should have remained private.',
    'The crew’s success forces a trusted contact to choose between them and their own people.',
    'Something stolen or damaged will create a public shortage that hits ordinary people first.',
    'A dangerous favor is now owed to a ghost, demon, cult, or occult intermediary.',
    'Someone records the crew’s involvement in a way that will surface at the worst possible moment.',
    'The action creates a false lead that will send an ally into danger unless the crew corrects it.',
    'A faction assumes the crew is taking a side in a conflict they hoped to avoid.',
    'The crew gets what they need, but an innocent person is now indebted to a crueler faction.',
    'A familiar place becomes unavailable until the crew repairs the damage or makes amends.',
    'A consequence lands on someone the crew cares about before it lands on the crew themselves.'
  ];
  bargains.push(...bargainExpansion.filter(bargain => !bargains.includes(bargain)));

  function migrateOldNavigationAndChecklist() {
    let changed = false;
    if (retiredPages.has(state.page)) {
      state.page = 'home';
      changed = true;
    }
    const oldItem = 'Advance faction clocks.';
    if (Array.isArray(state.next)) {
      const next = state.next.map(item => item === oldItem ? 'Review faction developments.' : item);
      if (next.some((item, index) => item !== state.next[index])) {
        state.next = next;
        changed = true;
      }
    }
    if (!state.polishPhaseOne) {
      state.polishPhaseOne = true;
      changed = true;
    }
    if (changed) save();
  }

  migrateOldNavigationAndChecklist();

  const mapFocus = ['The Crows', 'The Wraiths', 'Gray Cloaks', 'The Grinders', 'Bluecoats'];
  const mapWebPositions = [
    { x: 17, y: 28 }, { x: 81, y: 23 }, { x: 18, y: 76 }, { x: 82, y: 76 }, { x: 50, y: 91 }
  ];
  const statusFor = name => {
    const faction = factions.find(entry => entry.name === name);
    const value = state.factionStatus[name] ?? faction?.crew ?? 0;
    return value > 0 ? 'friendly' : value < 0 ? 'hostile' : 'neutral';
  };
  const relationshipLabel = name => {
    const faction = factions.find(entry => entry.name === name);
    const value = state.factionStatus[name] ?? faction?.crew ?? 0;
    return value >= 3 ? 'Allied' : value === 2 ? 'Friendly' : value === 1 ? 'Helpful' : value === 0 ? 'Neutral' : value === -1 ? 'Wary' : value === -2 ? 'Hostile' : 'At war';
  };

  function focusFactionFromMap(name) {
    state.page = 'web';
    save();
    window.render();
    requestAnimationFrame(() => {
      const node = [...document.querySelectorAll('.factionNode[data-focus]')]
        .find(button => button.dataset.focus === name);
      node?.click();
    });
  }

  function factionInsetHTML() {
    const nodes = mapFocus.map((name, index) => {
      const position = mapWebPositions[index];
      return `<button class="mapWebNode ${statusFor(name)}" style="--x:${position.x}%;--y:${position.y}%" data-map-web-focus="${E(name)}" aria-label="Open ${E(name)} in the Faction Web"><span>${E(name.split(' ').map(word => word[0]).join('').slice(0, 3))}</span><b>${E(name.replace(/^The\s+/, ''))}</b></button>`;
    }).join('');
    const lines = mapWebPositions.map((position, index) => `<line class="${statusFor(mapFocus[index])}" x1="50" y1="52" x2="${position.x}" y2="${position.y}"></line>`).join('');
    return `<section class="mapFactionInset" aria-label="Faction Web inset">
      <header><div><small>FACTION WEB · QUICK VIEW</small><h2>City pressure</h2></div><button class="mapWebExpand" data-map-web-expand>EDIT</button></header>
      <div class="mapWebStage">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>
        <button class="mapWebNode center" data-map-web-focus="The Sneaks" aria-label="Open The Sneaks in the Faction Web"><span>◈</span><b>The Sneaks</b></button>
        ${nodes}
      </div>
      <div class="mapWebLegend"><span class="friendly">Friendly</span><span class="neutral">Neutral</span><span class="hostile">Hostile</span></div>
      <p>GM decides the change. The dashboard keeps the thread.</p>
    </section>`;
  }

  function installMapInset() {
    const panel = document.querySelector('.cartographyPanel');
    if (!panel || panel.querySelector('.mapFactionInset')) return;
    panel.insertAdjacentHTML('beforeend', factionInsetHTML());
    panel.querySelectorAll('[data-map-web-focus]').forEach(button => {
      button.onclick = () => focusFactionFromMap(button.dataset.mapWebFocus);
    });
    panel.querySelector('[data-map-web-expand]')?.addEventListener('click', () => focusFactionFromMap('The Sneaks'));
  }

  function addNextSessionItem(form) {
    const input = form.querySelector('input');
    const item = input?.value.trim();
    if (!item) {
      input?.focus();
      return;
    }
    state.next = Array.isArray(state.next) ? state.next : [];
    state.next.push(item);
    save();
    window.render();
  }

  function recordManualDevelopment() {
    const update = prompt('Record a faction development or campaign change:');
    if (!update?.trim()) return;
    state.developments = [update.trim(), ...(state.developments || [])].slice(0, 12);
    save();
    window.render();
  }

  function installHomePolish() {
    const panels = [...document.querySelectorAll('.dashboard-grid > .panel')];
    const sessionPanel = panels.find(panel => panel.querySelector('.checklist'));
    if (sessionPanel && !sessionPanel.querySelector('.polishNextEditor')) {
      const editor = document.createElement('form');
      editor.className = 'polishNextEditor';
      editor.innerHTML = '<input type="text" maxlength="120" placeholder="Add a next-session item…" aria-label="Add a next-session item"><button type="submit">ADD ITEM</button>';
      editor.addEventListener('submit', event => {
        event.preventDefault();
        addNextSessionItem(editor);
      });
      sessionPanel.querySelector('.checklist')?.after(editor);
    }

    const developmentsPanel = panels.find(panel => panel.querySelector('.developments'));
    const button = developmentsPanel?.querySelector('header button');
    if (button && !button.dataset.manualDevelopment) {
      button.dataset.manualDevelopment = 'true';
      button.removeAttribute('data-page');
      button.textContent = 'RECORD CHANGE';
      button.title = 'Record a GM-decided faction or campaign development';
      button.onclick = recordManualDevelopment;
    }
  }

  function chooseBargain(redraw = false) {
    if (!state.activeDevilsBargain || redraw) {
      const choices = bargains.filter(bargain => bargain !== state.activeDevilsBargain);
      state.activeDevilsBargain = choices[Math.floor(Math.random() * choices.length)] || bargains[0];
      save();
    }
    return state.activeDevilsBargain;
  }

  const devilIcon = `<svg class="devilMark" viewBox="0 0 64 64" aria-hidden="true"><path d="M18 11c4 3 8 7 9 13m19-13c-4 3-8 7-9 13M19 29c0 16 7 24 13 24s13-8 13-24c0-7-5-13-13-13s-13 6-13 13Z"/><path d="M25 31h.1m14-.1h.1M26 42c4 3 8 3 12 0M32 54v7m-7-11 7 4 7-4"/></svg>`;

  function devilBargainHTML() {
    return `<section class="panel devilsBargainPanel" aria-live="polite">
      <header><span>${devilIcon}</span><div><p>DEVIL'S BARGAIN</p><h2>More power. A higher price.</h2></div><button type="button" class="drawBargain" data-draw-bargain>DRAW ANOTHER</button></header>
      <div class="devilBargainBody"><div class="devilSeal">${devilIcon}</div><div><p id="activeDevilsBargain">${E(chooseBargain())}</p><small>A bargain happens regardless of the roll. Take it for +1d only if it fits this moment.</small></div><button type="button" class="applyBargain" data-apply-bargain>USE FOR +1D</button></div>
    </section>`;
  }

  function installDevilsBargain() {
    const main = document.getElementById('main');
    const anchor = main?.querySelector('.two');
    if (!main || !anchor || main.querySelector('.devilsBargainPanel')) return;
    anchor.insertAdjacentHTML('afterend', devilBargainHTML());
    const panel = main.querySelector('.devilsBargainPanel');
    panel?.querySelector('[data-draw-bargain]')?.addEventListener('click', () => {
      const output = panel.querySelector('#activeDevilsBargain');
      if (output) output.textContent = chooseBargain(true);
      panel.classList.remove('applied');
    });
    panel?.querySelector('[data-apply-bargain]')?.addEventListener('click', event => {
      const checkbox = document.getElementById('push');
      if (checkbox) checkbox.checked = true;
      panel.classList.add('applied');
      event.currentTarget.textContent = checkbox ? '+1D READY' : 'BARGAIN READY';
    });
  }

  function openContact(name) {
    state.page = 'faces';
    save();
    window.render();
    requestAnimationFrame(() => {
      const tile = [...document.querySelectorAll('.npcTile[data-npc]')]
        .find(button => button.dataset.npc === name);
      tile?.click();
    });
  }

  function renderGatherInformation() {
    const main = document.getElementById('main');
    if (!main || main.querySelector('.polishGatherPage')) return;
    const contacts = (window.DOSKVAL_NPCS || []).filter(person => person.kind === 'contact');
    main.innerHTML = `<div class="polishGatherPage">
      <div class="pagehead"><div><p>DOSKVAL · HUMAN INTELLIGENCE</p><h2>Gather Information</h2><span>Choose the contact whose knowledge fits the question. Their full information tool opens with the person.</span></div><b>◉ ✦ ◉</b></div>
      <section class="polishGatherLead"><div><small>THE SNEAKS' NETWORK</small><h2>${contacts.length} usable contacts</h2><p>Each contact keeps their own specialties, current activity, rumors, and Limited / Standard / Great information generator.</p></div><span>ASK THE RIGHT PERSON</span></section>
      <div class="polishContactGrid">${contacts.map(person => `<button class="polishContactCard ${E(person.status).toLowerCase()}" data-polish-contact="${E(person.name)}"><small>${E(person.group)}</small><h3>${E(person.name)}</h3><b>${E(person.role)}</b><p>${E(person.desc)}</p><span>OPEN CONTACT INTEL →</span></button>`).join('')}</div>
    </div>`;
    main.querySelectorAll('[data-polish-contact]').forEach(button => {
      button.onclick = () => openContact(button.dataset.polishContact);
    });
  }

  function installFactionCue() {
    const heading = document.querySelector('.factionPageHead');
    if (!heading || heading.querySelector('.polishFactionCue')) return;
    const cue = document.createElement('small');
    cue.className = 'polishFactionCue';
    cue.textContent = 'GM decides the change. The dashboard tracks it.';
    heading.querySelector('div')?.appendChild(cue);
  }

  function enhanceCurrentPage() {
    if (state.page === 'home') installHomePolish();
    if (state.page === 'oracle') installDevilsBargain();
    if (state.page === 'map') installMapInset();
    if (state.page === 'gather') renderGatherInformation();
    if (state.page === 'web') installFactionCue();
  }

  const previousRender = window.render;
  window.render = function polishRender() {
    previousRender();
    enhanceCurrentPage();
    requestAnimationFrame(enhanceCurrentPage);
  };

  let enhancementQueued = false;
  const main = document.getElementById('main');
  if (main) {
    new MutationObserver(() => {
      if (enhancementQueued) return;
      enhancementQueued = true;
      requestAnimationFrame(() => {
        enhancementQueued = false;
        enhanceCurrentPage();
      });
    }).observe(main, { childList: true });
  }

  window.render();
})();
