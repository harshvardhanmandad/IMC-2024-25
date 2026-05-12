/* eslint-disable */
const { useState, useEffect } = React;

function App() {
  const [data, setData] = useState(window.IMC_DATA || null);
  const [grade, setGrade] = useState(3);

  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "heroLine1": "Celebrating",
    "heroLine2": "Math wizards",
    "heroLede": "Celebrating the efforts of young minds across five challenges spanning a year of the International Math Challenge 2024–25.",
    "confetti": true,
    "showChallenges": true
  }/*EDITMODE-END*/);

  useEffect(() => {
    if (data) return;
    const onReady = () => setData(window.IMC_DATA);
    window.addEventListener('imc-data-ready', onReady);
    return () => window.removeEventListener('imc-data-ready', onReady);
  }, [data]);

  if (!data) {
    return <div style={{padding:'120px 20px', textAlign:'center', color:'var(--mai-fg-2)'}}>Loading IMC results…</div>;
  }

  const overall = data.overall[grade] || [];
  const challenges = data.challenges[grade] || [];

  return (
    <>
      <Nav tweaks={tweaks}/>
      <Hero
        tweaks={tweaks}
        totalWinners={300}
        gradeCount={3}
        challengeCount={5}
      />

      <section className="imc-grade-sticky">
        <div className="imc-shell imc-grade-sticky-inner">
          <GradeTabs grade={grade} setGrade={setGrade}/>
        </div>
      </section>

      <Podium overall={overall} grade={grade}/>
      <TieredWall overall={overall} tweaks={tweaks} grade={grade}/>
      <PrizeShowcase/>
      {tweaks.showChallenges && <Challenges challenges={challenges} grade={grade}/>}
      <Claim/>
      <Upsell/>
      <FAQ/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
