// data/sensitivity.js
// FF JODI: Mobile sensitivity recommendations (expandable)
// All values are FF JODI suggested starting points — not official Garena settings.
// NOTE: Sensitivity values use the Free Fire scale: 0 .. 200

window.ffSensitivity = window.ffSensitivity || {};

// Basic list of phone brands/models; each entry maps to a default sensitivity profile.
// Values are on 0..200 scale.
window.ffSensitivity.profiles = [
  {brand: 'Samsung', model: 'Default Samsung', id: 'samsung_default', values: {general:200, redDot:190, x2:180, x4:170, sniper:120, freeLook:180}},
  {brand: 'Xiaomi / Redmi / POCO', model: 'Default Xiaomi', id: 'xiaomi_default', values: {general:195, redDot:185, x2:175, x4:165, sniper:118, freeLook:178}},
  {brand: 'Realme', model: 'Default Realme', id: 'realme_default', values: {general:194, redDot:184, x2:174, x4:164, sniper:117, freeLook:177}},
  {brand: 'OPPO', model: 'Default OPPO', id: 'oppo_default', values: {general:193, redDot:183, x2:173, x4:163, sniper:116, freeLook:176}},
  {brand: 'Vivo / iQOO', model: 'Default Vivo', id: 'vivo_default', values: {general:193, redDot:185, x2:175, x4:165, sniper:116, freeLook:176}},
  {brand: 'OnePlus', model: 'Default OnePlus', id: 'oneplus_default', values: {general:190, redDot:180, x2:170, x4:160, sniper:110, freeLook:174}},
  {brand: 'Motorola', model: 'Default Motorola', id: 'motorola_default', values: {general:192, redDot:182, x2:172, x4:162, sniper:112, freeLook:175}},
  {brand: 'Infinix', model: 'Default Infinix', id: 'infinix_default', values: {general:200, redDot:188, x2:176, x4:164, sniper:120, freeLook:186}},
  {brand: 'Tecno', model: 'Default Tecno', id: 'tecno_default', values: {general:200, redDot:190, x2:178, x4:166, sniper:122, freeLook:188}},
  {brand: 'ASUS ROG', model: 'Default ROG', id: 'rog_default', values: {general:185, redDot:170, x2:160, x4:150, sniper:100, freeLook:170}},
  {brand: 'Nothing', model: 'Default Nothing', id: 'nothing_default', values: {general:192, redDot:182, x2:172, x4:162, sniper:112, freeLook:176}},
  {brand: 'Other Android', model: 'Other Android', id: 'other_android', values: {general:190, redDot:180, x2:170, x4:160, sniper:110, freeLook:175}},
  {brand: 'iPhone', model: 'iPhone Default', id: 'iphone_default', values: {general:180, redDot:170, x2:160, x4:150, sniper:100, freeLook:168}}
];

// Helper to search profiles by brand/model
window.ffSensitivity.searchProfiles = function(query){
  if(!query) return window.ffSensitivity.profiles;
  const q = query.toLowerCase();
  return window.ffSensitivity.profiles.filter(p => (p.brand + ' ' + p.model).toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
}

// Utility to produce a default profile given brand/model selection
window.ffSensitivity.getProfile = function(brandId){
  return window.ffSensitivity.profiles.find(p => p.id === brandId) || null;
}

// Export a small format for copy
window.ffSensitivity.profileToText = function(profile){
  if(!profile) return '';
  const v = profile.values;
  return `FF JODI Sensitivity — Recommended starting values\nBrand: ${profile.brand}\nModel: ${profile.model}\nGeneral: ${v.general}\nRed Dot: ${v.redDot}\n2x: ${v.x2}\n4x: ${v.x4}\nSniper Scope: ${v.sniper}\nFree Look: ${v.freeLook}\n\nThese are FF JODI recommendations, not official Garena settings.`;
}

// Safety: clamp helper exposed
window.ffSensitivity.clamp = function(val){
  if(typeof val !== 'number') val = Number(val) || 0;
  return Math.max(0, Math.min(200, Math.round(val)));
}
