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
    var v = this.perlin.getIntensity(x, y) < 0.5 ? 0 : 1;
    return new Box(x, y, this.blockSize, this.blockSize, rgba(0, 0, 0, v));
  };
}

// perlin.setSeed(111634516782378);
// perlin.setSeed(parseInt(Math.random() * 1000000));
