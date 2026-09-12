# Doskvol Dashboard

A private GM companion for our **Blades in the Dark** campaign, built for fast use at the table on iPad and desktop.

## First build

- Factions: illustrated faction seals, searchable intelligence ledger, campaign/whole-city relationship web, focus mode, editable standing, relationships and clocks, plus autosaving notes for every faction
- Locations: original interactive Doskvol cartography with zooming, district dossiers, faction and campaign layers, score opportunities, custom saved locations and district notes
- Clocks: 4/6/8 segment progress clocks
- Complications: quick prompts for success-with-a-complication results
- Devil's Bargains: quick bargain prompts with the devil-face visual language
- D6 Roller: one or more six-sided dice, roll history, eventual on-screen rolling animation
- Gather Information: source-specific generator on each crew-contact card, with Limited, Standard and Great information quality, named people, MacGuffins, canon locations, interested factions, time pressure and complications
- Crew: The Sneaks
- NPCs/Contacts: campaign-specific relationship tracking
- Session Notes: lightweight GM notes tied to factions, NPCs and locations

## Established campaign data

### Quellyn the Witch
Young witch living in Six Towers. She is the crew's only established contact so far. Her cottage has a small stone-fenced garden, mostly fungi and shade-growing things with a little magical help, and drying herbs hang from the ceiling. The Sneaks have completed two ingredient-theft jobs for her admirably and generated no Heat. Relationship: Established / Trusted.

### Faction relationships
- Gray Cloaks — Friendly. Origin established during crew creation; exact reason currently TBD.
- Wraiths — Working arrangement. Nightmarket is their hunting ground and The Sneaks have faithfully paid tribute.
- Grinders — Hostile/angered. The Sneaks stole from them.

## Visual direction

Industrial-gothic Doskvol atmosphere without sacrificing usability: charcoal/blue-black surfaces, aged cream typography, restrained bronze and faction accents, readable high contrast, fog/lantern/crow motifs, and a living-city feel.

The product name is **Doskvol Dashboard** regardless of the current repository spelling.

## Architecture

`index.html` loads the current dashboard in a deliberate order: the v3 application, canon expansion, visual layer, detailed lore, NPC gallery/portraits/functionality, and Crew HQ. Older experimental implementations have been removed so there is one live code path.

Faction seals use selected Font Awesome Free icons under CC BY 4.0; the bundled attribution and licence are in `assets/fontawesome-LICENSE.txt`.

Run `node scripts/validate.mjs` before publishing. It checks every referenced asset, validates each loaded JavaScript file, and confirms that the required source-layer and campaign markers remain present.
