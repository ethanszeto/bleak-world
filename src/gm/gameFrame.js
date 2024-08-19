const setUpGameFrame = (canvas, world) => {
  player = new MovingBox(canvasWidth / 2, canvasHeight / 2, world.blockSize, world.blockSize * 2, rgba(255, 255, 255, 1));
  camera = new Box(canvasWidth / 2, canvasHeight / 2, world.blockSize, world.blockSize, rgba(0, 0, 0, 0.5));
  halfCanvasWidth = canvasWidth / 2;
  halfCanvasHeight = canvasHeight / 2;
  blockSizeMarginH = world.blockSize * marginH;
  blockSizeMarginV = world.blockSize * marginV;
};

function smoothstep(t) {
  return t ** 2 * (3 - 2 * t);
}

function smootherstep(t) {
  return t ** 3 * (t * (t * 6 - 15) + 10);
}

const render = (canvas, world) => {
  var now = performance.now();
  dt = (now - lastUpdate) / 15;
  framesPlayed++;
  avgDelta += now - lastUpdate;

  lastUpdate = now;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.speedX = 0;
  player.speedY = 0;

  // Calculate the extended visible range
  const visibleMinX = Math.round(player.x / world.blockSize) * world.blockSize - (halfCanvasWidth - blockSizeMarginH);
  const visibleMaxX = visibleMinX + canvasWidth + blockSizeMarginH * -2;

  const visibleMinY = Math.round(player.y / world.blockSize) * world.blockSize - (halfCanvasHeight - blockSizeMarginV);
  const visibleMaxY = visibleMinY + canvasHeight + blockSizeMarginV * -2 - world.blockSize * 3;

  for (let y = visibleMinY; y < visibleMaxY; y += world.blockSize) {
    for (let x = visibleMinX; x < visibleMaxX; x += world.blockSize) {
      let box = world.getBlock(x, y);
      if (!tempAllObjs[x]) {
        tempAllObjs[x] = {};
      }

      if (!tempAllObjs[x][y]) tempAllObjs[x][y] = box;
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

  player.speedY += gravity;

  // Horizontal movement
  if (gameSpace["a"]) {
    player.speedX = -playerSpeed;
  }
  if (gameSpace["d"]) {
    player.speedX = playerSpeed;
  }

  // Flappy Bird-like jump, only once per press
  if (!jumpState && (gameSpace[" "] || gameSpace["w"])) {
    // Space bar pressed and wasn't pressed before
    jumpState = 1;
    gravity = initialGravity;
  }

  if (jumpState && jumpState < 25) {
    player.speedY = -(jumpState > 12 ? 25 - jumpState : jumpState);

    jumpState += dt;
  } else if (jumpState && jumpState < 40) jumpState += dt;
  if (jumpState >= 40) {
    // Reset spacePressed when the space bar is released
    jumpState = 0;
  }

  // Increase gravity over timed
  if (gravity < maxGravity) gravity += gravityIncreaseRate;

  print(tempAllObjs);

  camera.update();
  camera.x = bezier(t, camera.x, camera.x + (player.x - camera.x) * 0.5, camera.x + (player.x - camera.x) * 0.5, player.x);
  camera.y = lerp(camera.y, player.y, smootherT);
  player.update();
};
