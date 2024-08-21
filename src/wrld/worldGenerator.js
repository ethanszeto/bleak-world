class WorldGenerator {
  generate = (seed) => {
    this.zoom = 2;
    this.blockSize = 32 / this.zoom;
    this.blockCache = [[]];
    this.perlin = new PerlinNoiseGenerator();
    this.perlin.setSeed(seed);
    //this.perlin.setScale(1, 5, this.zoom);
  };

  getBlock = (x, y) => {
    var v = this.perlin.getIntensity(x, y);
    return new Box(x, y, this.blockSize, this.blockSize, rgba(0, 0, 0, v));
  };

  getBlockAirNull = (x, y) => {
    var v = this.perlin.getIntensity(x, y);
    return v ? new Box(x, y, this.blockSize, this.blockSize, rgba(0, 0, 0, v)) : null;
  };

  getRowToRender = (minX, maxX, y) => {
    let blocks = [];
    let tempBlockSpecs = null;
    for (let x = minX; x < maxX; x += this.blockSize) {
      let v = this.perlin.getIntensity(x, y);
      if (v === 0) {
        if (tempBlockSpecs) {
          blocks.push(tempBlockSpecs);
          tempBlockSpecs = null;
        }
      } else {
        if (tempBlockSpecs) {
          tempBlockSpecs.width += this.blockSize;
        } else {
          tempBlockSpecs = new Box(x, y, this.blockSize, this.blockSize, rgba(0, 0, 0, v));
        }
      }
    }
    if (tempBlockSpecs) blocks.push(tempBlockSpecs);
    //console.log(blocks);
    return blocks;
  };
}
