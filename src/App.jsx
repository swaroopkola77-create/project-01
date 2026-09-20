import { useEffect, useMemo, useRef, useState } from "react";

const PROJECTS = [
  {
    id: "tidewatch",
    title: "Tidewatch",
    what: "Flood alerts for fishing villages",
    year: "2026",
    role: "Lead design engineer",
    builtWith: "React Native, MapLibre, SQLite",
    result: "Alerts reach 14,000 households 40 minutes earlier",
    description:
      "Fishing communities along the coast get storm warnings too late and in the wrong language. Tidewatch turns forecast data into one plain alert, spoken aloud in the local language, that still works without a signal.",
    href: "#",
    art: "tidewatch",
  },
  {
    id: "quire",
    title: "Quire",
    what: "Writing software with margin comments",
    year: "2025",
    role: "Front-end lead, team of four",
    builtWith: "TypeScript, ProseMirror, Yjs",
    result: "Review rounds dropped from five to two on average",
    description:
      "Editors and authors kept leaving feedback in email. Quire puts every comment beside the sentence it's about, and keeps a full history so nothing is lost when two people edit at once.",
    href: "#",
    art: "quire",
  },
  {
    id: "marigold",
    title: "Marigold",
    what: "Seed swaps for community gardens",
    year: "2025",
    role: "Design and development",
    builtWith: "Next.js, Postgres, MapLibre",
    result: "2,300 swaps in the first growing season",
    description:
      "Gardeners already trade seeds over fences and in group chats. Marigold makes that easier to find, with listings that show what grows well nearby and a swap that takes two taps.",
    href: "#",
    art: "marigold",
  },
  {
    id: "lineup",
    title: "Lineup",
    what: "Metro delays as a living map",
    year: "2024",
    role: "Design and development",
    builtWith: "D3, WebGL, server-sent events",
    result: "Embedded by two regional newsrooms",
    description:
      "A commuter's question is simple: is my line running late right now? Lineup answers it with one moving picture instead of a table of timestamps, and refreshes every fifteen seconds.",
    href: "#",
    art: "lineup",
  },
  {
    id: "kerning",
    title: "Kerning Club",
    what: "A playground for variable fonts",
    year: "2023",
    role: "Solo project",
    builtWith: "Svelte, Canvas, CSS font variations",
    result: "Open source, 1,900 stars on GitHub",
    description:
      "Type specimens are usually static. Kerning Club lets you drag every axis of a font, pair it with another, and export the exact CSS you ended up with.",
    href: "#",
    art: "kerning",
  },
];

const C = {
  blue: "#2334D0",
  mid: "#5468F0",
  sky: "#A9B8FF",
  butter: "#FFE27A",
  cream: "#FFF3B8",
  chalk: "#F3F4FA",
  ink: "#0E1235",
  rose: "#FFC2D1",
};

const svg = (inner) =>
  `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

function makeArt(type) {
  switch (type) {
    case "tidewatch":
      return svg(`
        <rect width="400" height="300" fill="${C.butter}"/>
        <circle cx="292" cy="92" r="46" fill="${C.cream}"/>
        <path d="M0 170 C60 140 110 200 180 170 S320 140 400 170 V300 H0Z" fill="${C.sky}"/>
        <path d="M0 200 C70 172 120 230 200 200 S330 176 400 204 V300 H0Z" fill="${C.mid}"/>
        <path d="M0 236 C80 210 130 262 210 236 S340 214 400 240 V300 H0Z" fill="${C.blue}"/>
      `);
    case "quire":
      return svg(`
        <rect width="400" height="300" fill="${C.sky}"/>
        <rect x="64" y="38" width="210" height="224" rx="8" fill="${C.chalk}"/>
        <rect x="88" y="68" width="150" height="8" rx="4" fill="${C.ink}"/>
        <rect x="88" y="90" width="162" height="8" rx="4" fill="${C.ink}"/>
        <rect x="84" y="108" width="126" height="20" rx="4" fill="${C.butter}"/>
        <rect x="88" y="114" width="118" height="8" rx="4" fill="${C.ink}"/>
        <rect x="88" y="138" width="158" height="8" rx="4" fill="${C.ink}"/>
        <rect x="88" y="160" width="110" height="8" rx="4" fill="${C.ink}"/>
        <rect x="88" y="190" width="150" height="8" rx="4" fill="${C.ink}"/>
        <rect x="88" y="212" width="132" height="8" rx="4" fill="${C.ink}"/>
        <path d="M214 118 H292" stroke="${C.blue}" stroke-width="2" stroke-dasharray="4 4"/>
        <rect x="292" y="92" width="92" height="60" rx="10" fill="${C.blue}"/>
        <rect x="304" y="106" width="60" height="6" rx="3" fill="${C.chalk}"/>
        <rect x="304" y="120" width="42" height="6" rx="3" fill="${C.chalk}"/>
        <rect x="304" y="134" width="52" height="6" rx="3" fill="${C.chalk}" opacity=".6"/>
        <rect x="292" y="172" width="92" height="46" rx="10" fill="${C.butter}"/>
        <rect x="304" y="186" width="60" height="6" rx="3" fill="${C.ink}"/>
        <rect x="304" y="200" width="36" height="6" rx="3" fill="${C.ink}"/>
      `);
    case "marigold": {
      let petals = "";
      for (let i = 0; i < 14; i++) {
        petals += `<ellipse cx="0" cy="-58" rx="17" ry="52" fill="${i % 2 ? C.butter : C.cream}" transform="rotate(${(i * 360) / 14})"/>`;
      }
      return svg(`
        <rect width="400" height="300" fill="${C.ink}"/>
        <g transform="translate(200 150) scale(.95)">
          ${petals}
          <circle r="26" fill="${C.ink}"/>
          <circle r="10" fill="${C.sky}"/>
        </g>
      `);
    }
    case "lineup": {
      const lengths = [210, 280, 150, 320, 240, 180, 300, 120, 260, 200];
      const late = [1, 3, 6];
      const rows = lengths
        .map((len, i) => {
          const y = 36 + i * 26;
          return `<rect x="40" y="${y - 3}" width="${len}" height="6" rx="3" fill="${C.chalk}" opacity=".85"/><circle cx="${40 + len + 14}" cy="${y}" r="7" fill="${late.includes(i) ? C.butter : C.sky}"/>`;
        })
        .join("");
      return svg(`<rect width="400" height="300" fill="${C.blue}"/>${rows}`);
    }
    case "kerning":
      return svg(`
        <rect width="400" height="300" fill="${C.rose}"/>
        <g stroke="${C.ink}" stroke-width="1.5" opacity=".35">
          <line x1="24" y1="88" x2="376" y2="88"/>
          <line x1="24" y1="128" x2="376" y2="128"/>
          <line x1="24" y1="222" x2="376" y2="222"/>
          <line x1="24" y1="262" x2="376" y2="262"/>
        </g>
        <text x="200" y="222" text-anchor="middle" font-size="190" font-weight="800"
          font-family="'Bricolage Grotesque', Helvetica, Arial, sans-serif" fill="${C.blue}">Ag</text>
      `);
    default:
      return "";
  }
}

function Header() {
  return (
    <header className="bar on-blue">
      <a className="bar__home" href="#top">Swaroop Kola</a>
      <nav aria-label="Primary">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

function Hero() {
  const heroRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const name = nameRef.current;
    if (!hero || !name || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const BASE = 560, PEAK = 800, START = 200;
    const chars = [];

    name.querySelectorAll(".name__line").forEach((line) => {
      const text = line.textContent.trim();
      line.textContent = "";
      for (const ch of text) {
        const el = document.createElement("span");
        el.className = "char";
        el.textContent = ch === " " ? "\u00a0" : ch;
        el.style.setProperty("--w", START);
        line.append(el);
        chars.push({ el, weight: START, delay: 250 + chars.length * 90 });
      }
    });

    let pointer = null;
    let frame = null;
    let ready = false;
    let introStart = 0;

    const schedule = () => {
      if (ready && frame === null) frame = requestAnimationFrame(tick);
    };

    function tick(now) {
      frame = null;
      let animating = false;
      const rects = pointer ? chars.map((c) => c.el.getBoundingClientRect()) : null;
      const radius = Math.max(200, name.getBoundingClientRect().width * 0.32);

      chars.forEach((c, i) => {
        if (now - introStart < c.delay) { animating = true; return; }
        let target = BASE;
        if (pointer) {
          const r = rects[i];
          const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2));
          const k = Math.max(0, 1 - d / radius);
          target = BASE + (PEAK - BASE) * k * k;
        }
        const diff = target - c.weight;
        if (Math.abs(diff) > 0.4) {
          c.weight += diff * (pointer ? 0.2 : 0.07);
          animating = true;
        } else c.weight = target;
        c.el.style.setProperty("--w", c.weight.toFixed(1));
      });

      if (animating || pointer) frame = requestAnimationFrame(tick);
    }

    const onMove = (e) => { pointer = { x: e.clientX, y: e.clientY }; schedule(); };
    const onLeave = () => { pointer = null; schedule(); };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);

    Promise.resolve(document.fonts?.ready).then(() => {
      ready = true;
      introStart = performance.now();
      schedule();
    });

    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero on-blue" aria-label="Introduction">
      <h1 ref={nameRef} className="name" aria-label="Swaroop Kola">
        <span className="name__line" aria-hidden="true">Swaroop</span>
        <span className="name__line" aria-hidden="true">Kola</span>
      </h1>
      <div className="hero__foot">
        <p className="lede">
          I'm a CSE AI/ML student building thoughtful software, practical AI projects,
          and interfaces that make technical ideas easier to use.
        </p>
        <p className="status"><span className="status__dot" aria-hidden="true"></span>Open to internships and collaborative projects</p>
      </div>
    </section>
  );
}

function Project({ project, isOpen, onToggle, onHover }) {
  return (
    <li className={`project ${isOpen ? "is-open" : ""}`} data-art={project.art}>
      <h3 className="project__head">
        <button
          className="project__trigger"
          id={`t-${project.id}`}
          aria-expanded={isOpen}
          aria-controls={`p-${project.id}`}
          onClick={onToggle}
          onPointerEnter={onHover}
          onPointerMove={onHover}
          onPointerLeave={() => onHover(null)}
        >
          <span className="project__title">{project.title}</span>
          <span className="project__what">{project.what}</span>
          <span className="project__year">{project.year}</span>
          <span className="project__icon" aria-hidden="true"></span>
        </button>
      </h3>
      <div className="project__panel" id={`p-${project.id}`} role="region" aria-labelledby={`t-${project.id}`}>
        <div className="project__inner">
          <div className="project__content">
            <div className="project__art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: makeArt(project.art) }} />
            <div className="project__body">
              <p>{project.description}</p>
              <dl>
                <div><dt>Role</dt><dd>{project.role}</dd></div>
                <div><dt>Built with</dt><dd>{project.builtWith}</dd></div>
                <div><dt>Result</dt><dd>{project.result}</dd></div>
              </dl>
              <a className="link" href={project.href}>View project</a>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function Work() {
  const [openId, setOpenId] = useState(null);
  const [peek, setPeek] = useState({ project: null, x: 0, y: 0 });
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!peek.project || window.matchMedia("(hover: none), (pointer: coarse)").matches) return undefined;
    const animate = () => {
      setPeek((current) => {
        const dx = targetRef.current.x - current.x;
        const dy = targetRef.current.y - current.y;
        const next = { ...current, x: current.x + dx * 0.18, y: current.y + dy * 0.18 };
        rafRef.current = Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3 ? requestAnimationFrame(animate) : null;
        return next;
      });
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [peek.project]);

  const handleHover = (project, event) => {
    if (!event || window.matchMedia("(hover: none), (pointer: coarse)").matches || openId === project?.id) {
      setPeek((p) => ({ ...p, project: null }));
      return;
    }
    const w = Math.min(352, window.innerWidth * 0.34);
    targetRef.current = {
      x: Math.min(event.clientX + 28, window.innerWidth - w - 16),
      y: Math.max(72, Math.min(event.clientY - 112, window.innerHeight - 184)),
    };
    setPeek((current) => ({ project, x: targetRef.current.x, y: targetRef.current.y }));
  };

  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="work-title">Selected work</h2>
          <p>Five projects adapted from the supplied portfolio concept into a React-powered showcase.</p>
        </div>
        <ul className="index">
          {PROJECTS.map((project) => (
            <Project
              key={project.id}
              project={project}
              isOpen={openId === project.id}
              onToggle={() => {
                const next = openId === project.id ? null : project.id;
                setOpenId(next);
                setPeek((p) => ({ ...p, project: null }));
                if (next) {
                  window.setTimeout(() => {
                    document.getElementById(`p-${project.id}`)?.scrollIntoView({
                      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                      block: "nearest",
                    });
                  }, 520);
                }
              }}
              onHover={(event) => handleHover(project, event)}
            />
          ))}
        </ul>
      </div>
      <div
        className={`peek ${peek.project ? "is-on" : ""}`}
        aria-hidden="true"
        style={{ transform: `translate3d(${peek.x}px, ${peek.y}px, 0)` }}
        dangerouslySetInnerHTML={{ __html: peek.project ? makeArt(peek.project.art) : "" }}
      />
    </section>
  );
}

function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <h2 id="about-title">About</h2>
        <div className="about__text">
          <p className="about__lead">I'm building toward a career where software engineering, AI/ML, and product thinking meet.</p>
          <p>I like work where the details carry weight: clear interfaces, reliable systems, and projects that turn complicated technology into something useful.</p>
          <p>My current toolkit includes Python, C++, JavaScript, React, backend fundamentals, databases, DSA, and AI/ML concepts, with a strong interest in agritech, automation, and intelligent products.</p>
        </div>
      </div>
      <div className="wrap">
        <h3 className="timeline__title">Current learning path</h3>
        <ol className="timeline">
          <li><span className="timeline__years">Now</span><div><p className="timeline__role">CSE AI/ML student</p><p className="timeline__note">Building a stronger foundation across software development, data structures, AI/ML and practical projects.</p></div></li>
          <li><span className="timeline__years">Core stack</span><div><p className="timeline__role">Python · C++ · JavaScript · React</p><p className="timeline__note">Balancing problem solving with frontend and application development.</p></div></li>
          <li><span className="timeline__years">Exploring</span><div><p className="timeline__role">AI, GenAI, backend and intelligent systems</p><p className="timeline__note">Learning how modern models and production software fit together end to end.</p></div></li>
          <li><span className="timeline__years">Long term</span><div><p className="timeline__role">Agritech entrepreneur</p><p className="timeline__note">Interested in applying AI, drones, IoT and robotics to practical agricultural problems.</p></div></li>
        </ol>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState("");
  const email = "swaroopkola@example.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Copied");
    } catch {
      setStatus("Select the email and copy it manually.");
    }
    window.setTimeout(() => setStatus(""), 2200);
  };

  return (
    <section id="contact" className="contact on-blue" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 id="contact-title" className="contact__title">Have something worth building?</h2>
        <p className="contact__note">I'm open to internships, collaborations, and projects where software and AI can solve a real problem.</p>
        <p className="contact__mailrow">
          <a className="contact__mail" href={`mailto:${email}`}>{email}</a>
        </p>
        <button className={`copy ${status === "Copied" ? "is-done" : ""}`} type="button" onClick={copyEmail}>
          {status === "Copied" ? "Copied" : "Copy email"}
        </button>
        <span className="sr-only" role="status" aria-live="polite">{status}</span>
        <ul className="socials" aria-label="Elsewhere">
          <li><a href="https://github.com/swaroopkola77-create" target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a href="https://github.com/swaroopkola77-create?tab=repositories" target="_blank" rel="noreferrer">Projects</a></li>
        </ul>
      </div>
      <footer className="foot"><p>© {new Date().getFullYear()} Swaroop Kola. Built with React and Vite.</p></footer>
    </section>
  );
}

function App() {
  const navIds = useMemo(() => ["work", "about", "contact"], []);
  const [active, setActive] = useState("");

  useEffect(() => {
    const nodes = navIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [navIds]);

  useEffect(() => {
    document.title = "Swaroop Kola | CSE AI/ML Developer";
  }, []);

  return (
    <>
      <a className="skip" href="#work">Skip to selected work</a>
      <Header />
      <main id="top">
        <Hero />
        <div className={`nav-state ${active ? "has-active" : ""}`} data-active-section={active} aria-hidden="true" />
        <Work />
        <About />
        <Contact />
      </main>
    </>
  );
}

export default App;
