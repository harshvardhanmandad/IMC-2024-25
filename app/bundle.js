/* IMC bundle — pre-compiled */
const { useState, useEffect, useMemo, useCallback, useRef } = React;

/* ── tweaks-panel.jsx ────────────────────────────── */
(function(){
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-noncommentable": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;

  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}
function TweakColor({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
    type: "color",
    className: "twk-swatch",
    value: value,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})();

/* ── app/components.jsx ────────────────────────────── */
(function(){
/* eslint-disable */
// Hero, Nav, Podium, Tier Wall, Prizes, Challenges, Claim, Upsell, FAQ, Footer
// All exported to window for cross-script access.

const {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} = React;

// ─── Confetti ─────────────────────────────────────────────
function Confetti({
  count = 24
}) {
  const colors = ['#FFDE49', '#F96B4C', '#270F36', '#FFC107', '#1DAE69'];
  const pieces = useMemo(() => Array.from({
    length: count
  }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 6 + Math.random() * 4,
    color: colors[i % colors.length],
    rot: Math.random() * 360,
    size: 6 + Math.random() * 6
  })), [count]);
  return /*#__PURE__*/React.createElement("div", {
    className: "imc-confetti",
    "aria-hidden": "true"
  }, pieces.map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      left: p.left + '%',
      background: p.color,
      width: p.size + 'px',
      height: p.size * 1.6 + 'px',
      animationDelay: p.delay + 's',
      animationDuration: p.duration + 's',
      transform: `rotate(${p.rot}deg)`
    }
  })));
}

// ─── Nav ─────────────────────────────────────────────────
function Nav({
  tweaks
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "imc-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-shell imc-nav-inner"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    className: "imc-logo",
    style: {
      textDecoration: 'none',
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-logo-mark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "core",
    style: {
      position: 'absolute',
      top: 0,
      left: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "companion"
  })), /*#__PURE__*/React.createElement("div", {
    className: "imc-logo-text"
  }, "Math", /*#__PURE__*/React.createElement("span", {
    className: "ai"
  }, "AI"))), /*#__PURE__*/React.createElement("div", {
    className: "imc-nav-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#podium"
  }, "Podium"), /*#__PURE__*/React.createElement("a", {
    href: "#leaderboard"
  }, "Leaderboard"), /*#__PURE__*/React.createElement("a", {
    href: "#prizes"
  }, "Prizes"), /*#__PURE__*/React.createElement("a", {
    href: "#claim"
  }, "Claim"), /*#__PURE__*/React.createElement("a", {
    href: "https://learn.mathai.ai/",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "imc-btn imc-btn-primary",
    style: {
      padding: '10px 18px'
    }
  }, "Join 10x Speed & Logic \u2192"))));
}

// ─── Hero ────────────────────────────────────────────────
function Hero({
  tweaks,
  totalWinners,
  gradeCount,
  challengeCount
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "imc-hero",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-hero-bg"
  }), tweaks.confetti && /*#__PURE__*/React.createElement(Confetti, {
    count: 28
  }), /*#__PURE__*/React.createElement("div", {
    className: "imc-glyph",
    style: {
      top: '15%',
      left: '6%'
    }
  }, "\u03C0"), /*#__PURE__*/React.createElement("div", {
    className: "imc-glyph",
    style: {
      top: '60%',
      left: '88%',
      animationDelay: '0.6s'
    }
  }, "\u2211"), /*#__PURE__*/React.createElement("div", {
    className: "imc-glyph",
    style: {
      top: '78%',
      left: '12%',
      animationDelay: '1.2s'
    }
  }, "\u221A"), /*#__PURE__*/React.createElement("div", {
    className: "imc-shell imc-hero-inner imc-hero-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-hero-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " IMC 2024\u201325 \xB7 Prizes & Ranks Announced!"), /*#__PURE__*/React.createElement("h1", {
    className: "imc-h1"
  }, tweaks.heroLine1, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "yellow"
  }, tweaks.heroLine2)), /*#__PURE__*/React.createElement("p", {
    className: "imc-lede"
  }, tweaks.heroLede), /*#__PURE__*/React.createElement("div", {
    className: "imc-hero-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#leaderboard",
    className: "imc-btn imc-btn-primary"
  }, "See the Top 100 \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "#claim",
    className: "imc-btn imc-btn-ghost"
  }, "How to claim your prize"))), /*#__PURE__*/React.createElement("div", {
    className: "imc-hero-art"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-hero-art-frame"
  }, /*#__PURE__*/React.createElement("picture", null, /*#__PURE__*/React.createElement("source", {
    srcSet: "app/assets/hero-banner.webp",
    type: "image/webp"
  }), /*#__PURE__*/React.createElement("img", {
    src: "app/assets/hero-banner.jpg",
    alt: "IMC 2024\u201325 winners celebrating with the trophy",
    width: "800",
    height: "800",
    decoding: "async",
    fetchpriority: "high"
  })), /*#__PURE__*/React.createElement("div", {
    className: "imc-hero-art-glow",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "imc-hero-art-badge"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-hero-art-badge-num"
  }, "300"), /*#__PURE__*/React.createElement("div", {
    className: "imc-hero-art-badge-label"
  }, "winners", /*#__PURE__*/React.createElement("br", null), "celebrated")))));
}

// ─── Grade switcher ──────────────────────────────────────
function GradeTabs({
  grade,
  setGrade
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "imc-tabs",
    role: "tablist",
    "aria-label": "Choose grade"
  }, [3, 4, 5].map(g => /*#__PURE__*/React.createElement("button", {
    key: g,
    role: "tab",
    "aria-selected": grade === g,
    onClick: () => setGrade(g),
    className: "imc-tab"
  }, /*#__PURE__*/React.createElement("span", {
    className: "imc-tab-grade"
  }, "Grade ", g), /*#__PURE__*/React.createElement("span", {
    className: "imc-tab-ay"
  }, "AY 2024\u201325"))));
}

// ─── Podium ──────────────────────────────────────────────
function Podium({
  overall,
  grade
}) {
  const [g1, g2, g3] = overall.slice(0, 3);
  return /*#__PURE__*/React.createElement("section", {
    className: "imc-podium-section",
    id: "podium"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-section-eyebrow"
  }, "\u2605 Champions of the Year \xB7 AY 2024\u201325"), /*#__PURE__*/React.createElement("h2", {
    className: "imc-h2"
  }, "The Podium"), /*#__PURE__*/React.createElement("p", {
    className: "imc-lede",
    style: {
      maxWidth: '56ch'
    }
  }, "Three young mathematicians from ", /*#__PURE__*/React.createElement("strong", null, "Grade ", grade), " who topped every challenge across the academic year 2024\u201325."), /*#__PURE__*/React.createElement("div", {
    className: "imc-podium"
  }, /*#__PURE__*/React.createElement(PodiumCard, {
    rank: 2,
    student: g2,
    medal: "\uD83E\uDD48",
    tone: "silver",
    prize: window.PRIZES.instax
  }), /*#__PURE__*/React.createElement(PodiumCard, {
    rank: 1,
    student: g1,
    medal: "\uD83E\uDD47",
    tone: "gold",
    prize: window.PRIZES.kindle
  }), /*#__PURE__*/React.createElement(PodiumCard, {
    rank: 3,
    student: g3,
    medal: "\uD83E\uDD49",
    tone: "bronze",
    prize: window.PRIZES.a4
  }))));
}
function PodiumCard({
  rank,
  student,
  medal,
  tone,
  prize
}) {
  if (!student) return null;
  return /*#__PURE__*/React.createElement("article", {
    className: `imc-podium-card ${tone}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-podium-rank"
  }, "RANK ", rank), /*#__PURE__*/React.createElement("div", {
    className: "imc-podium-medal",
    "aria-hidden": "true"
  }, medal), /*#__PURE__*/React.createElement("div", {
    className: "imc-podium-prize"
  }, /*#__PURE__*/React.createElement("img", {
    src: prize.img,
    alt: prize.label,
    loading: "lazy",
    decoding: "async"
  })), /*#__PURE__*/React.createElement("div", {
    className: "imc-podium-name"
  }, student.name), /*#__PURE__*/React.createElement("div", {
    className: "imc-podium-school"
  }, student.school), /*#__PURE__*/React.createElement("div", {
    className: "imc-podium-divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "imc-podium-prize-name"
  }, prize.label), /*#__PURE__*/React.createElement("div", {
    className: "imc-podium-prize-extras"
  }, "+ ", prize.months, " ", prize.months === 1 ? 'month' : 'months', " MathAI Premium"));
}

// ─── Top 100 — Tiered Wall ───────────────────────────────
function TieredWall({
  overall,
  tweaks,
  grade
}) {
  const [collapsed, setCollapsed] = useState({
    top25: false,
    top50: true,
    top100: true
  });
  const tiers = useMemo(() => {
    return {
      podium: {
        id: 'podium',
        label: 'RANKS 1–3',
        range: '',
        desc: 'iPad / Kindle / A4 Printer + 3 months MathAI',
        rows: overall.slice(0, 3)
      },
      top10: {
        id: 'top10',
        label: 'RANKS 4–10',
        range: '',
        desc: 'SEZNIK Mini Printer + 2 months MathAI',
        rows: overall.slice(3, 10)
      },
      top25: {
        id: 'top25',
        label: 'RANKS 11–25',
        range: '',
        desc: '1.5 months free MathAI + 10x Speed & Logic',
        rows: overall.slice(10, 25)
      },
      top50: {
        id: 'top50',
        label: 'RANKS 26–50',
        range: '',
        desc: '1 month free MathAI + 10x Speed & Logic',
        rows: overall.slice(25, 50)
      },
      top100: {
        id: 'top100',
        label: 'RANKS 51–100',
        range: '',
        desc: '1 month free MathAI + 10x Speed & Logic',
        rows: overall.slice(50, 100)
      }
    };
  }, [overall]);
  return /*#__PURE__*/React.createElement("section", {
    className: "imc-top100-section",
    id: "leaderboard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-section-eyebrow"
  }, "\u2605 Hall of Honor \xB7 AY 2024\u201325"), /*#__PURE__*/React.createElement("h2", {
    className: "imc-h2"
  }, "Top 100 \u2014 Every Winner, by Tier"), /*#__PURE__*/React.createElement("p", {
    className: "imc-lede"
  }, "Overall ranks based on cumulative scores across all 5 challenges."), Object.values(tiers).map(t => /*#__PURE__*/React.createElement(Tier, {
    key: t.id,
    tier: t,
    collapsed: !!collapsed[t.id],
    onToggle: () => setCollapsed(c => ({
      ...c,
      [t.id]: !c[t.id]
    }))
  }))));
}
function Tier({
  tier,
  collapsed,
  onToggle
}) {
  const collapsibleTiers = ['top25', 'top50', 'top100'];
  const isCollapsible = collapsibleTiers.includes(tier.id);
  const initialShow = isCollapsible ? Math.min(6, tier.rows.length) : tier.rows.length;
  const visibleRows = collapsed ? tier.rows.slice(0, initialShow) : tier.rows;
  return /*#__PURE__*/React.createElement("div", {
    className: `imc-tier imc-tier-${tier.id}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-tier-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, tier.label), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 12,
      opacity: 0.7,
      fontSize: 13,
      fontWeight: 600
    }
  }, tier.range)), /*#__PURE__*/React.createElement("div", {
    className: "desc"
  }, tier.desc)), /*#__PURE__*/React.createElement("div", {
    className: "imc-tier-rows"
  }, visibleRows.map(r => /*#__PURE__*/React.createElement(Row, {
    key: r.profileId + '-' + r.rank,
    row: r
  }))), isCollapsible && /*#__PURE__*/React.createElement("button", {
    className: "imc-tier-toggle",
    onClick: onToggle
  }, collapsed ? `Show all ${tier.label.replace('TOP ', '')} ↓` : `Show fewer ↑`));
}
function Row({
  row
}) {
  const prize = window.prizeForRank(row.rank);
  const isPhysical = prize.kind === 'physical';
  const img = isPhysical ? prize.thumb || prize.img : window.CREDIT_SVG_URI;
  const monthWord = m => m === 1 ? 'month' : 'months';
  const prizeName = isPhysical ? prize.short || prize.label : `${prize.months} ${monthWord(prize.months)} MathAI`;
  const prizeSub = isPhysical ? `+ ${prize.months} ${monthWord(prize.months)} MathAI Premium` : '+ 10x Speed & Logic Program';
  return /*#__PURE__*/React.createElement("div", {
    className: "imc-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-row-rank"
  }, "#", row.rank), /*#__PURE__*/React.createElement("div", {
    className: "imc-row-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-row-name"
  }, row.name), /*#__PURE__*/React.createElement("div", {
    className: "imc-row-school"
  }, row.school || '—')), /*#__PURE__*/React.createElement("div", {
    className: "imc-row-prize"
  }, /*#__PURE__*/React.createElement("div", {
    className: `imc-row-thumb ${isPhysical ? '' : 'credit'}`
  }, /*#__PURE__*/React.createElement("img", {
    src: img,
    alt: "",
    loading: "lazy",
    decoding: "async"
  })), /*#__PURE__*/React.createElement("div", {
    className: "imc-row-prize-name"
  }, prizeName), /*#__PURE__*/React.createElement("div", {
    className: "imc-row-prize-sub"
  }, prizeSub)));
}

// ─── Prizes Showcase ─────────────────────────────────────
function PrizeShowcase() {
  return /*#__PURE__*/React.createElement("section", {
    className: "imc-prizes-section",
    id: "prizes"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-section-eyebrow"
  }, "\u2605 The Prizes"), /*#__PURE__*/React.createElement("h2", {
    className: "imc-h2"
  }, "Real things, in real boxes,", /*#__PURE__*/React.createElement("br", null), "shipped to your door."), /*#__PURE__*/React.createElement("p", {
    className: "imc-lede"
  }, "Plus access to MathAI's flagship 10x Speed & Logic Program."), /*#__PURE__*/React.createElement("div", {
    className: "imc-prize-grid"
  }, /*#__PURE__*/React.createElement("article", {
    className: "imc-prize-card gold feature"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "RANK 1 \xB7 GOLD"), /*#__PURE__*/React.createElement("h3", null, "Kindle Paperwhite"), /*#__PURE__*/React.createElement("div", {
    className: "img-wrap"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/prizes/kindle.webp",
    alt: "Kindle Paperwhite",
    loading: "lazy",
    decoding: "async"
  })), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, "+ 3 months MathAI Premium")), /*#__PURE__*/React.createElement("article", {
    className: "imc-prize-card silver"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "RANK 2 \xB7 SILVER"), /*#__PURE__*/React.createElement("h3", null, "Fujifilm Instax Mini 12"), /*#__PURE__*/React.createElement("div", {
    className: "img-wrap"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/prizes/instax.webp",
    alt: "Fujifilm Instax Mini 12",
    loading: "lazy",
    decoding: "async"
  })), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, "+ 3 months MathAI Premium")), /*#__PURE__*/React.createElement("article", {
    className: "imc-prize-card bronze"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "RANK 3 \xB7 BRONZE"), /*#__PURE__*/React.createElement("h3", null, "SEZNIK A4 Printer"), /*#__PURE__*/React.createElement("div", {
    className: "img-wrap"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/prizes/a4.webp",
    alt: "A4 Printer",
    loading: "lazy",
    decoding: "async"
  })), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, "+ 2.5 months MathAI Premium")), /*#__PURE__*/React.createElement("article", {
    className: "imc-prize-card top10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "RANK 4 \u2013 10"), /*#__PURE__*/React.createElement("h3", null, "SEZNIK Mini Printer"), /*#__PURE__*/React.createElement("div", {
    className: "img-wrap"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/prizes/mini.webp",
    alt: "Mini Printer",
    loading: "lazy",
    decoding: "async"
  })), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, "+ 2 months MathAI Premium")), /*#__PURE__*/React.createElement("article", {
    className: "imc-prize-card challenge"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "RANK 11 \u2013 100"), /*#__PURE__*/React.createElement("h3", null, "MathAI Program Credit"), /*#__PURE__*/React.createElement("div", {
    className: "img-wrap",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,0.5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 48,
      fontWeight: 800,
      letterSpacing: '-0.04em'
    }
  }, "1\u20131.5", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      opacity: 0.6,
      marginLeft: 6
    }
  }, "months"))), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, "10x Speed & Logic Program access"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      padding: '22px 26px',
      background: 'var(--mai-cream)',
      borderRadius: 18,
      border: '1px solid var(--mai-border)',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      lineHeight: 1
    }
  }, "\uD83C\uDFC6"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 240
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: 'var(--mai-purple)',
      letterSpacing: '-0.01em'
    }
  }, "Total prize value of more than \u20B97,00,000"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--mai-fg-2)',
      marginTop: 4,
      lineHeight: 1.5
    }
  }, "45 physical prizes shipped + program credits for every ranked student across overall & per-challenge leaderboards.")))));
}

// ─── 5 Challenges ────────────────────────────────────────
function Challenges({
  challenges,
  grade
}) {
  const [openIdx, setOpenIdx] = useState(null);
  const meta = [{
    emoji: '🧮',
    name: 'Mental Math',
    desc: 'Speed + accuracy on calculation drills'
  }, {
    emoji: '🔍',
    name: 'Patterns & Logic',
    desc: 'Spot the rule, predict the next term'
  }, {
    emoji: '🎯',
    name: 'Estimation',
    desc: 'Smart guessing for real-world problems'
  }, {
    emoji: '🧩',
    name: 'Riddles',
    desc: 'Lateral thinking & word problems'
  }, {
    emoji: '🎲',
    name: 'Puzzles & Games',
    desc: 'Strategy, spatial reasoning, play'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "imc-challenges-section",
    id: "challenges"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-section-eyebrow"
  }, "\u2605 Per-Challenge Recognition \xB7 AY 2024\u201325"), /*#__PURE__*/React.createElement("h2", {
    className: "imc-h2"
  }, "Five challenges. Five champions per grade."), /*#__PURE__*/React.createElement("p", {
    className: "imc-lede"
  }, "Each themed challenge has its own Top 20 per grade with its own prize ladder \u2014 separate from the overall ranking. Tap a challenge to see who topped it in Grade ", grade, "."), /*#__PURE__*/React.createElement("div", {
    className: "imc-challenge-grid"
  }, meta.map((m, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "imc-challenge-card",
    "data-active": openIdx === i,
    onClick: () => setOpenIdx(openIdx === i ? null : i),
    "aria-expanded": openIdx === i
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-challenge-card-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emoji",
    "aria-hidden": "true"
  }, m.emoji), /*#__PURE__*/React.createElement("div", {
    className: "imc-challenge-card-num"
  }, "IMC ", i + 1)), /*#__PURE__*/React.createElement("h4", null, m.name), /*#__PURE__*/React.createElement("p", null, m.desc), /*#__PURE__*/React.createElement("span", {
    className: "imc-challenge-card-cta"
  }, openIdx === i ? /*#__PURE__*/React.createElement(React.Fragment, null, "Hide rankings ", /*#__PURE__*/React.createElement("span", {
    className: "chev"
  }, "\u25B2")) : /*#__PURE__*/React.createElement(React.Fragment, null, "See Top 20 ", /*#__PURE__*/React.createElement("span", {
    className: "chev"
  }, "\u25BC")))))), openIdx !== null && challenges[openIdx] && /*#__PURE__*/React.createElement(ChallengeDrawer, {
    challenge: challenges[openIdx],
    grade: grade,
    meta: meta[openIdx],
    challengeNum: openIdx + 1,
    onClose: () => setOpenIdx(null)
  })));
}

// Inline drawer on desktop; full-screen modal sheet on mobile.
function ChallengeDrawer({
  challenge,
  grade,
  meta,
  challengeNum,
  onClose
}) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile]);

  // Esc to close (modal mode)
  useEffect(() => {
    if (!isMobile) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobile, onClose]);

  // Group rows by challenge-prize tier so the same tiered-band pattern reads.
  const groups = useMemo(() => {
    const buckets = {
      champ: {
        id: 'champ',
        label: 'RANK 1',
        range: '',
        desc: 'SEZNIK Mini Thermal Printer + 2 months MathAI',
        rows: []
      },
      top3: {
        id: 'top3',
        label: 'RANKS 2–3',
        range: '',
        desc: '1.5 months MathAI Premium',
        rows: []
      },
      top10: {
        id: 'top10',
        label: 'RANKS 4–10',
        range: '',
        desc: '1 month MathAI Premium',
        rows: []
      },
      top20: {
        id: 'top20',
        label: 'RANKS 11–20',
        range: '',
        desc: '45 days MathAI Premium',
        rows: []
      }
    };
    challenge.rows.forEach(r => {
      if (r.rank === 1) buckets.champ.rows.push(r);else if (r.rank <= 3) buckets.top3.rows.push(r);else if (r.rank <= 10) buckets.top10.rows.push(r);else buckets.top20.rows.push(r);
    });
    return Object.values(buckets).filter(g => g.rows.length);
  }, [challenge]);
  const body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "imc-cw-drawer-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-cw-drawer-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "emoji",
    "aria-hidden": "true"
  }, meta.emoji), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "IMC ", challengeNum, " \xB7 ", challenge.title.replace(/^IMC\s*\d+\s*-\s*/, '').replace(/\s*Challenge\s*$/, '')), /*#__PURE__*/React.createElement("h3", null, "Grade ", grade, " \xB7 Top ", challenge.rows.length), /*#__PURE__*/React.createElement("div", {
    className: "imc-cw-drawer-ay"
  }, "AY 2024\u201325"))), /*#__PURE__*/React.createElement("div", {
    className: "imc-cw-drawer-ladder",
    "aria-label": "Prize ladder for this challenge"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-cw-drawer-ladder-label"
  }, "Prize ladder for this challenge"), /*#__PURE__*/React.createElement("div", {
    className: "imc-cw-drawer-ladder-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rung champ"
  }, /*#__PURE__*/React.createElement("b", null, "#1"), " Mini Printer + 2mo"), /*#__PURE__*/React.createElement("span", {
    className: "rung"
  }, /*#__PURE__*/React.createElement("b", null, "#2\u20133"), " 1.5 months"), /*#__PURE__*/React.createElement("span", {
    className: "rung"
  }, /*#__PURE__*/React.createElement("b", null, "#4\u201310"), " 1 month"), /*#__PURE__*/React.createElement("span", {
    className: "rung"
  }, /*#__PURE__*/React.createElement("b", null, "#11\u201320"), " 45 days")))), groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: `imc-tier imc-cw-tier-${g.id}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-tier-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, g.label), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 12,
      opacity: 0.7,
      fontSize: 13,
      fontWeight: 600
    }
  }, g.range)), /*#__PURE__*/React.createElement("div", {
    className: "desc"
  }, g.desc)), /*#__PURE__*/React.createElement("div", {
    className: "imc-tier-rows"
  }, g.rows.map(r => /*#__PURE__*/React.createElement(ChallengeRow, {
    key: r.profileId + '-' + r.rank,
    row: r
  }))))));
  if (isMobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "imc-cw-modal-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `${meta.name} rankings`,
      onClick: e => {
        if (e.target === e.currentTarget) onClose && onClose();
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "imc-cw-modal-sheet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "imc-cw-modal-bar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "imc-cw-modal-bar-title"
    }, /*#__PURE__*/React.createElement("span", {
      className: "emoji",
      "aria-hidden": "true"
    }, meta.emoji), /*#__PURE__*/React.createElement("span", null, "IMC ", challengeNum, " \xB7 ", meta.name)), /*#__PURE__*/React.createElement("button", {
      className: "imc-cw-modal-close",
      onClick: onClose,
      "aria-label": "Close"
    }, "\xD7")), /*#__PURE__*/React.createElement("div", {
      className: "imc-cw-modal-body"
    }, body)));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "imc-cw-drawer",
    id: `challenge-drawer-${challengeNum}`
  }, body);
}
function ChallengeRow({
  row
}) {
  const prize = window.challengePrizeForRank(row.rank);
  const isPhysical = prize.kind === 'physical';
  const img = isPhysical ? prize.thumb || prize.img : window.CREDIT_SVG_URI;
  const prizeNameSingle = (() => {
    if (row.rank === 1) return 'Mini Printer';
    if (row.rank <= 3) return '1.5 months MathAI';
    if (row.rank <= 10) return '1 month MathAI';
    return '45 days MathAI';
  })();
  const prizeSub = row.rank === 1 ? '+ 2 months MathAI Premium' : '+ 10x Speed & Logic Program';
  return /*#__PURE__*/React.createElement("div", {
    className: "imc-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-row-rank"
  }, "#", row.rank), /*#__PURE__*/React.createElement("div", {
    className: "imc-row-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-row-name"
  }, row.name), /*#__PURE__*/React.createElement("div", {
    className: "imc-row-school"
  }, row.school || '—')), /*#__PURE__*/React.createElement("div", {
    className: "imc-row-prize"
  }, /*#__PURE__*/React.createElement("div", {
    className: `imc-row-thumb ${isPhysical ? '' : 'credit'}`
  }, /*#__PURE__*/React.createElement("img", {
    src: img,
    alt: "",
    loading: "lazy",
    decoding: "async"
  })), /*#__PURE__*/React.createElement("div", {
    className: "imc-row-prize-name"
  }, prizeNameSingle), /*#__PURE__*/React.createElement("div", {
    className: "imc-row-prize-sub"
  }, prizeSub)));
}

// ─── How to Claim ────────────────────────────────────────
function Claim() {
  return /*#__PURE__*/React.createElement("section", {
    className: "imc-claim-section",
    id: "claim"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-section-eyebrow"
  }, "\u2605 How It Works"), /*#__PURE__*/React.createElement("h2", {
    className: "imc-h2"
  }, "Claiming your prize"), /*#__PURE__*/React.createElement("p", {
    className: "imc-lede"
  }, "Two tracks \u2014 depending on whether you've won a physical prize or program credit. Most winners only need to follow one of these."), /*#__PURE__*/React.createElement("div", {
    className: "imc-claim-tracks"
  }, /*#__PURE__*/React.createElement("article", {
    className: "imc-claim-track imc-claim-physical"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-claim-track-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-claim-track-tag"
  }, "Track A"), /*#__PURE__*/React.createElement("h3", null, "If you won a physical prize"), /*#__PURE__*/React.createElement("p", {
    className: "imc-claim-track-who"
  }, /*#__PURE__*/React.createElement("strong", null, "Who:"), " Overall Rank 1\u201310 (iPad / Kindle / A4 Printer / Mini Printer) and Challenge Rank 1 winners (Mini Printer)")), /*#__PURE__*/React.createElement("ol", {
    className: "imc-claim-steps"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "1"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "You'll hear from us"), /*#__PURE__*/React.createElement("p", null, "The MathAI team will reach out on ", /*#__PURE__*/React.createElement("strong", null, "WhatsApp + email"), " within 5 working days. We use the number and email on your MathAI profile."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "2"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Share your shipping address"), /*#__PURE__*/React.createElement("p", null, "Reply with your full shipping address. ", /*#__PURE__*/React.createElement("strong", null, "India winners only"), " \u2014 international winners (UAE, Kuwait, etc.) receive equivalent MathAI credit instead."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "3"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Prize on the way"), /*#__PURE__*/React.createElement("p", null, "Prize ships within 14 working days of address confirmation."))))), /*#__PURE__*/React.createElement("article", {
    className: "imc-claim-track imc-claim-credit"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-claim-track-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-claim-track-tag"
  }, "Track B"), /*#__PURE__*/React.createElement("h3", null, "If you won MathAI credit"), /*#__PURE__*/React.createElement("p", {
    className: "imc-claim-track-who"
  }, /*#__PURE__*/React.createElement("strong", null, "Who:"), " All Top 100 \u2014 Overall Rank 1\u2013100 and Challenge Rank 1\u201320. Every winner gets MathAI credit (durations vary by rank); physical-prize winners get this in addition to their physical prize.")), /*#__PURE__*/React.createElement("ol", {
    className: "imc-claim-steps"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "1"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Message us to activate"), /*#__PURE__*/React.createElement("p", null, "WhatsApp the MathAI team saying you'd like to start the ", /*#__PURE__*/React.createElement("strong", null, "10x Speed & Logic Program"), ". Mention your child's name, grade and school name."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "2"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "We activate your free months"), /*#__PURE__*/React.createElement("p", null, "Your free MathAI Premium credit is applied to your account within 24 hours. No payment required."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "3"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Open the app, start playing"), /*#__PURE__*/React.createElement("p", null, "Your child can begin the 10x Speed & Logic Program right away.")))))), /*#__PURE__*/React.createElement("div", {
    className: "imc-claim-contact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-claim-contact-text"
  }, /*#__PURE__*/React.createElement("h4", null, "Need help, or didn't hear from us?"), /*#__PURE__*/React.createElement("p", null, "Reach out to the MathAI team on WhatsApp with your child's name, school name and phone number used in IMC.")), /*#__PURE__*/React.createElement("a", {
    className: "imc-btn imc-btn-primary imc-claim-contact-cta",
    href: "https://wa.me/918884761744?text=Hi%21%20I%20want%20to%20enquire%20about%20IMC%202024-25%20prizes",
    target: "_blank",
    rel: "noopener"
  }, "Contact Us \u2192"))));
}

// ─── Upsell + IMC 2025-26 ────────────────────────────────
function Upsell() {
  return /*#__PURE__*/React.createElement("section", {
    className: "imc-upsell-section",
    id: "imc-2526"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-upsell"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Want to win Olympiads?"), /*#__PURE__*/React.createElement("p", null, "The 10x Speed & Logic Program is exactly how this year's toppers trained. Flexible 4\xD7 a week, 15\u201320 minutes per session with an AI coach \u2014 building the speed, logic and pattern-recognition that win IMC, IMO, NMTC, and school-level Olympiads."), /*#__PURE__*/React.createElement("div", {
    className: "imc-upsell-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://learn.mathai.ai/",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "imc-btn imc-btn-primary"
  }, "Start 7-day trial \u2014 just \u20B91"))), /*#__PURE__*/React.createElement("div", {
    className: "imc-upsell-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: '0.1em',
      opacity: 0.7
    }
  }, "10X SPEED & LOGIC"), /*#__PURE__*/React.createElement("div", {
    className: "price",
    style: {
      marginTop: 8
    }
  }, "\u20B9799", /*#__PURE__*/React.createElement("small", null, " /month")), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Flexible 4 times per week"), /*#__PURE__*/React.createElement("li", null, "Just 15\u201320 min per session with AI coach"), /*#__PURE__*/React.createElement("li", null, "Improves thinking and speed via math games"), /*#__PURE__*/React.createElement("li", null, "Aligned with IB, Common Core, CBSE, IGCSE & ICSE"), /*#__PURE__*/React.createElement("li", null, "Cancel anytime"))))));
}

// ─── FAQ ─────────────────────────────────────────────────
function FAQ() {
  const items = [{
    q: 'How are the rankings calculated?',
    a: 'For overall ranks, the combined raw score across all 5 IMC challenges over the year — each challenge weighted equally; ties broken by total time taken. For individual challenges, the challenge-level score was used; ties broken by total time taken.'
  }, {
    q: 'Do international winners get the same prizes?',
    a: 'Top 10 physical prizes ship within India. International winners (UAE, Kuwait, etc.) receive equivalent MathAI credit.'
  }, {
    q: 'What is the 10x Speed & Logic Program?',
    a: "MathAI's flagship daily-practice program — exactly how this year's Top 100 trained. Just 15–20 minutes per session, 4× a week with an AI coach, building the speed, logic and pattern-recognition skills that compound into mathematical intuition. Aligned with IB, Common Core, CBSE, IGCSE & ICSE."
  }];
  const [open, setOpen] = useState(0);
  return /*#__PURE__*/React.createElement("section", {
    className: "imc-faq-section",
    id: "faq"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-section-eyebrow",
    style: {
      textAlign: 'center'
    }
  }, "\u2605 Questions"), /*#__PURE__*/React.createElement("h2", {
    className: "imc-h2",
    style: {
      textAlign: 'center'
    }
  }, "Frequently asked"), /*#__PURE__*/React.createElement("div", {
    className: "imc-faq"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "imc-faq-item",
    "data-open": open === i
  }, /*#__PURE__*/React.createElement("button", {
    className: "imc-faq-q",
    onClick: () => setOpen(open === i ? -1 : i)
  }, /*#__PURE__*/React.createElement("span", null, it.q), /*#__PURE__*/React.createElement("span", {
    className: "imc-faq-icon"
  }, "+")), /*#__PURE__*/React.createElement("div", {
    className: "imc-faq-a"
  }, it.a))))));
}

// ─── Footer ──────────────────────────────────────────────
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "imc-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-shell imc-footer-inner"
  }, /*#__PURE__*/React.createElement("p", null, "\xA9 2025 MathAI. The IMC is an annual mathematics championship for students in Grades 3\u20135."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Terms"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Contact"))));
}
Object.assign(window, {
  Nav,
  Hero,
  GradeTabs,
  Podium,
  TieredWall,
  PrizeShowcase,
  Challenges,
  Claim,
  Upsell,
  FAQ,
  Footer
});
})();

/* ── app/main.jsx ────────────────────────────── */
(function(){
/* eslint-disable */
const {
  useState,
  useEffect
} = React;
function App() {
  const [data, setData] = useState(window.IMC_DATA || null);
  const [grade, setGrade] = useState(3);
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "heroLine1": "Celebrating",
    "heroLine2": "Math wizards",
    "heroLede": "Celebrating the efforts of young minds across five challenges spanning a year of the International Math Challenge 2024–25.",
    "confetti": true,
    "showChallenges": true
  } /*EDITMODE-END*/);
  useEffect(() => {
    if (data) return;
    const onReady = () => setData(window.IMC_DATA);
    window.addEventListener('imc-data-ready', onReady);
    return () => window.removeEventListener('imc-data-ready', onReady);
  }, [data]);
  if (!data) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '120px 20px',
        textAlign: 'center',
        color: 'var(--mai-fg-2)'
      }
    }, "Loading IMC results\u2026");
  }
  const overall = data.overall[grade] || [];
  const challenges = data.challenges[grade] || [];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Nav, {
    tweaks: tweaks
  }), /*#__PURE__*/React.createElement(Hero, {
    tweaks: tweaks,
    totalWinners: 300,
    gradeCount: 3,
    challengeCount: 5
  }), /*#__PURE__*/React.createElement("section", {
    className: "imc-grade-sticky"
  }, /*#__PURE__*/React.createElement("div", {
    className: "imc-shell imc-grade-sticky-inner"
  }, /*#__PURE__*/React.createElement(GradeTabs, {
    grade: grade,
    setGrade: setGrade
  }))), /*#__PURE__*/React.createElement(Podium, {
    overall: overall,
    grade: grade
  }), /*#__PURE__*/React.createElement(TieredWall, {
    overall: overall,
    tweaks: tweaks,
    grade: grade
  }), /*#__PURE__*/React.createElement(PrizeShowcase, null), tweaks.showChallenges && /*#__PURE__*/React.createElement(Challenges, {
    challenges: challenges,
    grade: grade
  }), /*#__PURE__*/React.createElement(Claim, null), /*#__PURE__*/React.createElement(Upsell, null), /*#__PURE__*/React.createElement(FAQ, null));
}
ReactDOM.createRoot(document.getElementById('app')).render(/*#__PURE__*/React.createElement(App, null));
})();
