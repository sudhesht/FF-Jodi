// scripts/selectors.js
// Mobile-friendly Gun and Character selectors for FF JODI
(function(){
  function createOverlay(id, title){
    const ov = document.createElement('div'); ov.id = id; ov.className = 'ffj-overlay';
    ov.innerHTML = `
      <div class="ffj-overlay-inner">
        <div class="ffj-overlay-header"><b>${title}</b><button class="ffj-close">✕</button></div>
        <div class="ffj-search"><input placeholder="Search..." class="ffj-search-input"></div>
        <div class="ffj-list"></div>
      </div>
    `;
    document.body.appendChild(ov);
    ov.querySelector('.ffj-close').addEventListener('click', ()=>{ ov.style.display='none'; });
    ov.querySelector('.ffj-search-input').addEventListener('input', function(){ renderList(ov, this.value); });
    return ov;
  }

  function renderList(ov, q){
    const list = ov.querySelector('.ffj-list'); list.innerHTML='';
    const type = ov.dataset.type; // 'gun' or 'char'
    const items = type === 'gun' ? (window.guns || []) : (window.characters || []);
    const term = (q||'').toLowerCase();
    items.forEach(it => {
      if(term && !(it.name.toLowerCase().includes(term) || (it.id && it.id.toLowerCase().includes(term)))) return;
      const row = document.createElement('button'); row.className='ffj-item';
      const img = document.createElement('img'); img.src = it.img || 'assets/placeholder.png'; img.alt = it.name; img.onerror = function(){ this.src='assets/placeholder.png'; };
      const span = document.createElement('span'); span.textContent = it.name;
      row.appendChild(img); row.appendChild(span);
      row.addEventListener('click', ()=>{ selectItem(type, it); ov.style.display='none'; });
      list.appendChild(row);
    });
  }

  function selectItem(type, item){
    if(type==='gun'){
      const active = document.activeElement;
      // Determine whether selecting for gun1 or gun2 by data attribute on inputs
      const gun1Input = document.getElementById('gun1');
      const gun2Input = document.getElementById('gun2');
      // We store lastWantedGun as 'gun1' or 'gun2'
      const wanted = window._ffj_lastWantedGun || 'gun1';
      if(wanted==='gun1'){
        // prevent selecting same as gun2
        if(gun2Input.value === item.name){ showToast('Gun 1 and Gun 2 must be different'); return; }
        gun1Input.value = item.name;
      } else {
        if(gun1Input.value === item.name){ showToast('Gun 1 and Gun 2 must be different'); return; }
        gun2Input.value = item.name;
      }
    } else {
      // character
      const charInput = document.getElementById('charSelectorDisplay');
      if(charInput) charInput.textContent = item.name;
      // store selected character id
      window._ffj_selectedChar = item.id || item.name;
    }
  }

  function showOverlay(type){
    const id = type==='gun' ? 'ffj-gun-overlay' : 'ffj-char-overlay';
    let ov = document.getElementById(id);
    if(!ov){ ov = createOverlay(id, type==='gun' ? 'Select Gun' : 'Select Character'); ov.dataset.type = type; }
    ov.style.display='block'; renderList(ov, ''); ov.querySelector('.ffj-search-input').value='';
  }

  function showToast(msg){
    let t = document.getElementById('ffj-toast');
    if(!t){ t = document.createElement('div'); t.id='ffj-toast'; t.className='ffj-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.style.opacity = 1; setTimeout(()=>{ t.style.opacity = 0; }, 1600);
  }

  // Hook inputs
  function hookSelectors(){
    const gun1 = document.getElementById('gun1');
    const gun2 = document.getElementById('gun2');
    // add a separate display for character selection if in Gun+Character mode
    // we will add an inline small display element near the tabs
    // create char display if not present
    let charDisp = document.getElementById('charSelectorDisplay');
    if(!charDisp){ charDisp = document.createElement('div'); charDisp.id='charSelectorDisplay'; charDisp.className='char-display'; charDisp.textContent='No character selected';
      const jodiPanel = document.querySelector('#jodi .panel'); if(jodiPanel) jodiPanel.appendChild(charDisp);
    }

    gun1.addEventListener('focus', ()=>{ window._ffj_lastWantedGun='gun1'; showOverlay('gun'); });
    gun1.addEventListener('click', ()=>{ window._ffj_lastWantedGun='gun1'; showOverlay('gun'); });
    gun2.addEventListener('focus', ()=>{ window._ffj_lastWantedGun='gun2'; showOverlay('gun'); });
    gun2.addEventListener('click', ()=>{ window._ffj_lastWantedGun='gun2'; showOverlay('gun'); });

    // also allow tapping the character display to open character selector when Gun+Character mode active
    charDisp.addEventListener('click', ()=>{ const activeTab = document.querySelector('.tabs .tab.active'); if(activeTab && activeTab.dataset.mode==='char'){ showOverlay('char'); } else { showToast('Switch to Gun + Character mode to pick a character'); } });
  }

  // Minimal styles for overlays & items
  const css = `
  .ffj-overlay{position:fixed;inset:0;background:rgba(9,10,25,0.6);display:none;align-items:flex-end;z-index:9999}
  .ffj-overlay-inner{background:#fff;border-top-left-radius:12px;border-top-right-radius:12px;padding:12px;max-height:80vh;overflow:hidden;width:100%}
  .ffj-overlay-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
  .ffj-search input, .ffj-search-input{width:100%;padding:10px;border-radius:8px;border:1px solid rgba(27,24,39,.06)}
  .ffj-list{overflow:auto;max-height:60vh;display:flex;flex-direction:column;gap:8px}
  .ffj-item{display:flex;align-items:center;gap:10px;border-radius:8px;padding:8px;border:1px solid rgba(27,24,39,.04);background:#fff}
  .ffj-item img{width:48px;height:36px;object-fit:contain;border-radius:6px}
  .char-display{margin-top:12px;padding:8px;background:linear-gradient(90deg,#fff,#fbfbff);border-radius:8px;border:1px solid rgba(27,24,39,.04);cursor:pointer}
  .ffj-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:24px;background:#111;color:#fff;padding:8px 12px;border-radius:8px;opacity:0;transition:opacity .25s;z-index:10000}
  `;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);

  // Initialize after DOM ready
  document.addEventListener('DOMContentLoaded', function(){
    try{ hookSelectors(); } catch(e){ console.error('Selector init error', e); }
  });
})();
