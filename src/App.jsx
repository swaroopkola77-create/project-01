import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";
import { HandControl } from "./features/hand-control/HandControl";
import "./App.css";

function App() {
  const [active, setActive] = useState("");
  const [handStatus, setHandStatus] = useState("OFF");
  const handCursorRef = useRef(null);
  const [quickNav, setQuickNav] = useState(false);

  useEffect(() => {
    document.title = "Swaroop Kola — AI/ML Developer Portfolio";
    const ids = ["work", "about", "skills", "contact"];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.05, 0.25, 0.5, 0.75] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setQuickNav((value) => !value);
      }
      if (event.key === "Escape") setQuickNav(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const jump = (id) => {
    setQuickNav(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header active={active} onQuickNav={() => setQuickNav(true)} />
      <main id="main">
        <div id="top"><Hero /></div>
        <Work />
        <About />
        <Skills />
        <HandControl cursorRef={handCursorRef} onStatusChange={setHandStatus} />
        <Contact />
      </main>
      {createPortal(
        <div ref={handCursorRef} className="hand-cursor" aria-hidden="true" data-visible="false">
          <span className="hand-cursor__dot" />
          <span className="hand-cursor__ring" />
          <span className="hand-cursor__label">{handStatus}</span>
        </div>,
        document.body
      )}
      {quickNav && (
        <div className="quick-nav-backdrop" role="presentation" onClick={() => setQuickNav(false)}>
          <div className="quick-nav" role="dialog" aria-modal="true" aria-labelledby="quick-nav-title" onClick={(event) => event.stopPropagation()}>
            <div className="quick-nav__header">
              <div>
                <p className="section-label">Quick navigation</p>
                <h3 id="quick-nav-title">Where do you want to go?</h3>
              </div>
              <button className="quick-nav__close" type="button" onClick={() => setQuickNav(false)} aria-label="Close quick navigation">×</button>
            </div>
            <div className="quick-nav__items">
              {[
                ["work", "Selected work", "01"],
                ["about", "About me", "02"],
                ["skills", "Toolkit", "03"],
                ["contact", "Contact", "04"],
              ].map(([id, label, number]) => (
                <button key={id} type="button" onClick={() => jump(id)}>
                  <span>{number}</span><strong>{label}</strong><b>↗</b>
                </button>
              ))}
            </div>
            <div className="quick-nav__hint"><span>ESC</span> to close <span>⌘ K</span> anytime</div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
