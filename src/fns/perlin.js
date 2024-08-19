// /**
//  * Good defalts
//  */
class PerlinNoiseGenerator {
  constructor() {
    this.permutation = Array.from({ length: 256 }, (_, i) => i);
    this.perm = [];
    this.seed = 0;
    this.baseScale = 0.002;
    this.variationScale = 0.003;
    this.variationIntensity = 0.003;
    this.threshold = 0.4; // Threshold for larger caves
    this.smallCaveThreshold = 0.01; // Threshold for smaller caves
    this.tunnelEffect = 0.5; // Strength of tunneling effect
    this.smallCaveScale = 0.0015; // Scale factor for smaller caves
    this.setSeed(Math.random());
  }

  setSeed(seed) {
    this.seed = seed;
    this.permutation = [];

    // Create a permutation table
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }

    // Shuffle the permutation table based on the seed
    for (let i = 255; i > 0; i--) {
      const rand = Math.floor((this.seed * 1000) % (i + 1));
      [this.permutation[i], this.permutation[rand]] = [this.permutation[rand], this.permutation[i]];
    }

    // Double the permutation table to avoid overflow
    this.perm = this.permutation.concat(this.permutation);
  }

  setScale(baseScale = 1, variationIntensity = 3, variationScale = 3) {
    this.baseScale = baseScale / 1000;
    this.variationIntensity = variationIntensity / 1000;
    this.variationScale = variationScale / 10000;
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t, a, b) {
    return a + t * (b - a);
  }

  grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return (h & 1 ? -u : u) + (h & 2 ? -v : v);
  }

  noise(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);

    const u = this.fade(x);
    const v = this.fade(y);

    const aa = this.perm[X] + Y;
    const ab = this.perm[X] + Y + 1;
    const ba = this.perm[X + 1] + Y;
    const bb = this.perm[X + 1] + Y + 1;

    const gradAA = this.grad(this.perm[aa], x, y);
    const gradBA = this.grad(this.perm[ba], x - 1, y);
    const gradAB = this.grad(this.perm[ab], x, y - 1);
    const gradBB = this.grad(this.perm[bb], x - 1, y - 1);

    const lerpX1 = this.lerp(u, gradAA, gradBA);
    const lerpX2 = this.lerp(u, gradAB, gradBB);

    return this.lerp(v, lerpX1, lerpX2);
  }

  getIntensity(x, y) {
    // Avoid scaling based on effective scale
    const scaledX = x * this.baseScale;
    const scaledY = y * this.baseScale;

    // Create a tunneling effect by blending multiple noise values
    const noise1 = this.noise(scaledX, scaledY);
    const noise2 = this.noise(scaledX + this.tunnelEffect, scaledY);
    const noise3 = this.noise(scaledX, scaledY + this.tunnelEffect);
    const intensity = (noise1 + noise2 + noise3 + 3) / 6; // Average the results

    // Smaller cave noise with a higher scale
    const smallCaveNoise = this.noise(x * this.smallCaveScale, y * this.smallCaveScale);

    // Apply thresholding for caves
    if (intensity < this.threshold || smallCaveNoise < this.smallCaveThreshold) {
      return 0; // Cave (empty space)
    } else {
      return 1; // Solid rock
    }
  }
}

/**
 * Original
 */
// class PerlinNoiseGenerator {
//   constructor() {
//     this.permutation = Array.from({ length: 256 }, (_, i) => i);
//     this.perm = [];
//     this.seed = 0;
//     this.baseScale = 1;
//     this.variationScale = 0.1;
//     this.variationIntensity = 0;
//     this.setSeed(Math.random());
//   }

//   setSeed(seed) {
//     this.seed = seed;
//     this.permutation = [];

//     // Create a permutation table
//     for (let i = 0; i < 256; i++) {
//       this.permutation[i] = i;
//     }

//     // Shuffle the permutation table based on the seed
//     for (let i = 255; i > 0; i--) {
//       const rand = Math.floor((this.seed * 1000) % (i + 1));
//       [this.permutation[i], this.permutation[rand]] = [this.permutation[rand], this.permutation[i]];
//     }

//     // Double the permutation table to avoid overflow
//     this.perm = this.permutation.concat(this.permutation);
//   }

//   setScale(baseScale = 1, variationIntensity = 3, variationScale = 3) {
//     this.baseScale = baseScale / 1000;
//     this.variationIntensity = variationIntensity / 1000;
//     this.variationScale = variationScale / 10000;
//   }

//   fade(t) {
//     return t * t * t * (t * (t * 6 - 15) + 10);
//   }

//   lerp(t, a, b) {
//     return a + t * (b - a);
//   }

//   grad(hash, x, y) {
//     const h = hash & 3;
//     const u = h < 2 ? x : y;
//     const v = h < 2 ? y : x;
//     return (h & 1 ? -u : u) + (h & 2 ? -v : v);
//   }

//   noise(x, y) {
//     const X = Math.floor(x) & 255;
//     const Y = Math.floor(y) & 255;
//     x -= Math.floor(x);
//     y -= Math.floor(y);

//     const u = this.fade(x);
//     const v = this.fade(y);

//     const aa = this.perm[X] + Y;
//     const ab = this.perm[X] + Y + 1;
//     const ba = this.perm[X + 1] + Y;
//     const bb = this.perm[X + 1] + Y + 1;

//     const gradAA = this.grad(this.perm[aa], x, y);
//     const gradBA = this.grad(this.perm[ba], x - 1, y);
//     const gradAB = this.grad(this.perm[ab], x, y - 1);
//     const gradBB = this.grad(this.perm[bb], x - 1, y - 1);

//     const lerpX1 = this.lerp(u, gradAA, gradBA);
//     const lerpX2 = this.lerp(u, gradAB, gradBB);

//     return this.lerp(v, lerpX1, lerpX2);
//   }

//   getIntensity(x, y) {
//     const variationNoise = this.noise(x * this.variationScale, y * this.variationScale);
//     const effectiveScale = this.baseScale + this.variationIntensity * variationNoise;

//     x *= effectiveScale;
//     y *= effectiveScale;

//     return (this.noise(x, y) + 1) / 2;
//   }
// }
