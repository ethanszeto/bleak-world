const setUpGameFrame = (canvas, world) => {
  player = new Player(canvasWidth / 2, canvasHeight / 2, world.blockSize, world.blockSize * 2, rgba(255, 255, 255, 1));
  camera = new Camera(canvasWidth / 2, canvasHeight / 2, world.blockSize, world.blockSize, rgba(0, 0, 0, 0.5));
  halfCanvasWidth = canvasWidth / 2;
  halfCanvasHeight = canvasHeight / 2;
  blockSizeMarginH = world.blockSize * marginH;
  blockSizeMarginV = world.blockSize * marginV;
  uiStatisticsInitialize();
};

function smoothstep(t) {
  return t ** 2 * (3 - 2 * t);
}

function smootherstep(t) {
  return t ** 3 * (t * (t * 6 - 15) + 10);
}

const render = (canvas, world) => {
  if (gameSpace["Escape"] || !document.hasFocus()) {
    paused = true;
  }

  if (paused && gameSpace["Enter"]) {
    paused = false;
    lastUpdate = performance.now();
  }
  if (!paused) {
    now = performance.now();
    dt = (now - lastUpdate) / 16;
    framesPlayed++;
    totalDelta += now - lastUpdate;
    timeSinceLastCameraAdjustment += now - lastUpdate;
    timeSinceLastGravityCalculation += now - lastUpdate;
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

    handleTimeInterval(timeSinceLastGravityCalculation, gravityCalculationRate, dt, () => {
      // Increase gravity over time
      if (gravity < maxGravity * dt) {
        gravity += gravityIncreaseRate * dt;
      }
      if (gravity > maxGravity * dt) {
        gravity = maxGravity * dt;
      }
      player.speedY = gravity;
    });

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
      gravity = initialGravity * dt;
    }

    if (jumpState && jumpState < 25) {
      player.speedY = -(jumpState > 12 ? (25 - jumpState) * dt : jumpState * dt);

      jumpState += dt;
    } else if (jumpState && jumpState < 40) jumpState += dt;
    if (jumpState >= 40) {
      // Reset spacePressed when the space bar is released
      jumpState = 0;
    }

    print(tempAllObjs);

    handleTimeInterval(timeSinceLastCameraAdjustment, cameraAdjustmentIntervalRate, dt, () => {
      camera.x = bezier(t, camera.x, camera.x + (player.x - camera.x) * 0.5, camera.x + (player.x - camera.x) * 0.5, player.x);
      camera.y = lerp(camera.y, player.y, smootherT);
      timeSinceLastCameraAdjustment = timeSinceLastCameraAdjustment - cameraAdjustmentIntervalRate;
    });

    camera.update();
    player.update();

    UIstatistics.frames.updateText(`Frames Played: ${framesPlayed}`);
    UIstatistics.frameRate.updateText(`FrameRate: ${(1000 / (totalDelta / framesPlayed)).toFixed(3)}`);
    UIstatistics.playerPosition.updateText(`Player's Position (x: ${player.x.toFixed(3)}, y: ${player.y.toFixed(3)})`);
    UIstatistics.playerSpeed.updateText(`Player's Speed (x: ${(player.speedX * dt).toFixed(3)}, y: ${player.speedY.toFixed(3)})`);

    printUIStatistics();
  }
};
