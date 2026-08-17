
// data/sensitivity.js
// FF JODI: Mobile sensitivity recommendations (expandable)
// All values are FF JODI suggested starting points — not official Garena settings.

window.ffSensitivity = window.ffSensitivity || {};

// Basic list of phone brands/models; each entry maps to a default sensitivity profile.
// The dataset is intentionally small to start; expanding is easy by adding more entries.
window.ffSensitivity.profiles = [
  {brand: 'Samsung', model: 'Default Samsung', id: 'samsung_default', values: {general: 45, redDot: 35, x2: 25, x4: 18, sniper: 12, freeLook: 80}},
  {brand: 'Xiaomi / Redmi / POCO', model: 'Default Xiaomi', id: 'xiaomi_default', values: {general: 48, redDot: 36, x2: 28, x4: 20, sniper: 14, freeLook: 82}},
  {brand: 'Realme', model: 'Default Realme', id: 'realme_default', values: {general: 47, redDot: 36, x2: 27, x4: 19, sniper: 13, freeLook: 81}},
  {brand: 'OPPO', model: 'Default OPPO', id: 'oppo_default', values: {general: 46, redDot: 35, x2: 26, x4: 18, sniper: 13, freeLook: 80}},
  {brand: 'Vivo / iQOO', model: 'Default Vivo', id: 'vivo_default', values: {general: 46, redDot: 36, x2: 27, x4: 19, sniper: 13, freeLook: 80}},
  {brand: 'OnePlus', model: 'Default OnePlus', id: 'oneplus_default', values: {general: 44, redDot: 34, x2: 24, x4: 17, sniper: 11, freeLook: 78}},
  {brand: 'Motorola', model: 'Default Motorola', id: 'motorola_default', values: {general: 45, redDot: 35, x2: 25, x4: 18, sniper: 12, freeLook: 79}},
  {brand: 'Infinix', model: 'Default Infinix', id: 'infinix_default', values: {general: 50, redDot: 38, x2: 30, x4: 22, sniper: 15, freeLook: 84}},
  {brand: 'Tecno', model: 'Default Tecno', id: 'tecno_default', values: {general: 51, redDot: 39, x2: 31, x4: 23, sniper: 16, freeLook: 85}},
  {brand: 'ASUS ROG', model: 'Default ROG', id: 'rog_default', values: {general: 40, redDot: 30, x2: 22, x4: 16, sniper: 10, freeLook: 76}},
  {brand: 'Nothing', model: 'Default Nothing', id: 'nothing_default', values: {general: 45, redDot: 35, x2: 25, x4: 18, sniper: 12, freeLook: 80}},
  {brand: 'Other Android', model: 'Other Android', id: 'other_android', values: {general: 46, redDot: 35, x2: 26, x4: 18, sniper: 12, freeLook: 80}},
  {brand: 'iPhone', model: 'iPhone Default', id: 'iphone_default', values: {general: 42, redDot: 32, x2: 22, x4: 16, sniper: 10, freeLook: 75}}
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
  return `FF JODI sensitivity (recommended starting point)\nBrand: ${profile.brand}\nModel: ${profile.model}\nGeneral: ${v.general}\nRed Dot: ${v.redDot}\n2x: ${v.x2}\n4x: ${v.x4}\nSniper: ${v.sniper}\nFree Look: ${v.freeLook}\n\nNote: These are FF JODI recommendations and not official Garena settings.`;
}
