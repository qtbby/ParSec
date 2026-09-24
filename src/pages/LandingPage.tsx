import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-copy">
        <p className="eyebrow">A local-first parish workspace</p>
        <h1>Parish work,<br /><em>kept close to home.</em></h1>
        <p className="lede">Parish System gives your office a clear, calm place to work while your parish data stays on the computer you choose.</p>
        <Link className="button button-primary" to="/setup">Begin setup <span aria-hidden="true">↗</span></Link>
        <p className="quiet-note">Your browser will only access a folder after you explicitly choose it.</p>
      </section>
      <aside className="landing-aside" aria-label="Phase 1 features">
        <div className="seal">PS</div>
        <p className="aside-kicker">Phase one</p>
        <h2>A considered beginning for parish offices.</h2>
        <div className="feature-list">
          <div><span>01</span><p>Choose where parish data lives</p></div>
          <div><span>02</span><p>Reconnect access when needed</p></div>
          <div><span>03</span><p>Build on a foundation made to last</p></div>
        </div>
      </aside>
    </main>
  )
}
