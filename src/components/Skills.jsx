import { SKILLS } from "../data/portfolio";
export function Skills() {
  return (
    <section id="skills" className="skills section">
      <div className="section__intro">
        <div>
          <p className="section-label">03 — Toolkit</p>
          <h2>Tools are useful. <em>Fundamentals</em> are better.</h2>
        </div>
        <p className="section__intro-copy">
          The stack is growing, but the goal stays the same: strong problem solving, clear systems, and the ability to learn fast.
        </p>
      </div>

      <div className="skills-board">
        {SKILLS.map((skill, index) => (
          <div key={skill.label} className="skill-tile" style={{ "--i": index }}>
            <span className="skill-tile__group">{skill.group}</span>
            <strong>{skill.label}</strong>
            <span className="skill-tile__level">{skill.level}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

