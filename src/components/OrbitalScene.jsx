import { useEffect, useRef } from "react";
export function OrbitalScene() {
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

