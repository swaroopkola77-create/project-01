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

function rootClickPulse() {
  document.documentElement.style.setProperty("--hand-cursor-pulse", "1");
  window.setTimeout(() => {
    document.documentElement.style.setProperty("--hand-cursor-pulse", "0");
  }, 180);
}

function distance2d(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
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

function fingerExtended(lm, tip, pip, mcp) {
  const wrist = lm[0];
  return (
    distance2d(wrist, lm[tip]) > distance2d(wrist, lm[pip]) * 1.06 &&
    angleAt(lm[tip], lm[pip], lm[mcp]) > 140
  );
}

function classifyGesture(lm) {
  const index = fingerExtended(lm, 8, 6, 5);
  const middle = fingerExtended(lm, 12, 10, 9);
  const ring = fingerExtended(lm, 16, 14, 13);
  const pinky = fingerExtended(lm, 20, 18, 17);

  const pinchRatio = distance2d(lm[4], lm[8]) / Math.max(distance2d(lm[0], lm[5]), 0.04);
  const openPalm = index && middle && ring && pinky;
  const fist = !index && !middle && !ring && !pinky;

  if (index && pinchRatio < 0.62) return "click";
  if (index && middle && !ring && !pinky) return "scroll";
  if (openPalm || fist) return "pause";
  if (index && !middle && !ring && !pinky) return "pointer";
  return "neutral";
}

function HandControl({ onStatusChange }) {
  const videoRef = useRef(null);
  const detectorRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const activeRef = useRef(false);
  const clickLockRef = useRef(false);
  const gestureRef = useRef({ candidate: "neutral", stable: "neutral", frames: 0 });
  const smoothRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef({ y: null, time: 0 });
  const lastStatusRef = useRef("off");

  const [enabled, setEnabled] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [status, setStatus] = useState("off");
  const [error, setError] = useState("");

  const setStatusSafe = (value) => {
    if (lastStatusRef.current === value) return;
    lastStatusRef.current = value;
    setStatus(value);
    onStatusChange?.(value);
  };

  const setCursor = (x, y, mode) => {
    document.documentElement.style.setProperty("--hand-x", x + "px");
    document.documentElement.style.setProperty("--hand-y", y + "px");
    document.documentElement.style.setProperty("--hand-cursor-opacity", "1");
    document.documentElement.style.setProperty("--hand-cursor-scale", mode === "scroll" ? "1.16" : "1");
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

  const stabilizeGesture = (next) => {
    const state = gestureRef.current;
    if (state.candidate === next) state.frames += 1;
    else {
      state.candidate = next;
      state.frames = 1;
    }

    if (state.frames >= 2) state.stable = next;
    return state.stable;
  };

  const clickAt = (x, y) => {
    if (clickLockRef.current) return;
    const element = document.elementFromPoint(x, y);
    if (!(element instanceof HTMLElement)) return;

    element.click();
    rootClickPulse();
    clickLockRef.current = true;
    window.setTimeout(() => { clickLockRef.current = false; }, 450);
  };

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
      scrollRef.current.y = null;
      setStatusSafe("searching");
      clearCursor();
      frameRef.current = requestAnimationFrame(detectFrame);
      return;
    }

    const gesture = stabilizeGesture(classifyGesture(hand));
    const tip = hand[8];

    const targetX = 1 - tip.x;
    const targetY = tip.y;
    const dx = targetX - smoothRef.current.x;
    const dy = targetY - smoothRef.current.y;
    const distance = Math.hypot(dx, dy);
    const smoothing = Math.min(0.48, 0.22 + distance * 2.2);

    smoothRef.current.x += dx * smoothing;
    smoothRef.current.y += dy * smoothing;

    const x = Math.max(8, Math.min(window.innerWidth - 8, smoothRef.current.x * window.innerWidth));
    const y = Math.max(8, Math.min(window.innerHeight - 8, smoothRef.current.y * window.innerHeight));

    setCursor(x, y, gesture === "scroll" ? "scroll" : "pointer");

    if (gesture === "click") {
      scrollRef.current.y = null;
      setStatusSafe("click");
      clickAt(x, y);
    } else if (gesture === "scroll") {
      const now = performance.now();
      if (scrollRef.current.y !== null) {
        const dt = Math.max(16, now - scrollRef.current.time);
        const velocity = (y - scrollRef.current.y) / dt;
        const delta = velocity * 1100;
        if (Math.abs(delta) > 0.35) window.scrollBy({ top: delta, behavior: "auto" });
      }
      scrollRef.current = { y, time: now };
      setStatusSafe("scroll");
    } else if (gesture === "pointer") {
      scrollRef.current.y = null;
      setStatusSafe("pointer");
    } else if (gesture === "pause") {
      scrollRef.current.y = null;
      setStatusSafe("pause");
    } else {
      scrollRef.current.y = null;
      setStatusSafe("tracking");
    }

    frameRef.current = requestAnimationFrame(detectFrame);
  };

  const start = async () => {
    setError("");
    setStatusSafe("starting");

    try {
      const mediapipe = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/+esm");
      const fileset = await mediapipe.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm"
      );

      detectorRef.current = await mediapipe.HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
          frameRate: { ideal: 30, max: 60 },
        },
        audio: false,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      await videoRef.current.play();

      gestureRef.current = { candidate: "neutral", stable: "neutral", frames: 0 };
      smoothRef.current = { x: 0.5, y: 0.5 };
      scrollRef.current = { y: null, time: 0 };
      setEnabled(true);
      setStatusSafe("searching");
      frameRef.current = requestAnimationFrame(detectFrame);
    } catch (err) {
      setEnabled(false);
      setStatusSafe("error");
      setError(
        err?.name === "NotAllowedError"
          ? "Camera permission was denied. Allow camera access and try again."
          : "Hand tracking could not start on this browser."
      );
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
    tracking: "Tracking",
    pointer: "Pointer",
    click: "Click",
    scroll: "Scroll",
    pause: "Paused",
    error: "Unavailable",
  };

  return (
    <section id="air-control" className={"hand-control " + (enabled ? "is-active" : "")}>
      <video ref={videoRef} className={"hand-control__video " + (cameraVisible ? "is-visible" : "")} playsInline muted aria-label="Camera preview for hand control" />
      <div className="hand-control__header">
        <div>
          <p className="section-label">05 — Air control</p>
          <h2>Navigate with your hands.</h2>
          <p className="hand-control__copy">☝ Point · 🤏 Pinch = click · ✌ Two fingers = scroll · 🖐 Open/closed = pause.</p>
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
        <span className="hand-control__hint">Recognition is smoothed for quick, deliberate gestures.</span>
      </div>
      <div className="hand-control__gestures">
        <span>☝ Pointer</span>
        <span>🤏 Click</span>
        <span>✌ Scroll</span>
        <span>🖐 Pause</span>
      </div>
      {error && <p className="hand-control__error" role="alert">{error}</p>}
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
