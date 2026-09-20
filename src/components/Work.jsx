function Work() {
  const [open, setOpen] = useState("ai-cell-scanner");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "AI / ML", "Frontend", "Product"];

  const filteredProjects = PROJECTS.filter((project) => (
    filter === "All" ? true : project.track === filter
  ));

  return (
    <section id="work" className="work section">
      <div className="section__intro">
        <div>
          <p className="section-label">01 — Selected work</p>
          <h2>Projects that move from <em>idea</em> to interface.</h2>
        </div>
        <div className="section__intro-side">
          <p className="section__intro-copy">
            A mix of learning projects, product experiments, and future-facing concepts. Some are exploratory — the goal is to show how I think, build, and communicate.
          </p>
          <div className="work-filter" role="tablist" aria-label="Filter projects">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={filter === item}
                className={"filter-chip" + (filter === item ? " is-active" : "")}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="project-list">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isOpen={open === project.id}
            onToggle={() => setOpen(open === project.id ? null : project.id)}
          />
        ))}
      </div>

      <div className="work-footer">
        <span>{filteredProjects.length.toString().padStart(2, "0")} projects in view</span>
        <span>Click a row to inspect the build</span>
      </div>
    </section>
  );
}

