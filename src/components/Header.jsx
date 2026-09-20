function Header({ active, onQuickNav }) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Swaroop Kola home">
        <span className="brand__mark">SK</span>
        <span>Swaroop Kola</span>
      </a>
      <nav aria-label="Primary navigation">
        {[
          ["work", "Work"],
          ["about", "About"],
          ["skills", "Skills"],
          ["contact", "Contact"],
        ].map(([id, label]) => (
          <a key={id} href={"#" + id} aria-current={active === id ? "true" : undefined}>
            {label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button className="header-kbd" type="button" onClick={onQuickNav} aria-label="Open quick navigation">
          <span>⌘</span><span>K</span>
        </button>
        <a className="header-cta" href="#contact">Let's build ↗</a>
      </div>
    </header>
  );
}


