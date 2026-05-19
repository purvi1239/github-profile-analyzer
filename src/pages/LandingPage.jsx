import { useState, useEffect, useRef, useCallback } from "react";
import "../LandingPage.css";

/* ── Intersection Observer hook for fade-in animations ── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}



/* ── GitHub SVG logo ── */
const GitHubLogo = ({ size = 32 }) => (
  <svg height={size} width={size} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

/* ── Data ── */
const FEATURES = [
  { icon: "🔍", title: "Deep Profile Analysis", desc: "Get instant insights into any GitHub profile — repos, stars, languages, and contribution patterns.", color: "#58a6ff" },
  { icon: "⚔️", title: "Side-by-Side Comparison", desc: "Compare two developers head-to-head with our visual comparison tool and scoring system.", color: "#f85149" },
  { icon: "🎯", title: "Role Fit Scoring", desc: "Automatically detect if a developer is best suited for Frontend, Backend, or Full Stack roles.", color: "#3fb950" },
  { icon: "🔥", title: "Contribution Heatmap", desc: "Visualise coding activity over time with our GitHub-style contribution heatmap.", color: "#f0883e" },
  { icon: "📊", title: "Language Analytics", desc: "See exactly which languages a developer uses most with beautiful donut charts.", color: "#a371f7" },
  { icon: "🕐", title: "Search History", desc: "Never lose track of profiles you've reviewed with automatic search history.", color: "#e3b341" },
];

const STEPS = [
  { num: "①", icon: "🔐", title: "Sign In", desc: "Create your free account using email. Takes less than 30 seconds." },
  { num: "②", icon: "🔍", title: "Search Any Developer", desc: "Enter any GitHub username to instantly pull their full profile and analytics." },
  { num: "③", icon: "✅", title: "Compare & Decide", desc: "Use our comparison tool to evaluate candidates side by side with data." },
];



const COMPARISON_FEATURES = [
  "Profile scores out of 100",
  "Head-to-head stat comparison",
  "Language overlap analysis",
  "Role fit percentage",
  "Shareable comparison links",
];

/* ────────────────────────────────────────────────── */
export default function LandingPage({ onSignIn, onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Section refs ── */
  const [featRef, featInView] = useInView();
  const [stepsRef, stepsInView] = useInView();
  const [spotRef, spotInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  return (
    <div className="lp">
      {/* ═══ NAVBAR ═══ */}
      <nav className={`lp-nav${scrolled ? " lp-nav--solid" : ""}`}>
        <div className="lp-nav__inner">
          <div className="lp-nav__brand">
            <GitHubLogo size={28} />
            <span>GitHub Analyser</span>
          </div>
          <div className="lp-nav__actions">
            <button className="lp-btn lp-btn--ghost" onClick={onSignIn}>Sign In</button>
            <button className="lp-btn lp-btn--green" onClick={onGetStarted}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="lp-hero">
        {/* Animated grid background */}
        <div className="lp-hero__grid" aria-hidden="true" />
        <div className="lp-hero__glow lp-hero__glow--1" aria-hidden="true" />
        <div className="lp-hero__glow lp-hero__glow--2" aria-hidden="true" />

        <div className="lp-hero__inner">
          <div className="lp-hero__left">
            <span className="lp-badge">✨ Free for recruiters &amp; developers</span>
            <h1 className="lp-hero__heading">
              Find the Best<br />
              <span className="lp-hero__heading--accent">Developer</span><br />
              Instantly
            </h1>
            <p className="lp-hero__sub">
              Analyse GitHub profiles, compare candidates side by side,
              and make hiring decisions backed by real data.
            </p>
            <div className="lp-hero__ctas">
              <button className="lp-btn lp-btn--green lp-btn--lg lp-btn--pulse" onClick={onGetStarted}>
                Get Started Free →
              </button>
              <button className="lp-btn lp-btn--ghost lp-btn--lg" onClick={onSignIn}>
                See Demo
              </button>
            </div>
            <p className="lp-hero__note">No credit card required • Free forever</p>
            <p className="lp-hero__proof">⭐ Trusted by 500+ recruiters and developers</p>
          </div>

          <div className="lp-hero__right">
            <div className="lp-mockup">
              <div className="lp-mockup__glow" />
              <div className="lp-mockup__window">
                {/* Title bar */}
                <div className="lp-mockup__titlebar">
                  <span className="lp-dot lp-dot--r" />
                  <span className="lp-dot lp-dot--y" />
                  <span className="lp-dot lp-dot--g" />
                  <span className="lp-mockup__titlebar-text">GitHub Analyser — Dashboard</span>
                </div>
                {/* Mini profile */}
                <div className="lp-mockup__body">
                  <div className="lp-mockup__profile">
                    <div className="lp-mockup__avatar">PM</div>
                    <div>
                      <div className="lp-mockup__name">Priya M.</div>
                      <div className="lp-mockup__handle">@priya-dev</div>
                    </div>
                  </div>
                  {/* Mini stats */}
                  <div className="lp-mockup__stats">
                    <div className="lp-mockup__stat">
                      <span className="lp-mockup__stat-val">142</span>
                      <span className="lp-mockup__stat-lbl">Repos</span>
                    </div>
                    <div className="lp-mockup__stat">
                      <span className="lp-mockup__stat-val">1.2k</span>
                      <span className="lp-mockup__stat-lbl">Stars</span>
                    </div>
                    <div className="lp-mockup__stat">
                      <span className="lp-mockup__stat-val">89</span>
                      <span className="lp-mockup__stat-lbl">Score</span>
                    </div>
                  </div>
                  {/* Mini language chart */}
                  <div className="lp-mockup__langs">
                    <div className="lp-mockup__lang-bar">
                      <div className="lp-mockup__lang-seg" style={{ width: "40%", background: "#f1e05a" }} />
                      <div className="lp-mockup__lang-seg" style={{ width: "30%", background: "#3178c6" }} />
                      <div className="lp-mockup__lang-seg" style={{ width: "20%", background: "#e34c26" }} />
                      <div className="lp-mockup__lang-seg" style={{ width: "10%", background: "#563d7c" }} />
                    </div>
                    <div className="lp-mockup__lang-labels">
                      <span><i style={{ background: "#f1e05a" }} />JavaScript</span>
                      <span><i style={{ background: "#3178c6" }} />TypeScript</span>
                      <span><i style={{ background: "#e34c26" }} />HTML</span>
                      <span><i style={{ background: "#563d7c" }} />CSS</span>
                    </div>
                  </div>
                  {/* Mini heatmap */}
                  <div className="lp-mockup__heatmap">
                    {Array.from({ length: 56 }).map((_, i) => (
                      <div
                        key={i}
                        className="lp-mockup__hm-cell"
                        style={{ opacity: Math.random() > 0.35 ? 0.25 + Math.random() * 0.75 : 0.08 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══ FEATURES ═══ */}
      <section className={`lp-features${featInView ? " lp-in" : ""}`} ref={featRef}>
        <div className="lp-section__inner">
          <h2 className="lp-section__title">Everything you need to evaluate developers</h2>
          <p className="lp-section__sub">Powerful tools built for modern hiring</p>
          <div className="lp-features__grid">
            {FEATURES.map((f, i) => (
              <div className="lp-feat-card" key={i} style={{ "--feat-color": f.color, animationDelay: `${i * 0.08}s` }}>
                <span className="lp-feat-card__icon">{f.icon}</span>
                <h3 className="lp-feat-card__title">{f.title}</h3>
                <p className="lp-feat-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className={`lp-steps${stepsInView ? " lp-in" : ""}`} ref={stepsRef}>
        <div className="lp-section__inner">
          <h2 className="lp-section__title">Get started in 3 simple steps</h2>
          <div className="lp-steps__row">
            {STEPS.map((s, i) => (
              <div className="lp-step" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                {i < 2 && <div className="lp-step__line" aria-hidden="true" />}
                <div className="lp-step__num">{i + 1}</div>
                <span className="lp-step__icon">{s.icon}</span>
                <h3 className="lp-step__title">{s.title}</h3>
                <p className="lp-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON SPOTLIGHT ═══ */}
      <section className={`lp-spotlight${spotInView ? " lp-in" : ""}`} ref={spotRef}>
        <div className="lp-spotlight__inner">
          <div className="lp-spotlight__text">
            <span className="lp-spotlight__label">FLAGSHIP FEATURE</span>
            <h2 className="lp-spotlight__heading">Compare developers like never before</h2>
            <p className="lp-spotlight__desc">
              Our side-by-side comparison tool gives you instant data-driven insights.
              See who has more experience, better activity, and the right skills for your role.
            </p>
            <ul className="lp-spotlight__list">
              {COMPARISON_FEATURES.map((f, i) => (
                <li key={i}>✅ {f}</li>
              ))}
            </ul>
            <button className="lp-btn lp-btn--green" onClick={onGetStarted}>Try it now →</button>
          </div>
          <div className="lp-spotlight__mockup">
            <div className="lp-compare-mock">
              <div className="lp-cmp-card">
                <div className="lp-cmp-avatar">AJ</div>
                <div className="lp-cmp-name">Alex J.</div>
                <div className="lp-cmp-score">86</div>
                <div className="lp-cmp-bar"><div style={{ width: "86%" }} /></div>
              </div>
              <div className="lp-cmp-vs">VS</div>
              <div className="lp-cmp-card">
                <div className="lp-cmp-avatar lp-cmp-avatar--b">SK</div>
                <div className="lp-cmp-name">Sara K.</div>
                <div className="lp-cmp-score">74</div>
                <div className="lp-cmp-bar"><div style={{ width: "74%" }} /></div>
              </div>
            </div>
            {/* Mini comparison table */}
            <div className="lp-cmp-table">
              <div className="lp-cmp-row lp-cmp-row--head">
                <span>Metric</span><span>Alex</span><span>Sara</span>
              </div>
              {[
                ["Repos", "142", "98"],
                ["Stars", "1.2k", "430"],
                ["Followers", "89", "156"],
                ["Languages", "7", "5"],
              ].map(([m, a, b], i) => (
                <div className="lp-cmp-row" key={i}>
                  <span>{m}</span><span>{a}</span><span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══ CTA ═══ */}
      <section className={`lp-cta${ctaInView ? " lp-in" : ""}`} ref={ctaRef}>
        <div className="lp-cta__inner">
          <h2 className="lp-cta__heading">Ready to find your next great hire?</h2>
          <p className="lp-cta__sub">
            Join hundreds of recruiters already using GitHub Analyser to make smarter hiring decisions.
          </p>
          <button className="lp-btn lp-btn--green lp-btn--lg lp-btn--pulse" onClick={onGetStarted}>
            Get Started For Free →
          </button>
          <p className="lp-cta__note">Free forever • No credit card required</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div className="lp-footer__col lp-footer__brand-col">
            <div className="lp-footer__brand">
              <GitHubLogo size={24} />
              <span>GitHub Analyser</span>
            </div>
            <p className="lp-footer__tagline">Analyse, compare, and hire with confidence.</p>
            <p className="lp-footer__heart">Built with ❤️ for recruiters</p>
          </div>
          <div className="lp-footer__col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#compare">Compare</a>
            <a href="#history">History</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="lp-footer__col">
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#blog">Blog</a>
            <a href="#careers">Careers</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="lp-footer__col">
            <h4>Legal</h4>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>

      </footer>
    </div>
  );
}
