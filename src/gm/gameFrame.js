const setUpGameFrame = (canvas, world) => {
  player = new Box(canvasWidth / 2, canvasHeight / 2, world.blockSize, world.blockSize * 2, rgba(255, 255, 255, 1));
  antiPlayer = new Box(canvasWidth / 2, canvasHeight / 2, world.blockSize, world.blockSize, rgba(0, 0, 0, 0.5));
};

const render = (canvas, world) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.speedX = 0;
  player.speedY = 0;
  antiPlayer.speedX = 0;
  antiPlayer.speedY = 0;

  // for (let x = 0; x < canvasWidth; x += 32) {
  //   let box = new Box(x, 0, 1, canvasHeight, rgba(255, 255, 255, 1));
  //   tempAllObjs.push(box);
  // }

  // for (let y = 0; y < canvasHeight; y += 32) {
  //   let box = new Box(0, y, canvasWidth, 1, rgba(255, 255, 255, 1));
  //   tempAllObjs.push(box);
  // }

  // for (var y = Math.round(player.y / world.blockSize) * world.blockSize - canvasHeight; y < canvasHeight; y += world.blockSize) {
  //   for (var x = Math.round(player.x / world.blockSize) * world.blockSize - canvasWidth; x < canvasWidth; x += world.blockSize) {
  //     let box = world.getBlock(x, y);
  //     if (!tempAllObjs[x]) {
  //       tempAllObjs[x] = {};
  //     }
  //     if (!tempAllObjs[x][y]) tempAllObjs[x][y] = box;
  //   }
  // }

  // Calculate the visible range
  const margin = world.blockSize * 2; // Adjust this value as needed

  // Calculate the extended visible range
  const visibleMinX = Math.round(player.x / world.blockSize) * world.blockSize - canvasWidth / 2 - margin;
  const visibleMaxX = visibleMinX + canvasWidth + margin * 2;
  const visibleMinY = Math.round(player.y / world.blockSize) * world.blockSize - canvasHeight / 2 - margin;
  const visibleMaxY = visibleMinY + canvasHeight + margin * 2;

  // Cache the blocks within the visible range
  for (let y = visibleMinY; y < visibleMaxY; y += world.blockSize) {
    for (let x = visibleMinX; x < visibleMaxX; x += world.blockSize) {
      let box = world.getBlock(x, y);
      if (!tempAllObjs[x]) {
        tempAllObjs[x] = {};
      }

      tempAllObjs[x][y] = box;
    }
  }

  // Remove blocks outside the visible range
  for (let x in tempAllObjs) {
    if (x < visibleMinX || x >= visibleMaxX) {
      delete tempAllObjs[x]; // Remove entire column if out of range
    } else {
      for (let y in tempAllObjs[x]) {
        if (y < visibleMinY || y >= visibleMaxY) {
          delete tempAllObjs[x][y]; // Remove individual block if out of range
        }
      }
      // Optionally, delete the x key if the column is empty
      if (Object.keys(tempAllObjs[x]).length === 0) {
        delete tempAllObjs[x];
      }
    }
  }

  if (gameSpace["a"]) {
    player.speedX = -playerSpeed;
    antiPlayer.speedX = playerSpeed;
  }
  if (gameSpace["d"]) {
    player.speedX = playerSpeed;
    antiPlayer.speedX = -playerSpeed;
  }
  if (gameSpace["w"]) {
    player.speedY = -playerSpeed;
    antiPlayer.speedY = playerSpeed;
  }
  if (gameSpace["s"]) {
    player.speedY = playerSpeed;
    antiPlayer.speedY = -playerSpeed;
  }

  print(tempAllObjs);

  antiPlayer.update();
  antiPlayer.newPos();
  player.update();
  player.newPos();

  player.draw();
  antiPlayer.draw();
};
