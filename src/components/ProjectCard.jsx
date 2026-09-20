function ProjectCard({ project, isOpen, onToggle }) {
  return (
    <article className={"project-card project-card--" + project.accent + (isOpen ? " is-open" : "")}>
      <button
        className="project-card__toggle"
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={"project-" + project.id}
      >
        <span className="project-card__number">{project.number}</span>
        <span className="project-card__main">
          <span className="project-card__category">{project.category}</span>
          <span className="project-card__title">{project.title}</span>
          <span className="project-card__summary">{project.summary}</span>
        </span>
        <span className="project-card__year">{project.year}</span>
        <span className="project-card__icon" aria-hidden="true">+</span>
      </button>

      <div className="project-card__details" id={"project-" + project.id}>
        <div className="project-card__visual">
          <div className="project-visual-grid" />
          <div className="project-visual-scan" />
          <div className="project-visual-core">
            <span>{project.number}</span>
            <strong>{project.category}</strong>
          </div>
          <div className="project-visual-chip project-visual-chip--a">{project.stack[0]}</div>
          <div className="project-visual-chip project-visual-chip--b">{project.stack[1]}</div>
          <div className="project-visual-chip project-visual-chip--c">{project.stack.at(-1)}</div>
          <span className="project-visual-status">● {project.stage.toUpperCase()}</span>
        </div>
        <div className="project-card__content">
          <div className="project-card__copy">
            <p>{project.description}</p>
            <div className="project-card__facts">
              <span><b>Role</b> Design + Build</span>
              <span><b>Track</b> {project.track}</span>
            </div>
          </div>
          <div className="project-card__stack">
            {project.stack.map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="project-card__metrics">
            {project.metrics.map((metric) => <div key={metric}><b>+</b>{metric}</div>)}
          </div>
          <a className="text-link" href="#contact">Discuss this project ↗</a>
        </div>
      </div>
    </article>
  );
}

