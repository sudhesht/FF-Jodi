// scripts/sensitivity-ui.js
// UI logic for the Free Fire Sensitivity panel. Uses window.ffSensitivity (data/sensitivity.js)
(function(){
  function $(id){ return document.getElementById(id); }

  function buildBrandList(){
    const brands = [];
    const profiles = (window.ffSensitivity && window.ffSensitivity.profiles) || [];
    profiles.forEach(p=>{ if(!brands.includes(p.brand)) brands.push(p.brand); });
    const sel = $('brandSelect');
    sel.innerHTML = '<option value="">Select brand</option>' + brands.map(b=>`<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join('');
  }

  function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  let currentProfile = null;
  let baseProfile = null;

  function renderModelList(filteredProfiles){
    const root = $('modelList');
    root.innerHTML = '';
    if(!filteredProfiles || filteredProfiles.length===0){ root.innerHTML = '<div class="muted">No models — try selecting a brand or searching.</div>'; return; }
    filteredProfiles.forEach(p=>{
      const btn = document.createElement('button');
      btn.className = 'model-item';
      btn.textContent = `${p.brand} · ${p.model}`;
      btn.onclick = ()=>{ selectProfile(p); };
      root.appendChild(btn);
    });
  }

  function selectProfile(p){
    baseProfile = JSON.parse(JSON.stringify(p)); // clone
    currentProfile = JSON.parse(JSON.stringify(p));
    // set playstyle default to Balanced
    $('playstyleSelect').value = 'Balanced';
    renderProfileValues(currentProfile.values);
  }

  function renderProfileValues(values){
    // Values must display on 0..200 scale
    $('sensiGeneral').textContent = window.ffSensitivity && window.ffSensitivity.clamp ? window.ffSensitivity.clamp(values.general) : values.general;
    $('sensiRedDot').textContent = window.ffSensitivity && window.ffSensitivity.clamp ? window.ffSensitivity.clamp(values.redDot) : values.redDot;
    $('sensi2x').textContent = window.ffSensitivity && window.ffSensitivity.clamp ? window.ffSensitivity.clamp(values.x2) : values.x2;
    $('sensi4x').textContent = window.ffSensitivity && window.ffSensitivity.clamp ? window.ffSensitivity.clamp(values.x4) : values.x4;
    $('sensiSniper').textContent = window.ffSensitivity && window.ffSensitivity.clamp ? window.ffSensitivity.clamp(values.sniper) : values.sniper;
    $('sensiFreeLook').textContent = window.ffSensitivity && window.ffSensitivity.clamp ? window.ffSensitivity.clamp(values.freeLook) : values.freeLook;
  }

  function applyPlaystyleAdjustment(style){
    if(!baseProfile) return;
    const v = Object.assign({}, baseProfile.values);
    const mul = {general:1, redDot:1, x2:1, x4:1, sniper:1, freeLook:1};
    // conservative multipliers
    switch(style){
      case 'Rush': mul.general = 1.04; mul.freeLook = 1.05; mul.redDot = 1.03; break;
      case 'Drag Headshot': mul.general = 1.03; mul.redDot = 1.06; mul.x2 = 1.04; break;
      case 'Long Range': mul.sniper = 1.10; mul.x4 = 1.06; mul.x2 = 1.03; mul.general = 0.98; break;
      case 'Short Range': mul.general = 1.06; mul.redDot = 1.06; mul.sniper = 0.95; break;
      case 'Sniper': mul.sniper = 1.12; mul.x4 = 1.08; mul.freeLook = 0.92; mul.general = 0.96; break;
      default: break; // Balanced
    }
    const adjusted = {
      general: window.ffSensitivity.clamp(v.general * mul.general),
      redDot: window.ffSensitivity.clamp(v.redDot * mul.redDot),
      x2: window.ffSensitivity.clamp(v.x2 * mul.x2),
      x4: window.ffSensitivity.clamp(v.x4 * mul.x4),
      sniper: window.ffSensitivity.clamp(v.sniper * mul.sniper),
      freeLook: window.ffSensitivity.clamp(v.freeLook * mul.freeLook)
    };
    currentProfile.values = adjusted;
    renderProfileValues(adjusted);
  }

  function onBrandChange(){
    const brand = $('brandSelect').value;
    const profiles = (window.ffSensitivity && window.ffSensitivity.profiles) || [];
    const filtered = brand ? profiles.filter(p=>p.brand === brand) : profiles;
    renderModelList(filtered);
  }

  function onSearchInput(){
    const q = $('modelSearch').value || '';
    const results = window.ffSensitivity && window.ffSensitivity.searchProfiles ? window.ffSensitivity.searchProfiles(q) : [];
    renderModelList(results);
  }

  function copyProfile(){
    if(!currentProfile) return;
    const text = window.ffSensitivity && window.ffSensitivity.profileToText ? window.ffSensitivity.profileToText(currentProfile) : JSON.stringify(currentProfile.values, null, 2);
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(()=>{ showToast('Sensitivity copied to clipboard'); }).catch(()=>{ fallbackCopy(text); });
    } else fallbackCopy(text);
  }

  function fallbackCopy(text){
    const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); showToast('Sensitivity copied to clipboard'); }catch(e){ alert('Copy failed — please select and copy manually'); } document.body.removeChild(ta);
  }

  function resetProfile(){ if(!baseProfile) return; currentProfile = JSON.parse(JSON.stringify(baseProfile)); renderProfileValues(currentProfile.values); $('playstyleSelect').value = 'Balanced'; }

  function showToast(msg){
    let t = document.getElementById('ffj-toast');
    if(!t){ t = document.createElement('div'); t.id='ffj-toast'; t.className='ffj-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.style.opacity = 1; setTimeout(()=>{ t.style.opacity = 0; }, 1600);
  }

  // Init function exposed so index.html can call after DOM ready
  window.initSensitivityUI = function(){
    try{
      buildBrandList();
      $('modelSearch').addEventListener('input', debounce(onSearchInput, 180));
      $('brandSelect').addEventListener('change', onBrandChange);
      $('playstyleSelect').addEventListener('change', function(){ applyPlaystyleAdjustment(this.value); });
      $('copySensiBtn').addEventListener('click', copyProfile);
      $('resetSensiBtn').addEventListener('click', resetProfile);

      // Auto-populate with all profiles initially
      renderModelList((window.ffSensitivity && window.ffSensitivity.profiles) || []);
    }catch(e){ console.error('Sensitivity UI init error', e); }
  };

  // debounce helper
  function debounce(fn, ms){ let t; return function(){ clearTimeout(t); t = setTimeout(()=>fn.apply(this, arguments), ms); }; }

  // CSS for toast and model items (minimal, kept here so we don't need to edit style.css)
  const css = `
    .model-list{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
    .model-item{padding:8px 10px;border-radius:8px;border:1px solid rgba(27,24,39,.06);background:#fff;cursor:pointer}
    .sensi-row{display:flex;gap:8px}
    .sensi-card{margin-top:12px;padding:12px;border-radius:10px;background:linear-gradient(90deg,#fff,#fbfbff);}
    .sensi-table{width:100%;border-collapse:collapse}
    .sensi-table td{padding:6px 8px}
    .sensi-actions{display:flex;gap:8px;margin-top:8px}
    .sensi-disclaimer{font-size:13px;color:#6b6b8a;margin-top:8px}
    .ffj-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:24px;background:#111;color:#fff;padding:8px 12px;border-radius:8px;opacity:0;transition:opacity .25s}
  `;
  const styleEl = document.createElement('style'); styleEl.textContent = css; document.head.appendChild(styleEl);
})();
