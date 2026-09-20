export function getInteractiveTarget(x, y) {
  const hitPoints = [
    [x, y],
    [Math.max(0, x - 10), y],
    [Math.min(window.innerWidth - 1, x + 10), y],
    [x, Math.max(0, y - 10)],
    [x, Math.min(window.innerHeight - 1, y + 10)],
  ];

  for (const [hitX, hitY] of hitPoints) {
    const element = document.elementFromPoint(hitX, hitY);
    if (!(element instanceof Element)) continue;
    const target = element.closest('a[href], button, input, label, summary, [role="button"], [tabindex]:not([tabindex="-1"])');
    if (target) return target;
  }
  return null;
}

