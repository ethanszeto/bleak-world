const canvas = document.getElementById("canvas");

const draw = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(`[w: ${canvas.width}, h: ${canvas.height}]`);

  const ctx = canvas.getContext("2d");

  //   for (let x = 0; x < canvas.width; x += 30) {
  //     new Box(x, 0, 1, canvas.height, rgba(255, 255, 255, 1)).draw(ctx);
  //   }

  //   for (let y = 0; y < canvas.height; y += 30) {
  //     new Box(0, y, canvas.width, 1, rgba(255, 255, 255, 1)).draw(ctx);
  //   }
  const perlin = new PerlinNoiseGenerator();
  perlin.setSeed(12835618);
  perlin.setScale(0.001, 0.005, 0.005);

  const discrete = true;

  for (var y = 0; y < canvas.height; y += 5) {
    for (var x = 0; x < canvas.width; x += 5) {
      if (discrete) {
        var v = perlin.getIntensity(x + 0.5, y + 0.5) < 0.5 ? 0 : 1;
        console.log(x, y, v);
        new Box(x, y, 10, 10, rgba(255, 255, 255, v)).draw(ctx);
      } else {
        var v = perlin.getIntensity(x + 0.5, y + 0.5) * 255;
        console.log(x, y, v);
        new Box(x, y, 10, 10, rgba(v, v, v, v / 255)).draw(ctx);
      }
    }
  }

  //   for (var y = 0; y < canvas.height; y += 30) {
  //     for (var x = 0; x < canvas.width; x += 30) {
  //       var v = parseInt(Math.random() * 255);
  //       new Box(Math.floor(x), Math.floor(y), 30, 30, rgba(v, v, v, 1)).draw(ctx);
  //     }
  //   }

  //   const circle1 = new Circle(500, 500, 100, rgba(255, 0, 0, 1));
  //   const circle2 = new Circle(300, 300, 75, rgba(0, 255, 1, 1));

  //   console.log(circle1.collidesWith(circle2));

  //   const box1 = new Box(100, 100, 60, 60, "green");
  //   const box2 = new Box(200, 200, 80, 80, "yellow");

  //   console.log(box2.collidesWith(circle2));

  //   circle1.draw(ctx);
  //   circle2.draw(ctx);

  //   box1.draw(ctx);
  //   box2.draw(ctx);
};

window.addEventListener("load", draw);
window.addEventListener("resize", draw);
