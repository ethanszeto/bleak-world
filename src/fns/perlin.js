class PerlinNoiseGenerator {
  constructor() {
    this.permutation = [];
    this.perm = [];
    this.seed = 0;
    this.baseScale = 1; // Default base scale
    this.variationScale = 0.1; // Scale of the variation noise
    this.variationIntensity = 0; // Intensity of the variation
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

  setScale(baseScale, variationIntensity = 0, variationScale = 0.1) {
    this.baseScale = baseScale;
    this.variationIntensity = variationIntensity;
    this.variationScale = variationScale;
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
    // Generate variation noise to modulate the scale
    const variationNoise = this.noise(x * this.variationScale, y * this.variationScale);
    const effectiveScale = this.baseScale + this.variationIntensity * variationNoise;

    // Scale the coordinates before generating noise
    x *= effectiveScale;
    y *= effectiveScale;

    // Noise value is typically in the range [-1, 1], normalize to [0, 1]
    return (this.noise(x, y) + 1) / 2;
  }
}

// class PerlinNoiseGenerator {
//   constructor() {
//     this.permutation = [];
//     this.perm = [];
//     this.seed = 0;
//     this.scale = 1; // Default scale
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

//   setScale(scale) {
//     this.scale = scale;
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
//     // Scale the coordinates before generating noise
//     x *= this.scale;
//     y *= this.scale;

//     // Noise value is typically in the range [-1, 1], normalize to [0, 1]
//     return (this.noise(x, y) + 1) / 2;
//   }
// }

// class PerlinNoiseGenerator {
//   constructor() {
//     this.permutation = [];
//     this.perm = [];
//     this.seed = 0;
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
//     // Noise value is typically in the range [-1, 1], normalize to [0, 1]
//     return (this.noise(x, y) + 1) / 2;
//   }
// }

// const perlin = {
//   rand_vect: function () {
//     let theta = Math.random() * 2 * Math.PI;
//     return { x: Math.cos(theta), y: Math.sin(theta) };
//   },
//   dot_prod_grid: function (x, y, vx, vy) {
//     let g_vect;
//     let d_vect = { x: x - vx, y: y - vy };
//     if (this.gradients[[vx, vy]]) {
//       g_vect = this.gradients[[vx, vy]];
//     } else {
//       g_vect = this.rand_vect();
//       this.gradients[[vx, vy]] = g_vect;
//     }
//     return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
//   },
//   smootherstep: function (x) {
//     return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
//   },
//   interp: function (x, a, b) {
//     return a + this.smootherstep(x) * (b - a);
//   },
//   seed: function () {
//     this.gradients = {};
//     this.memory = {};
//   },
//   get: function (x, y) {
//     if (this.memory.hasOwnProperty([x, y])) return this.memory[[x, y]];
//     let xf = Math.floor(x);
//     let yf = Math.floor(y);
//     //interpolate
//     let tl = this.dot_prod_grid(x, y, xf, yf);
//     let tr = this.dot_prod_grid(x, y, xf + 1, yf);
//     let bl = this.dot_prod_grid(x, y, xf, yf + 1);
//     let br = this.dot_prod_grid(x, y, xf + 1, yf + 1);
//     let xt = this.interp(x - xf, tl, tr);
//     let xb = this.interp(x - xf, bl, br);
//     let v = this.interp(y - yf, xt, xb);
//     this.memory[[x, y]] = v;
//     return v;
//   },
// };
