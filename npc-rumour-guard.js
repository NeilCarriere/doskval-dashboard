// Stability guard for the NPC rumour panel.
// Load immediately before npc-functionality.js so its observer ignores its own lore-box writes.
(function(){
  const NativeMutationObserver=window.MutationObserver;
  window.MutationObserver=class RumourSafeMutationObserver extends NativeMutationObserver{
    constructor(callback){
      super((records,observer)=>{
        const useful=records.filter(record=>{
          const node=record.target;
          const el=node&&node.nodeType===1?node:node?.parentElement;
          return !(el&&el.closest&&el.closest('.npcLoreBox'));
        });
        if(useful.length) callback(useful,observer);
      });
    }
  };

  // These controls update their own panel. Prevent the later document-level refresh
  // handler from immediately rebuilding that panel and erasing the visible result.
  document.addEventListener('click',event=>{
    if(event.target?.closest?.('.rerollRumour, .contactIntel')) event.stopImmediatePropagation();
  });
})();
