// Loads parsed CSV data and exposes it on window.IMC_DATA
// Also exposes prizeFor(rank) and helper utilities.

// Convert "RAJ KUMAR" / "raj kumar" / "rAJ KuMaR" → "Raj Kumar"
// Handles common name particles (de, da, van, mc, o') sensibly.
window.toProperName = function(s) {
  if (!s || typeof s !== 'string') return s;
  return s.toLowerCase().replace(/\b([a-z])([a-z']*)/g, (_, first, rest) => {
    return first.toUpperCase() + rest;
  }).replace(/\bMc([a-z])/g, (_, c) => 'Mc' + c.toUpperCase())
   .replace(/\bO'([a-z])/g, (_, c) => "O'" + c.toUpperCase());
};

(async function() {
  const res = await fetch('data/imc-2024-25.json');
  const data = await res.json();
  // Normalize student names everywhere — walks the whole tree generically
  const fix = (row) => {
    if (row && typeof row === 'object' && !Array.isArray(row)) {
      if (typeof row.name === 'string') row.name = window.toProperName(row.name);
      if (typeof row.school === 'string') row.school = window.toProperName(row.school);
    }
    return row;
  };
  const walk = (node) => {
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (node && typeof node === 'object') {
      fix(node);
      Object.values(node).forEach(walk);
    }
  };
  walk(data);
  window.IMC_DATA = data;
  window.dispatchEvent(new CustomEvent('imc-data-ready'));
})();

// Inline credit-prize illustration as data URI. Avoids 40+ requests for the
// same SVG across the leaderboard rows.
window.CREDIT_SVG_URI = 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20width%3D%22200%22%20height%3D%22200%22%20role%3D%22img%22%20aria-label%3D%22MathAI%20Program%20Credit%20voucher%22%3E%3Cdefs%3E%3Cfilter%20id%3D%22vShadow%22%20x%3D%22-10%25%22%20y%3D%22-5%25%22%20width%3D%22120%25%22%20height%3D%22120%25%22%3E%3CfeGaussianBlur%20stdDeviation%3D%222.5%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Cellipse%20cx%3D%22100%22%20cy%3D%22180%22%20rx%3D%2260%22%20ry%3D%225%22%20fill%3D%22%232B0D4B%22%20opacity%3D%220.15%22%20filter%3D%22url(%23vShadow)%22%2F%3E%3Cpath%20d%3D%22M44%2028%20H156%20V172%20L142%20160%20L128%20172%20L114%20160%20L100%20172%20L86%20160%20L72%20172%20L58%20160%20L44%20172%20Z%22%20fill%3D%22%23FFF8F3%22%20stroke%3D%22%232B0D4B%22%20stroke-width%3D%226%22%20stroke-linejoin%3D%22round%22%20stroke-linecap%3D%22round%22%2F%3E%3Ccircle%20cx%3D%2268%22%20cy%3D%2262%22%20r%3D%2211%22%20fill%3D%22none%22%20stroke%3D%22%23F96B4C%22%20stroke-width%3D%225%22%2F%3E%3Ctext%20x%3D%2268%22%20y%3D%2269%22%20text-anchor%3D%22middle%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20%27Segoe%20UI%27%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2214%22%20fill%3D%22%23F96B4C%22%3E%E2%82%B9%3C%2Ftext%3E%3Crect%20x%3D%2286%22%20y%3D%2254%22%20width%3D%2260%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%232B0D4B%22%2F%3E%3Crect%20x%3D%2286%22%20y%3D%2268%22%20width%3D%2242%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%232B0D4B%22%20opacity%3D%220.55%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2298%22%20width%3D%2288%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%232B0D4B%22%20opacity%3D%220.35%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%22114%22%20width%3D%2288%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%232B0D4B%22%20opacity%3D%220.35%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%22130%22%20width%3D%2256%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%232B0D4B%22%20opacity%3D%220.35%22%2F%3E%3C%2Fsvg%3E';

// Prize taxonomy — one source of truth for what each rank wins.
// `thumb` is a 128px row-thumbnail variant (10× smaller than the showcase image)
// to avoid shipping a 600px webp where a 64px slot is rendered.
window.PRIZES = {
  // Physical
  ipad:    { kind:'physical', label:'Apple iPad 10th Gen',          short:'iPad 10th Gen',         tagline:'Podium Champion',        img:'assets/prizes/ipad.webp',    thumb:'assets/prizes/ipad-thumb.webp',   months: 3,   accent:'gold'   },
  kindle:  { kind:'physical', label:'Kindle Paperwhite',             short:'Kindle Paperwhite',     tagline:'2nd Place',              img:'assets/prizes/kindle.webp',  thumb:'assets/prizes/kindle-thumb.webp', months: 3,   accent:'silver' },
  a4:      { kind:'physical', label:'SEZNIK A4 Bluetooth Printer',   short:'A4 Printer',            tagline:'3rd Place',              img:'assets/prizes/a4.webp',      thumb:'assets/prizes/a4-thumb.webp',     months: 2.5, accent:'bronze' },
  mini:    { kind:'physical', label:'SEZNIK Mini Thermal Printer',   short:'Mini Printer',          tagline:'Top 10',                 img:'assets/prizes/mini.webp',    thumb:'assets/prizes/mini-thumb.webp',   months: 2,   accent:'top10'  },
  // Credit only
  cr15:    { kind:'credit',   label:'1.5 months free',               tagline:'10x Speed & Logic Program', months: 1.5 },
  cr10:    { kind:'credit',   label:'1 month free',                  tagline:'10x Speed & Logic Program', months: 1   },
};

window.prizeForRank = function(rank) {
  if (rank === 1) return window.PRIZES.ipad;
  if (rank === 2) return window.PRIZES.kindle;
  if (rank === 3) return window.PRIZES.a4;
  if (rank <= 10) return window.PRIZES.mini;
  if (rank <= 25) return window.PRIZES.cr15;
  if (rank <= 50) return window.PRIZES.cr10;
  return window.PRIZES.cr10;
};

// Challenge-wise (per-challenge Top 20) prize tiers
window.PRIZES.cr45 = { kind:'credit', label:'45 days free', tagline:'10x Speed & Logic Program', months: 1.5 };
window.challengePrizeForRank = function(rank) {
  if (rank === 1)  return window.PRIZES.mini;   // Mini Thermal Printer + 2 months MathAI
  if (rank <= 3)   return window.PRIZES.cr15;   // 1.5 months
  if (rank <= 10)  return window.PRIZES.cr10;   // 1 month
  return window.PRIZES.cr45;                    // 45 days
};
window.challengeTierForRank = function(rank) {
  if (rank === 1)  return { id:'champ', label:'Challenge Champion' };
  if (rank <= 3)   return { id:'top3',  label:'Challenge Top 3' };
  if (rank <= 10)  return { id:'top10', label:'Challenge Top 10' };
  return            { id:'top20', label:'Challenge Top 20' };
};

window.tierForRank = function(rank) {
  if (rank <= 3)  return { id:'podium',  label:'PODIUM',   range:'1–3'    };
  if (rank <= 10) return { id:'top10',   label:'TOP 10',   range:'4–10'   };
  if (rank <= 25) return { id:'top25',   label:'TOP 25',   range:'11–25'  };
  if (rank <= 50) return { id:'top50',   label:'TOP 50',   range:'26–50'  };
  return            { id:'top100',  label:'TOP 100',  range:'51–100' };
};
