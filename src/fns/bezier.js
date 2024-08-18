// Calculate a point on a cubic Bezier curve
function bezier(t, p0, p1, p2, p3) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  let p = p0 * uuu; // (1-t)^3 * p0
  p += p1 * 3 * uu * t; // 3(1-t)^2 * t * p1
  p += p2 * 3 * u * tt; // 3(1-t) * t^2 * p2
  p += p3 * ttt; // t^3 * p3

  return p;
}
