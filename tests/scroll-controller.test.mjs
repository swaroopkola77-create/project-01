const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

function createScrollController({ viewportHeight = 1080, maxSpeed = viewportHeight * 1.2, minSpeed = 260, accelerationMs = 220, decelerationMs = 180 } = {}) {
  let direction = 0;
  let state = "idle";
  let changedAt = 0;

  const setDirection = (next, now) => {
    const normalized = next === 1 ? 1 : next === -1 ? -1 : 0;
    if (normalized === direction && ((normalized === 0) === (state === "idle"))) return;
    direction = normalized;
    changedAt = now;
    state = normalized === 0 ? "stopping" : "active";
  };

  const tick = (now, dt) => {
    const safeDt = Math.min(34, Math.max(0, Number.isFinite(dt) ? dt : 0));
    if (state === "active") {
      const elapsed = Math.max(0, now - changedAt);
      const ramp = Math.min(1, elapsed / Math.max(1, accelerationMs));
      return direction * Math.min(maxSpeed, minSpeed + (maxSpeed - minSpeed) * ramp) * safeDt / 1000;
    }
    if (state === "stopping") {
      const elapsed = Math.max(0, now - changedAt);
      const progress = Math.min(1, elapsed / Math.max(1, decelerationMs));
      if (progress >= 1) {
        state = "idle";
        direction = 0;
        return 0;
      }
      const remaining = Math.pow(1 - progress, 2);
      return direction * maxSpeed * remaining * safeDt / 1000;
    }
    return 0;
  };

  const snapshot = () => ({ direction, state });

  return { setDirection, tick, snapshot };
}

const controller = createScrollController();
controller.setDirection(1, 0);
const first = controller.tick(40, 40);
const stable = controller.tick(300, 16);
assert(first > 0, "scroll down should move positively");
assert(stable > first, "scroll should accelerate toward target");

controller.setDirection(-1, 320);
const reversed = controller.tick(336, 16);
assert(reversed < 0, "direction reversal should become upward");

controller.setDirection(0, 352);
const stopping = controller.tick(368, 16);
assert(stopping < 0, "release should decelerate without reversing");
assert(controller.tick(600, 16) === 0, "released controller should settle to zero");

for (const dt of [0, -1, NaN, Infinity, 1000]) {
  const c = createScrollController();
  c.setDirection(1, 0);
  const value = c.tick(16, dt);
  assert(Number.isFinite(value), "controller must guard invalid dt");
}

console.log("scroll controller tests: PASS");
