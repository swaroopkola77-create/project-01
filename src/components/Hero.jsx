function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__grid">
        <div className="hero__copy">
          <p className="eyebrow"><span className="eyebrow__pulse" /> CSE AI/ML • Hyderabad</p>
          <h1 id="hero-title">
            Building <span className="hero__gradient">intelligent</span> interfaces for real-world problems.
          </h1>
          <p className="hero__lead">
            I’m Swaroop Kola — a student developer exploring software engineering, AI/ML, and product design through ambitious, practical projects.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="#work">Explore my work <span>↓</span></a>
            <a className="button button--ghost" href="#contact">Start a conversation ↗</a>
          </div>
          <div className="hero__meta">
            <div><span>Current focus</span><strong>AI + Full-stack</strong></div>
            <div><span>Building with</span><strong>Python · C++ · React</strong></div>
            <div><span>Open to</span><strong>Internships + Projects</strong></div>
          </div>
        </div>
        <OrbitalScene />
      </div>
      <div className="hero__ticker" aria-hidden="true">
        <span>SOFTWARE ENGINEERING</span><span>•</span><span>AI / ML</span><span>•</span><span>PRODUCT THINKING</span><span>•</span><span>BUILD • LEARN • SHIP</span>
      </div>
    </section>
  );
}

