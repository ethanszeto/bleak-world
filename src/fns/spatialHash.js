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
  return `${Math.round(x / 256) * 256}|${Math.round(y / 256) * 256}`;
}

function getSpatialHashCircle(x, y, radius) {
  return getSpatialHash(x - radius, y - radius, radius * 2, radius * 2);
}
