import { useEffect, useRef, useState } from "react";

const PROJECTS = [
  {
    id: "ai-cell-scanner",
    number: "01",
    title: "AI Cell Scanner",
    category: "Computer Vision",
    year: "2026",
    summary: "A portfolio-grade microscopy concept for classifying cells from high-resolution images.",
    description:
      "A visual workflow for uploading microscopy images, exploring regions of interest, reviewing model predictions, and surfacing confidence without hiding the underlying image.",
    stack: ["Python", "OpenCV", "React", "ML"],
    metrics: ["Image upload", "Region explorer", "Confidence UI"],
    accent: "cyan",
    track: "AI / ML",
    stage: "Concept",
  },
  {
    id: "smart-agri",
    number: "02",
    title: "Smart Agri Console",
    category: "AI + IoT",
    year: "2026",
    summary: "A dashboard concept connecting crop signals, sensors, and actionable field insights.",
    description:
      "A product concept for precision agriculture where weather, soil, crop health, and field events come together in one decision surface.",
    stack: ["React", "Python", "IoT", "Data"],
    metrics: ["Field health", "Sensor feed", "Action queue"],
    accent: "lime",
    track: "AI / ML",
    stage: "Concept",
  },
  {
    id: "quiz-lab",
    number: "03",
    title: "Quiz Lab",
    category: "Web Application",
    year: "2025",
    summary: "An interactive quiz experience built to practice React state, lists, and reusable UI.",
    description:
      "A focused front-end project that combines question flows, score states, progress feedback, and responsive components into a clean learning experience.",
    stack: ["React", "JavaScript", "CSS"],
    metrics: ["Dynamic state", "Responsive UI", "Reusable components"],
    accent: "violet",
    track: "Frontend",
    stage: "Built",
  },
  {
    id: "job-board",
    number: "04",
    title: "Job Board",
    category: "Product UI",
    year: "2025",
    summary: "A searchable job discovery interface designed around clarity and fast scanning.",
    description:
      "A product-style interface exploring search, filtering, job cards, saved states, and information hierarchy for a practical recruitment workflow.",
    stack: ["React", "JavaScript", "CSS"],
    metrics: ["Search", "Filters", "Card system"],
    accent: "orange",
    track: "Product",
    stage: "Built",
  },
  {
    id: "ecommerce-ui",
    number: "05",
    title: "E-commerce UI",
    category: "Frontend",
    year: "2025",
    summary: "A responsive storefront interface built to strengthen component and layout skills.",
    description:
      "A frontend build focused on product grids, responsive navigation, reusable components, and a visual hierarchy that keeps browsing friction low.",
    stack: ["React", "Tailwind CSS", "JavaScript"],
    metrics: ["Responsive grid", "Reusable UI", "Mobile-first"],
    accent: "pink",
    track: "Frontend",
    stage: "Built",
  },
];

const SKILLS = [
  { label: "Python", group: "Languages", level: "Core" },
  { label: "C++", group: "Languages", level: "Core" },
  { label: "JavaScript", group: "Languages", level: "Core" },
  { label: "React", group: "Frontend", level: "Core" },
  { label: "HTML / CSS", group: "Frontend", level: "Core" },
  { label: "Tailwind CSS", group: "Frontend", level: "Working" },
  { label: "Node.js", group: "Backend", level: "Learning" },
  { label: "SQL / DBMS", group: "Data", level: "Learning" },
  { label: "Git / GitHub", group: "Tools", level: "Core" },
  { label: "OpenCV", group: "AI / ML", level: "Exploring" },
  { label: "GenAI", group: "AI / ML", level: "Exploring" },
  { label: "DSA", group: "Problem Solving", level: "Core" },
];


function rootClickPulse() {
  document.documentElement.style.setProperty("--hand-cursor-pulse", "1");
  window.setTimeout(() => {
    document.documentElement.style.setProperty("--hand-cursor-pulse", "0");
  }, 180);
}

const HAND_LANDMARKER_MODULE_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/+esm";
const HAND_LANDMARKER_WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm";
const HAND_LANDMARKER_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

function distance2d(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function fingerExtended(lm, tip, pip, mcp) {
  const wrist = lm[0];
  return distance2d(wrist, lm[tip]) > distance2d(wrist, lm[pip]) * 1.12 &&
    angleAt(lm[tip], lm[pip], lm[mcp]) > 145;
}

function angleAt(a, b, c) {
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const dot = abx * cbx + aby * cby;
  const mag = Math.hypot(abx, aby) * Math.hypot(cbx, cby);
  if (!mag) return 0;
  return Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180 / Math.PI;
}

function detectHandMode(lm) {
  const index = fingerExtended(lm, 8, 6, 5);
  const middle = fingerExtended(lm, 12, 10, 9);
  const ring = fingerExtended(lm, 16, 14, 13);
  const pinky = fingerExtended(lm, 20, 18, 17);
  if (index && middle && !ring && !pinky) return "scroll";
  if (index && !middle && !ring && !pinky) return "pointer";
  return "idle";
}

function HandControl({ onStatusChange }) {
  const videoRef = useRef(null);
  const detectorRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const clickLockRef = useRef(false);
  const activeRef = useRef(false);
  const smoothRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(null);

  const [enabled, setEnabled] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [status, setStatus] = useState("off");
  const [error, setError] = useState("");

  const setStatusSafe = (value) => {
    setStatus(value);
    onStatusChange?.(value);
  };

  const setCursor = (x, y, mode) => {
    document.documentElement.style.setProperty("--hand-x", x + "px");
    document.documentElement.style.setProperty("--hand-y", y + "px");
    document.documentElement.style.setProperty("--hand-cursor-opacity", "1");
    document.documentElement.style.setProperty("--hand-cursor-scale", mode === "scroll" ? "1.15" : "1");
  };

  const clearCursor = () => {
    document.documentElement.style.setProperty("--hand-cursor-opacity", "0");
  };

  useEffect(() => {
    activeRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      detectorRef.current?.close?.();
      clearCursor();
    };
  }, []);

  const detectFrame = () => {
    const video = videoRef.current;
    const detector = detectorRef.current;

    if (!activeRef.current || !video || !detector || video.readyState < 2) {
      if (activeRef.current) frameRef.current = requestAnimationFrame(detectFrame);
      return;
    }

    const result = detector.detectForVideo(video, performance.now());
    const hand = result?.landmarks?.[0];

    if (!hand) {
      scrollRef.current = null;
      setStatusSafe("searching");
      clearCursor();
      frameRef.current = requestAnimationFrame(detectFrame);
      return;
    }

    const mode = detectHandMode(hand);
    const tip = hand[8];
    const targetX = 1 - tip.x;
    const targetY = tip.y;
    const factor = mode === "scroll" ? 0.18 : 0.26;

    smoothRef.current.x += (targetX - smoothRef.current.x) * factor;
    smoothRef.current.y += (targetY - smoothRef.current.y) * factor;

    const x = Math.max(10, Math.min(window.innerWidth - 10, smoothRef.current.x * window.innerWidth));
    const y = Math.max(10, Math.min(window.innerHeight - 10, smoothRef.current.y * window.innerHeight));

    setCursor(x, y, mode);

    if (mode === "pointer") {
      const pinch = distance2d(hand[4], hand[8]) / Math.max(distance2d(hand[0], hand[5]), 0.05);

      if (pinch < 0.55 && !clickLockRef.current) {
        const target = document.elementFromPoint(x, y);
        if (target instanceof HTMLElement) {
          target.click();
          rootClickPulse();
        }
        clickLockRef.current = true;
        window.setTimeout(() => { clickLockRef.current = false; }, 650);
      }

      scrollRef.current = null;
      setStatusSafe("pointer");
    } else if (mode === "scroll") {
      if (scrollRef.current !== null) {
        const delta = (y - scrollRef.current) * 5.5;
        if (Math.abs(delta) > 0.2) window.scrollBy({ top: delta, behavior: "auto" });
      }
      scrollRef.current = y;
      setStatusSafe("scroll");
    } else {
      scrollRef.current = null;
      setStatusSafe("tracking");
    }

    frameRef.current = requestAnimationFrame(detectFrame);
  };

  const start = async () => {
    setError("");
    setStatusSafe("starting");

    try {
      const mediapipe = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/+esm");
      const fileset = await mediapipe.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm");

      detectorRef.current = await mediapipe.HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.62,
        minHandPresenceConfidence: 0.58,
        minTrackingConfidence: 0.58,
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      await videoRef.current.play();

      setEnabled(true);
      setStatusSafe("searching");
      frameRef.current = requestAnimationFrame(detectFrame);
    } catch (err) {
      setEnabled(false);
      setStatusSafe("error");
      setError(err?.name === "NotAllowedError"
        ? "Camera permission was denied. Allow camera access and try again."
        : "Hand tracking could not start on this browser.");
      detectorRef.current?.close?.();
      detectorRef.current = null;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      clearCursor();
    }
  };

  const stop = () => {
    activeRef.current = false;
    setEnabled(false);
    setStatusSafe("off");
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    detectorRef.current?.close?.();
    detectorRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    clearCursor();
  };

  const labels = {
    off: "Off",
    starting: "Starting",
    searching: "Find your hand",
    tracking: "Hand detected",
    pointer: "Pointer mode",
    scroll: "Scroll mode",
    error: "Unavailable",
  };

  return (
    <section id="air-control" className={"hand-control " + (enabled ? "is-active" : "")}>
      <video
        ref={videoRef}
        className={"hand-control__video " + (cameraVisible ? "is-visible" : "")}
        playsInline
        muted
        aria-label="Camera preview for hand control"
      />
      <div className="hand-control__header">
        <div>
          <p className="section-label">05 — Air control</p>
          <h2>Navigate with your hands.</h2>
          <p className="hand-control__copy">Index = pointer · pinch = click · index + middle = scroll.</p>
        </div>
        <div className="hand-control__actions">
          <button className={"button " + (enabled ? "button--light" : "button--primary")} type="button" onClick={enabled ? stop : start}>
            {enabled ? "Turn off" : "Enable camera"}
          </button>
          {enabled && (
            <label className="camera-toggle">
              <input type="checkbox" checked={cameraVisible} onChange={(event) => setCameraVisible(event.target.checked)} />
              <span>Show camera</span>
            </label>
          )}
        </div>
      </div>
      <div className="hand-control__statusbar">
        <span className={"hand-control__status hand-control__status--" + status}><i /> {labels[status] || "Ready"}</span>
        <span className="hand-control__hint">Processing stays in your browser.</span>
      </div>
      {error && <p className="hand-control__error" role="alert">{error}</p>}
    </section>
  );
}

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

function OrbitalScene() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = null;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };

    const render = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      scene.style.setProperty("--px", current.x.toFixed(3));
      scene.style.setProperty("--py", current.y.toFixed(3));
      frame = Math.abs(target.x - current.x) > 0.002 || Math.abs(target.y - current.y) > 0.002
        ? requestAnimationFrame(render)
        : null;
    };

    const move = (event) => {
      const rect = scene.getBoundingClientRect();
      target = {
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      };
      if (!frame) frame = requestAnimationFrame(render);
    };

    const leave = () => {
      target = { x: 0, y: 0 };
      if (!frame) frame = requestAnimationFrame(render);
    };

    scene.addEventListener("pointermove", move);
    scene.addEventListener("pointerleave", leave);

    return () => {
      scene.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerleave", leave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={sceneRef} className="orbital-scene" aria-hidden="true">
      <div className="orbital-scene__halo" />
      <div className="orbital-scene__ring orbital-scene__ring--one" />
      <div className="orbital-scene__ring orbital-scene__ring--two" />
      <div className="orbital-scene__ring orbital-scene__ring--three" />
      <div className="orbital-scene__core">
        <div className="orbital-scene__core-face">AI</div>
      </div>
      <span className="orbit-dot orbit-dot--one" />
      <span className="orbit-dot orbit-dot--two" />
      <span className="orbit-dot orbit-dot--three" />
    </div>
  );
}

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

function About() {
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

function Skills() {
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

function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "swaroopkola@example.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="contact section">
      <div className="contact__orb contact__orb--one" />
      <div className="contact__orb contact__orb--two" />
      <div className="contact__content">
        <div className="contact__topline">
          <p className="section-label">04 — Contact</p>
          <span className="availability"><i /> Available for internships & collaborations</span>
        </div>
        <h2>Let’s build something that <em>matters.</em></h2>
        <p className="contact__lead">
          Open to internships, collaborations, hackathons, and thoughtful projects involving software or AI.
        </p>
        <div className="contact__actions">
          <a className="contact-email" href={"mailto:" + email}>{email}</a>
          <button className={"button button--light" + (copied ? " is-copied" : "")} type="button" onClick={copyEmail}>
            {copied ? "Email copied ✓" : "Copy email"}
          </button>
        </div>
        <div className="contact__links">
          <a href="https://github.com/swaroopkola77-create" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href="#work">Selected work ↓</a>
        </div>
      </div>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Swaroop Kola</span>
        <span>CSE AI/ML · React · Python · C++</span>
        <span>Built with curiosity + code</span>
      </footer>
    </section>
  );
}

function App() {
  const [active, setActive] = useState("");
  const [handStatus, setHandStatus] = useState("off");
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
        <HandControl onStatusChange={setHandStatus} />
        <Contact />
      </main>
      <div className={"hand-cursor " + (handStatus !== "off" && handStatus !== "error" ? "is-visible" : "")} aria-hidden="true">
        <span className="hand-cursor__dot" />
        <span className="hand-cursor__ring" />
        <span className="hand-cursor__label">{handStatus === "scroll" ? "SCROLL" : "POINT"}</span>
      </div>
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
