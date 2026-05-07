/* eslint-disable */
// Hero, Nav, Podium, Tier Wall, Prizes, Challenges, Claim, Upsell, FAQ, Footer
// All exported to window for cross-script access.

const { useState, useEffect, useMemo, useCallback, useRef } = React;

// ─── Confetti ─────────────────────────────────────────────
function Confetti({ count = 24 }) {
  const colors = ['#FFDE49','#F96B4C','#270F36','#FFC107','#1DAE69'];
  const pieces = useMemo(() => Array.from({length: count}, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 6 + Math.random() * 4,
    color: colors[i % colors.length],
    rot: Math.random() * 360,
    size: 6 + Math.random() * 6,
  })), [count]);
  return (
    <div className="imc-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span key={i} style={{
          left: p.left + '%',
          background: p.color,
          width: p.size + 'px',
          height: (p.size * 1.6) + 'px',
          animationDelay: p.delay + 's',
          animationDuration: p.duration + 's',
          transform: `rotate(${p.rot}deg)`,
        }} />
      ))}
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────
function Nav({ tweaks }) {
  return (
    <nav className="imc-nav">
      <div className="imc-shell imc-nav-inner">
        <a href="#top" className="imc-logo" style={{textDecoration:'none', color:'inherit'}}>
          <div className="imc-logo-mark">
            <div className="core" style={{position:'absolute', top:0, left:0}}/>
            <div className="companion"/>
          </div>
          <div className="imc-logo-text">Math<span className="ai">AI</span></div>
        </a>
        <div className="imc-nav-links">
          <a href="#podium">Podium</a>
          <a href="#leaderboard">Leaderboard</a>
          <a href="#prizes">Prizes</a>
          <a href="#claim">Claim</a>
          <a href="https://learn.mathai.ai/" target="_blank" rel="noopener noreferrer" className="imc-btn imc-btn-primary" style={{padding:'10px 18px'}}>Join 10x Speed &amp; Logic →</a>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────
function Hero({ tweaks, totalWinners, gradeCount, challengeCount }) {
  return (
    <section className="imc-hero" id="top">
      <div className="imc-hero-bg"/>
      {tweaks.confetti && <Confetti count={28}/>}
      <div className="imc-glyph" style={{ top: '15%', left: '6%' }}>π</div>
      <div className="imc-glyph" style={{ top: '60%', left: '88%', animationDelay: '0.6s' }}>∑</div>
      <div className="imc-glyph" style={{ top: '78%', left: '12%', animationDelay: '1.2s' }}>√</div>

      <div className="imc-shell imc-hero-inner imc-hero-grid">
        <div className="imc-hero-copy">
          <div className="imc-eyebrow">
            <span className="dot"/> IMC 2024–25 · Prizes &amp; Ranks Announced!
          </div>
          <h1 className="imc-h1">
            {tweaks.heroLine1}<br/>
            <span className="yellow">{tweaks.heroLine2}</span>
          </h1>
          <p className="imc-lede">{tweaks.heroLede}</p>

          <div className="imc-hero-actions">
            <a href="#leaderboard" className="imc-btn imc-btn-primary">See the Top 100 →</a>
            <a href="#claim" className="imc-btn imc-btn-ghost">How to claim your prize</a>
          </div>
        </div>

        <div className="imc-hero-art">
          <div className="imc-hero-art-frame">
            <picture>
              <source srcSet="app/assets/hero-banner.webp" type="image/webp"/>
              <img src="app/assets/hero-banner.jpg" alt="IMC 2024–25 winners celebrating with the trophy" width="800" height="800" decoding="async" fetchpriority="high"/>
            </picture>
            <div className="imc-hero-art-glow" aria-hidden="true"/>
          </div>
          <div className="imc-hero-art-badge">
            <div className="imc-hero-art-badge-num">300</div>
            <div className="imc-hero-art-badge-label">winners<br/>celebrated</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Grade switcher ──────────────────────────────────────
function GradeTabs({ grade, setGrade }) {
  return (
    <div className="imc-tabs" role="tablist" aria-label="Choose grade">
      {[3,4,5].map(g => (
        <button
          key={g}
          role="tab"
          aria-selected={grade === g}
          onClick={() => setGrade(g)}
          className="imc-tab"
        >
          <span className="imc-tab-grade">Grade {g}</span>
          <span className="imc-tab-ay">AY 2024–25</span>
        </button>
      ))}
    </div>
  );
}

// ─── Podium ──────────────────────────────────────────────
function Podium({ overall, grade }) {
  const [g1, g2, g3] = overall.slice(0, 3);
  return (
    <section className="imc-podium-section" id="podium">
      <div className="imc-shell">
        <div className="imc-section-eyebrow">★ Champions of the Year · AY 2024–25</div>
        <h2 className="imc-h2">The Podium</h2>
        <p className="imc-lede" style={{maxWidth:'56ch'}}>
          Three young mathematicians from <strong>Grade {grade}</strong> who topped every challenge across the academic year 2024–25.
        </p>

        <div className="imc-podium">
          <PodiumCard rank={2} student={g2} medal="🥈" tone="silver" prize={window.PRIZES.kindle}/>
          <PodiumCard rank={1} student={g1} medal="🥇" tone="gold"   prize={window.PRIZES.ipad}/>
          <PodiumCard rank={3} student={g3} medal="🥉" tone="bronze" prize={window.PRIZES.a4}/>
        </div>
      </div>
    </section>
  );
}
function PodiumCard({ rank, student, medal, tone, prize }) {
  if (!student) return null;
  return (
    <article className={`imc-podium-card ${tone}`}>
      <div className="imc-podium-rank">RANK {rank}</div>
      <div className="imc-podium-medal" aria-hidden="true">{medal}</div>
      <div className="imc-podium-prize"><img src={prize.img} alt={prize.label} loading="lazy" decoding="async"/></div>
      <div className="imc-podium-name">{student.name}</div>
      <div className="imc-podium-school">{student.school}</div>
      <div className="imc-podium-divider"/>
      <div className="imc-podium-prize-name">{prize.label}</div>
      <div className="imc-podium-prize-extras">+ {prize.months} {prize.months === 1 ? 'month' : 'months'} MathAI Premium</div>
    </article>
  );
}

// ─── Top 100 — Tiered Wall ───────────────────────────────
function TieredWall({ overall, tweaks, grade }) {
  const [collapsed, setCollapsed] = useState({ top25:false, top50:true, top100:true });
  const tiers = useMemo(() => {
    return {
      podium:  { id:'podium',  label:'RANKS 1–3',    range:'',  desc:'iPad / Kindle / A4 Printer + 3 months MathAI', rows: overall.slice(0,3)   },
      top10:   { id:'top10',   label:'RANKS 4–10',   range:'',  desc:'SEZNIK Mini Printer + 2 months MathAI',        rows: overall.slice(3,10)  },
      top25:   { id:'top25',   label:'RANKS 11–25',  range:'',  desc:'1.5 months free MathAI + 10x Speed & Logic',   rows: overall.slice(10,25) },
      top50:   { id:'top50',   label:'RANKS 26–50',  range:'',  desc:'1 month free MathAI + 10x Speed & Logic',      rows: overall.slice(25,50) },
      top100:  { id:'top100',  label:'RANKS 51–100', range:'',  desc:'1 month free MathAI + 10x Speed & Logic',      rows: overall.slice(50,100)},
    };
  }, [overall]);

  return (
    <section className="imc-top100-section" id="leaderboard">
      <div className="imc-shell">
        <div className="imc-section-eyebrow">★ Hall of Honor · AY 2024–25</div>
        <h2 className="imc-h2">Top 100 — Every Winner, by Tier</h2>
        <p className="imc-lede">
          Overall ranks based on cumulative scores across all 5 challenges.
        </p>

        {Object.values(tiers).map(t => (
          <Tier
            key={t.id}
            tier={t}
            collapsed={!!collapsed[t.id]}
            onToggle={() => setCollapsed(c => ({ ...c, [t.id]: !c[t.id] }))}
          />
        ))}
      </div>
    </section>
  );
}

function Tier({ tier, collapsed, onToggle }) {
  const collapsibleTiers = ['top25','top50','top100'];
  const isCollapsible = collapsibleTiers.includes(tier.id);
  const initialShow = isCollapsible ? Math.min(6, tier.rows.length) : tier.rows.length;
  const visibleRows = collapsed ? tier.rows.slice(0, initialShow) : tier.rows;

  return (
    <div className={`imc-tier imc-tier-${tier.id}`}>
      <div className="imc-tier-header">
        <div>
          <strong>{tier.label}</strong>
          <span style={{marginLeft:12, opacity:0.7, fontSize:13, fontWeight:600}}>{tier.range}</span>
        </div>
        <div className="desc">{tier.desc}</div>
      </div>
      <div className="imc-tier-rows">
        {visibleRows.map(r => <Row key={r.profileId + '-' + r.rank} row={r}/>)}
      </div>
      {isCollapsible && (
        <button className="imc-tier-toggle" onClick={onToggle}>
          {collapsed
            ? `Show all ${tier.label.replace('TOP ', '')} ↓`
            : `Show fewer ↑`}
        </button>
      )}
    </div>
  );
}

function Row({ row }) {
  const prize = window.prizeForRank(row.rank);
  const isPhysical = prize.kind === 'physical';
  const img = isPhysical ? (prize.thumb || prize.img) : window.CREDIT_SVG_URI;
  const monthWord = (m) => (m === 1 ? 'month' : 'months');
  const prizeName = isPhysical ? (prize.short || prize.label) : `${prize.months} ${monthWord(prize.months)} MathAI`;
  const prizeSub = isPhysical
    ? `+ ${prize.months} ${monthWord(prize.months)} MathAI Premium`
    : '+ 10x Speed & Logic Program';
  return (
    <div className="imc-row">
      <div className="imc-row-rank">#{row.rank}</div>
      <div className="imc-row-meta">
        <div className="imc-row-name">{row.name}</div>
        <div className="imc-row-school">{row.school || '—'}</div>
      </div>
      <div className="imc-row-prize">
        <div className={`imc-row-thumb ${isPhysical ? '' : 'credit'}`}>
          <img src={img} alt="" loading="lazy" decoding="async"/>
        </div>
        <div className="imc-row-prize-name">{prizeName}</div>
        <div className="imc-row-prize-sub">{prizeSub}</div>
      </div>
    </div>
  );
}

// ─── Prizes Showcase ─────────────────────────────────────
function PrizeShowcase() {
  return (
    <section className="imc-prizes-section" id="prizes">
      <div className="imc-shell">
        <div className="imc-section-eyebrow">★ The Prizes</div>
        <h2 className="imc-h2">Real things, in real boxes,<br/>shipped to your door.</h2>
        <p className="imc-lede">Plus access to MathAI's flagship 10x Speed & Logic Program.</p>

        <div className="imc-prize-grid">
          <article className="imc-prize-card gold feature">
            <div className="label">RANK 1 · GOLD</div>
            <h3>Apple iPad 10th Gen</h3>
            <div className="img-wrap"><img src="assets/prizes/ipad.webp" alt="iPad" loading="lazy" decoding="async"/></div>
            <div className="meta">+ 3 months MathAI Premium</div>
          </article>
          <article className="imc-prize-card silver">
            <div className="label">RANK 2 · SILVER</div>
            <h3>Kindle Paperwhite</h3>
            <div className="img-wrap"><img src="assets/prizes/kindle.webp" alt="Kindle" loading="lazy" decoding="async"/></div>
            <div className="meta">+ 3 months MathAI Premium</div>
          </article>
          <article className="imc-prize-card bronze">
            <div className="label">RANK 3 · BRONZE</div>
            <h3>SEZNIK A4 Printer</h3>
            <div className="img-wrap"><img src="assets/prizes/a4.webp" alt="A4 Printer" loading="lazy" decoding="async"/></div>
            <div className="meta">+ 2.5 months MathAI Premium</div>
          </article>
          <article className="imc-prize-card top10">
            <div className="label">RANK 4 – 10</div>
            <h3>SEZNIK Mini Printer</h3>
            <div className="img-wrap"><img src="assets/prizes/mini.webp" alt="Mini Printer" loading="lazy" decoding="async"/></div>
            <div className="meta">+ 2 months MathAI Premium</div>
          </article>
          <article className="imc-prize-card challenge">
            <div className="label">RANK 11 – 100</div>
            <h3>MathAI Program Credit</h3>
            <div className="img-wrap" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.5)'}}>
              <div style={{fontSize:48, fontWeight:800, letterSpacing:'-0.04em'}}>1–1.5<span style={{fontSize:18, opacity:0.6, marginLeft:6}}>months</span></div>
            </div>
            <div className="meta">10x Speed & Logic Program access</div>
          </article>
        </div>

        <div style={{marginTop: 32, padding: '22px 26px', background: 'var(--mai-cream)', borderRadius: 18, border: '1px solid var(--mai-border)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'}}>
          <div style={{fontSize: 36, lineHeight: 1}}>🏆</div>
          <div style={{flex: 1, minWidth: 240}}>
            <div style={{fontSize: 15, fontWeight: 800, color: 'var(--mai-purple)', letterSpacing: '-0.01em'}}>Total prize value of more than ₹7,00,000</div>
            <div style={{fontSize: 13, color: 'var(--mai-fg-2)', marginTop: 4, lineHeight: 1.5}}>45 physical prizes shipped + program credits for every ranked student across overall &amp; per-challenge leaderboards.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5 Challenges ────────────────────────────────────────
function Challenges({ challenges, grade }) {
  const [openIdx, setOpenIdx] = useState(null);
  const meta = [
    { emoji:'🧮', name:'Mental Math',     desc:'Speed + accuracy on calculation drills' },
    { emoji:'🔍', name:'Patterns & Logic', desc:'Spot the rule, predict the next term'   },
    { emoji:'🎯', name:'Estimation',       desc:'Smart guessing for real-world problems' },
    { emoji:'🧩', name:'Riddles',          desc:'Lateral thinking & word problems'       },
    { emoji:'🎲', name:'Puzzles & Games',  desc:'Strategy, spatial reasoning, play'      },
  ];
  return (
    <section className="imc-challenges-section" id="challenges">
      <div className="imc-shell">
        <div className="imc-section-eyebrow">★ Per-Challenge Recognition · AY 2024–25</div>
        <h2 className="imc-h2">Five challenges. Five champions per grade.</h2>
        <p className="imc-lede">
          Each themed challenge has its own Top 20 per grade with its own prize ladder — separate from the overall ranking. Tap a challenge to see who topped it in Grade {grade}.
        </p>

        <div className="imc-challenge-grid">
          {meta.map((m, i) => (
            <button
              key={i}
              className="imc-challenge-card"
              data-active={openIdx === i}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              aria-expanded={openIdx === i}
            >
              <div className="imc-challenge-card-top">
                <div className="emoji" aria-hidden="true">{m.emoji}</div>
                <div className="imc-challenge-card-num">IMC {i+1}</div>
              </div>
              <h4>{m.name}</h4>
              <p>{m.desc}</p>
              <span className="imc-challenge-card-cta">
                {openIdx === i ? <>Hide rankings <span className="chev">▲</span></> : <>See Top 20 <span className="chev">▼</span></>}
              </span>
            </button>
          ))}
        </div>

        {openIdx !== null && challenges[openIdx] && (
          <ChallengeDrawer
            challenge={challenges[openIdx]}
            grade={grade}
            meta={meta[openIdx]}
            challengeNum={openIdx + 1}
            onClose={() => setOpenIdx(null)}
          />
        )}
      </div>
    </section>
  );
}

// Inline drawer on desktop; full-screen modal sheet on mobile.
function ChallengeDrawer({ challenge, grade, meta, challengeNum, onClose }) {
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
    return () => { document.body.style.overflow = prev; };
  }, [isMobile]);

  // Esc to close (modal mode)
  useEffect(() => {
    if (!isMobile) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobile, onClose]);

  // Group rows by challenge-prize tier so the same tiered-band pattern reads.
  const groups = useMemo(() => {
    const buckets = {
      champ: { id:'champ', label:'RANK 1',         range:'', desc:'SEZNIK Mini Thermal Printer + 2 months MathAI', rows:[] },
      top3:  { id:'top3',  label:'RANKS 2–3',  range:'', desc:'1.5 months MathAI Premium',                     rows:[] },
      top10: { id:'top10', label:'RANKS 4–10', range:'', desc:'1 month MathAI Premium',                        rows:[] },
      top20: { id:'top20', label:'RANKS 11–20',range:'', desc:'45 days MathAI Premium',                        rows:[] },
    };
    challenge.rows.forEach(r => {
      if (r.rank === 1) buckets.champ.rows.push(r);
      else if (r.rank <= 3)  buckets.top3.rows.push(r);
      else if (r.rank <= 10) buckets.top10.rows.push(r);
      else                   buckets.top20.rows.push(r);
    });
    return Object.values(buckets).filter(g => g.rows.length);
  }, [challenge]);

  const body = (
    <>
      <div className="imc-cw-drawer-head">
        <div className="imc-cw-drawer-title">
          <span className="emoji" aria-hidden="true">{meta.emoji}</span>
          <div>
            <div className="eyebrow">IMC {challengeNum} · {challenge.title.replace(/^IMC\s*\d+\s*-\s*/, '').replace(/\s*Challenge\s*$/, '')}</div>
            <h3>Grade {grade} · Top {challenge.rows.length}</h3>
            <div className="imc-cw-drawer-ay">AY 2024–25</div>
          </div>
        </div>
        <div className="imc-cw-drawer-ladder" aria-label="Prize ladder for this challenge">
          <div className="imc-cw-drawer-ladder-label">Prize ladder for this challenge</div>
          <div className="imc-cw-drawer-ladder-row">
            <span className="rung champ"><b>#1</b> Mini Printer + 2mo</span>
            <span className="rung"><b>#2–3</b> 1.5 months</span>
            <span className="rung"><b>#4–10</b> 1 month</span>
            <span className="rung"><b>#11–20</b> 45 days</span>
          </div>
        </div>
      </div>

      {groups.map(g => (
        <div key={g.id} className={`imc-tier imc-cw-tier-${g.id}`}>
          <div className="imc-tier-header">
            <div>
              <strong>{g.label}</strong>
              <span style={{marginLeft:12, opacity:0.7, fontSize:13, fontWeight:600}}>{g.range}</span>
            </div>
            <div className="desc">{g.desc}</div>
          </div>
          <div className="imc-tier-rows">
            {g.rows.map(r => <ChallengeRow key={r.profileId + '-' + r.rank} row={r}/>)}
          </div>
        </div>
      ))}
    </>
  );

  if (isMobile) {
    return (
      <div className="imc-cw-modal-backdrop" role="dialog" aria-modal="true" aria-label={`${meta.name} rankings`}
           onClick={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
        <div className="imc-cw-modal-sheet">
          <div className="imc-cw-modal-bar">
            <div className="imc-cw-modal-bar-title">
              <span className="emoji" aria-hidden="true">{meta.emoji}</span>
              <span>IMC {challengeNum} · {meta.name}</span>
            </div>
            <button className="imc-cw-modal-close" onClick={onClose} aria-label="Close">×</button>
          </div>
          <div className="imc-cw-modal-body">
            {body}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="imc-cw-drawer" id={`challenge-drawer-${challengeNum}`}>
      {body}
    </div>
  );
}

function ChallengeRow({ row }) {
  const prize = window.challengePrizeForRank(row.rank);
  const isPhysical = prize.kind === 'physical';
  const img = isPhysical ? (prize.thumb || prize.img) : window.CREDIT_SVG_URI;
  const prizeNameSingle = (() => {
    if (row.rank === 1)   return 'Mini Printer';
    if (row.rank <= 3)    return '1.5 months MathAI';
    if (row.rank <= 10)   return '1 month MathAI';
    return '45 days MathAI';
  })();
  const prizeSub = (row.rank === 1) ? '+ 2 months MathAI Premium' : '+ 10x Speed & Logic Program';
  return (
    <div className="imc-row">
      <div className="imc-row-rank">#{row.rank}</div>
      <div className="imc-row-meta">
        <div className="imc-row-name">{row.name}</div>
        <div className="imc-row-school">{row.school || '—'}</div>
      </div>
      <div className="imc-row-prize">
        <div className={`imc-row-thumb ${isPhysical ? '' : 'credit'}`}>
          <img src={img} alt="" loading="lazy" decoding="async"/>
        </div>
        <div className="imc-row-prize-name">{prizeNameSingle}</div>
        <div className="imc-row-prize-sub">{prizeSub}</div>
      </div>
    </div>
  );
}

// ─── How to Claim ────────────────────────────────────────
function Claim() {
  return (
    <section className="imc-claim-section" id="claim">
      <div className="imc-shell">
        <div className="imc-section-eyebrow">★ How It Works</div>
        <h2 className="imc-h2">Claiming your prize</h2>
        <p className="imc-lede">Two tracks — depending on whether you've won a physical prize or program credit. Most winners only need to follow one of these.</p>

        <div className="imc-claim-tracks">
          {/* TRACK A — PHYSICAL */}
          <article className="imc-claim-track imc-claim-physical">
            <div className="imc-claim-track-head">
              <div className="imc-claim-track-tag">Track A</div>
              <h3>If you won a physical prize</h3>
              <p className="imc-claim-track-who">
                <strong>Who:</strong> Overall Rank 1–10 (iPad / Kindle / A4 Printer / Mini Printer) and Challenge Rank 1 winners (Mini Printer)
              </p>
            </div>
            <ol className="imc-claim-steps">
              <li>
                <span className="num">1</span>
                <div>
                  <h4>You'll hear from us</h4>
                  <p>The MathAI team will reach out on <strong>WhatsApp + email</strong> within 5 working days. We use the number and email on your MathAI profile.</p>
                </div>
              </li>
              <li>
                <span className="num">2</span>
                <div>
                  <h4>Share your shipping address</h4>
                  <p>Reply with your full shipping address. <strong>India winners only</strong> — international winners (UAE, Kuwait, etc.) receive equivalent MathAI credit instead.</p>
                </div>
              </li>
              <li>
                <span className="num">3</span>
                <div>
                  <h4>Prize on the way</h4>
                  <p>Prize ships within 14 working days of address confirmation.</p>
                </div>
              </li>
            </ol>
          </article>

          {/* TRACK B — CREDIT */}
          <article className="imc-claim-track imc-claim-credit">
            <div className="imc-claim-track-head">
              <div className="imc-claim-track-tag">Track B</div>
              <h3>If you won MathAI credit</h3>
              <p className="imc-claim-track-who">
                <strong>Who:</strong> All Top 100 — Overall Rank 1–100 and Challenge Rank 1–20. Every winner gets MathAI credit (durations vary by rank); physical-prize winners get this in addition to their physical prize.
              </p>
            </div>
            <ol className="imc-claim-steps">
              <li>
                <span className="num">1</span>
                <div>
                  <h4>Message us to activate</h4>
                  <p>WhatsApp the MathAI team saying you'd like to start the <strong>10x Speed &amp; Logic Program</strong>. Mention your child's name, grade and school name.</p>
                </div>
              </li>
              <li>
                <span className="num">2</span>
                <div>
                  <h4>We activate your free months</h4>
                  <p>Your free MathAI Premium credit is applied to your account within 24 hours. No payment required.</p>
                </div>
              </li>
              <li>
                <span className="num">3</span>
                <div>
                  <h4>Open the app, start playing</h4>
                  <p>Your child can begin the 10x Speed &amp; Logic Program right away.</p>
                </div>
              </li>
            </ol>
          </article>
        </div>

        <div className="imc-claim-contact">
          <div className="imc-claim-contact-text">
            <h4>Need help, or didn't hear from us?</h4>
            <p>Reach out to the MathAI team on WhatsApp with your child's name, school name and phone number used in IMC.</p>
          </div>
          <a className="imc-btn imc-btn-primary imc-claim-contact-cta" href="https://wa.me/918884761744?text=Hi%21%20I%20want%20to%20enquire%20about%20IMC%202024-25%20prizes" target="_blank" rel="noopener">Contact Us →</a>
        </div>
      </div>
    </section>
  );
}

// ─── Upsell + IMC 2025-26 ────────────────────────────────
function Upsell() {
  return (
    <section className="imc-upsell-section" id="imc-2526">
      <div className="imc-shell">
        <div className="imc-upsell">
          <div>
            <h2>Want to win Olympiads?</h2>
            <p>The 10x Speed &amp; Logic Program is exactly how this year's toppers trained. Flexible 4× a week, 15–20 minutes per session with an AI coach — building the speed, logic and pattern-recognition that win IMC, IMO, NMTC, and school-level Olympiads.</p>
            <div className="imc-upsell-actions">
              <a href="https://learn.mathai.ai/" target="_blank" rel="noopener noreferrer" className="imc-btn imc-btn-primary">Start 7-day trial — just ₹1</a>
            </div>
          </div>
          <div className="imc-upsell-card">
            <div className="label" style={{fontSize:11, fontWeight:800, letterSpacing:'0.1em', opacity:0.7}}>10X SPEED & LOGIC</div>
            <div className="price" style={{marginTop:8}}>₹799<small> /month</small></div>
            <ul>
              <li>Flexible 4 times per week</li>
              <li>Just 15–20 min per session with AI coach</li>
              <li>Improves thinking and speed via math games</li>
              <li>Aligned with IB, Common Core, CBSE, IGCSE &amp; ICSE</li>
              <li>Cancel anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────
function FAQ() {
  const items = [
    { q:'How are the rankings calculated?',
      a:'For overall ranks, the combined raw score across all 5 IMC challenges over the year — each challenge weighted equally; ties broken by total time taken. For individual challenges, the challenge-level score was used; ties broken by total time taken.' },
    { q:'Do international winners get the same prizes?',
      a:'Top 10 physical prizes ship within India. International winners (UAE, Kuwait, etc.) receive equivalent MathAI credit.' },
    { q:'What is the 10x Speed & Logic Program?',
      a:"MathAI's flagship daily-practice program — exactly how this year's Top 100 trained. Just 15–20 minutes per session, 4× a week with an AI coach, building the speed, logic and pattern-recognition skills that compound into mathematical intuition. Aligned with IB, Common Core, CBSE, IGCSE & ICSE." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="imc-faq-section" id="faq">
      <div className="imc-shell">
        <div className="imc-section-eyebrow" style={{textAlign:'center'}}>★ Questions</div>
        <h2 className="imc-h2" style={{textAlign:'center'}}>Frequently asked</h2>
        <div className="imc-faq">
          {items.map((it, i) => (
            <div key={i} className="imc-faq-item" data-open={open === i}>
              <button className="imc-faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{it.q}</span>
                <span className="imc-faq-icon">+</span>
              </button>
              <div className="imc-faq-a">{it.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────
function Footer() {
  return (
    <footer className="imc-footer">
      <div className="imc-shell imc-footer-inner">
        <p>© 2025 MathAI. The IMC is an annual mathematics championship for students in Grades 3–5.</p>
        <div>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Nav, Hero, GradeTabs, Podium, TieredWall, PrizeShowcase, Challenges, Claim, Upsell, FAQ, Footer
});
