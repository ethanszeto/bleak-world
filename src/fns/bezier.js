// Calculate a point on a cubic Bezier curve
function bezier(t, p0, p1, p2, p3) {
  return p0 * (1 - t) ** 3 + p1 * 3 * (1 - t) ** 2 * t + p2 * 3 * (1 - t) * t ** 2 + p3 * t ** 3;
}
