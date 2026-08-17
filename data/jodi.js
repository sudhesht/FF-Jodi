// data/jodi.js
// Central scoring utility for FF JODI. Uses guns[] and characters[] globals.
// All numbers are estimates for FF JODI compatibility scoring only.
(function(){
  function findGunByName(name){ return window.guns.find(g=>g.name===name || g.id===name); }
  function findCharByName(name){ return window.characters.find(c=>c.name===name || c.id===name); }

  // Rating mapping
  function ratingFromScore(score){
    if (score>=90) return {label:'EXCELLENT', emoji:'🏆'};
    if (score>=80) return {label:'GREAT', emoji:'🔥'};
    if (score>=70) return {label:'GOOD', emoji:'👍'};
    if (score>=50) return {label:'AVERAGE', emoji:'⚡'};
    return {label:'WEAK', emoji:'⚠️'};
  }

  // Compute compatibility breakdown and overall compatibility (0-100)
  function computeScore(g1, g2, mode='BR', style='Balanced', character=null){
    // Accept either objects or names
    if (typeof g1 === 'string') g1 = findGunByName(g1);
    if (typeof g2 === 'string') g2 = findGunByName(g2);
    if (!g1 || !g2) return 0;

    // Character bonus (additive points)
    let cb = {damage:0, range:0, control:0, accuracy:0, fireRate:0};
    if (character){
      if (typeof character === 'string') character = findCharByName(character);
      if (character && character.bonus){
        Object.entries(character.bonus).forEach(([k,v])=>{ if(cb[k]!==undefined) cb[k]+=v; });
      }
    }

    // Averages
    const avgDamage = (g1.damage + g2.damage)/2 + (cb.damage||0);
    const avgRange  = (g1.range + g2.range)/2 + (cb.range||0);
    const avgControl = (g1.control + g2.control)/2 + (cb.control||0);
    const avgAccuracy = (g1.accuracy + g2.accuracy)/2 + (cb.accuracy||0);
    const avgFireRate = (g1.fireRate + g2.fireRate)/2 + (cb.fireRate||0);

    // Mode/style weights
    let weights = {damage:0.35, range:0.30, control:0.20, accuracy:0.10, fireRate:0.05};
    if (mode==='CS'){ weights = {damage:0.30, range:0.20, control:0.25, accuracy:0.15, fireRate:0.10}; }
    // style adjustments
    if (style==='Rush'){ weights.damage += 0.05; weights.fireRate += 0.05; weights.range -= 0.05; }
    if (style==='Long Range'){ weights.range += 0.10; weights.control -= 0.05; }
    if (style==='Short Range'){ weights.range -= 0.10; weights.control += 0.05; weights.damage += 0.05; }

    // Score composition
    let raw = avgDamage*weights.damage + avgRange*weights.range + avgControl*weights.control + avgAccuracy*weights.accuracy + avgFireRate*weights.fireRate;

    // diversity bonus if weapon types complementary
    if (g1.type !== g2.type) raw += 3;

    // small penalties for two very similar low-control weapons
    if (g1.control < 45 && g2.control <45) raw -=2;

    raw = Math.round(Math.max(0, Math.min(100, raw)));
    return raw;
  }

  function compatibilityBreakdown(g1,g2,mode,style,character){
    if (typeof g1 === 'string') g1 = findGunByName(g1);
    if (typeof g2 === 'string') g2 = findGunByName(g2);
    if (!g1 || !g2) return null;
    const score = computeScore(g1,g2,mode,style,character);
    // compute component percentages (0-100) using simple normalization
    const damage = Math.round(( (g1.damage+g2.damage)/2 ));
    const range = Math.round(( (g1.range+g2.range)/2 ));
    const control = Math.round(( (g1.control+g2.control)/2 ));
    return {overall:score, damage, range, control, rating: ratingFromScore(score)};
  }

  function calculateTopJodis(limit=6, mode='BR', style='Balanced'){
    const combos = [];
    for (let i=0;i<window.guns.length;i++) for (let j=0;j<window.guns.length;j++) if (i!==j){
      const g1 = window.guns[i], g2 = window.guns[j];
      const score = computeScore(g1,g2,mode,style,null);
      combos.push({g1,g2,score});
    }
    combos.sort((a,b)=>b.score - a.score);
    return combos.slice(0, Math.min(limit, combos.length));
  }

  function shortExplain(g1,g2,char){
    if (typeof g1 === 'string') g1 = findGunByName(g1);
    if (typeof g2 === 'string') g2 = findGunByName(g2);
    if (!g1 || !g2) return '';
    let explain = `${g1.name} + ${g2.name} offers a ${g1.type}-${g2.type} pairing. `;
    if (g1.type !== g2.type) explain += 'Different weapon types cover multiple ranges. ';
    if (char){
      if (typeof char === 'string') char = findCharByName(char);
      if (char) explain += `${char.name} provides synergy (${Object.keys(char.bonus).map(k=>k+':+'+char.bonus[k]).join(', ')}).`;
    }
    return explain;
  }

  // Expose API
  window.ffjodi = window.ffjodi || {};
  window.ffjodi.findGunByName = findGunByName;
  window.ffjodi.findCharByName = findCharByName;
  window.ffjodi.computeScore = computeScore;
  window.ffjodi.calculateTopJodis = calculateTopJodis;
  window.ffjodi.compatibilityBreakdown = compatibilityBreakdown;
  window.ffjodi.ratingFromScore = ratingFromScore;
  window.ffjodi.shortExplain = shortExplain;
})();
