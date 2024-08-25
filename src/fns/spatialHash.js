function getSpatialHash(x, y, width, height) {
  // 16x16 blocks
  return [
    [x, y],
    [x + width, y],
    [x, y + height],
    [x + width, y + height],
  ].reduce((hashes, p) => {
    let pH = spatialHash(p[0], p[1]);
    hashes.includes(pH) || hashes.push(pH);
    return hashes;
  }, []);
}

function spatialHash(x, y) {
  return `${Math.round(x / 240) * 240}|${Math.round(y / 240) * 240}`;
}
