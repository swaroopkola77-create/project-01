export function About() {
  return (
    <section id="about" className="about section">
      <div className="section__intro">
        <div>
          <p className="section-label">02 — About me</p>
          <h2>Curious by default. <em>Practical</em> by choice.</h2>
        </div>
        <p className="section__intro-copy">
          I’m building a strong foundation across software engineering and AI while learning how to turn technical ideas into experiences people can actually use.
        </p>
      </div>

      <div className="about__grid">
        <div className="about__manifesto">
          <div className="manifesto-card manifesto-card--dark">
            <span>01</span>
            <strong>Learn deeply</strong>
            <p>Understand the fundamentals behind the tools, not only the syntax around them.</p>
          </div>
          <div className="manifesto-card manifesto-card--light">
            <span>02</span>
            <strong>Build often</strong>
            <p>Turn concepts into working interfaces, applications, and experiments as quickly as possible.</p>
          </div>
          <div className="manifesto-card manifesto-card--acid">
            <span>03</span>
            <strong>Make it useful</strong>
            <p>Prefer projects that solve a real user problem over demos that only look impressive.</p>
          </div>
        </div>

        <div className="about__story">
          <p className="about__story-lead">
            I’m a CSE AI/ML student building toward a career at the intersection of software, intelligent systems, and entrepreneurship.
          </p>
          <div className="about__story-columns">
            <p>I enjoy the full loop: understanding a problem, designing the interface, writing the code, debugging the edge cases, and refining the experience.</p>
            <p>Right now I’m sharpening DSA in C++, strengthening React and backend fundamentals, and exploring computer vision, GenAI, and intelligent products.</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div><strong>05</strong><span>featured builds</span></div>
        <div><strong>03</strong><span>core languages</span></div>
        <div><strong>12+</strong><span>skills in active rotation</span></div>
        <div><strong>01</strong><span>long-term direction: agritech</span></div>
      </div>
    </section>
  );
}

