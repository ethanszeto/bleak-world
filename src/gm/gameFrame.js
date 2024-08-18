const render = (canvas, world) => {
  let canvasHeight = canvas.height;
  let canvasWidth = canvas.width;
  let ctx = canvas.getContext("2d");

  for (let x = 0; x < canvasWidth; x += 32) {
    new Box(x, 0, 1, canvasHeight, rgba(255, 255, 255, 1)).draw(ctx);
  }

  for (let y = 0; y < canvasHeight; y += 32) {
    new Box(0, y, canvasWidth, 1, rgba(255, 255, 255, 1)).draw(ctx);
  }

  for (var y = 0; y < canvasHeight; y += world.blockSize) {
    for (var x = 0; x < canvasWidth; x += world.blockSize) {
      world.getBlock(x, y).draw(ctx);
    }
  }
};
