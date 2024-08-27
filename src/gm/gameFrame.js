const setUpGameFrame = (canvas, world) => {
  player = new Player(canvasWidth / 2, canvasHeight / 2, world.blockSize, world.blockSize * 2, rgba(255, 255, 255, 0.5));
  playerSprite = new MovingAnimation(player.x - 40, player.y - 40, 100, 100, [
    "birdright00",
    "birdright01",
    "birdright02",
    "birdright03",
    "birdright04",
    "birdright05",
  ]);
  camera = new Camera(canvasWidth / 2, canvasHeight / 2, world.blockSize, world.blockSize, rgba(255, 255, 255, 0));
  halfCanvasWidth = canvasWidth / 2;
  halfCanvasHeight = canvasHeight / 2;
  blockSizeMarginH = world.blockSize * marginH;
  blockSizeMarginV = world.blockSize * marginV;

  bgPhotosO1[bgObjHash(0, 0)] = new TiledBackground(0, 0, bgPhotoDimensions.x, bgPhotoDimensions.y, "bg1");
  bgPhotosO2[bgObjHash(0, 0)] = new TiledBackground(0, 0, bgPhotoDimensions.x, bgPhotoDimensions.y, "b1");
  uiStatisticsInitialize();
};

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
    framesPlayed++;
    delta = now - lastUpdate;
    totalDelta += delta;
    lastUpdate = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.speedX = 0;
    player.speedY = 0;

    // Calculate the extended visible range
    const visibleMinX =
      Math.round(player.x / world.blockSize) * world.blockSize - (Math.floor(halfCanvasWidth) - blockSizeMarginH);
    const visibleMaxX = visibleMinX + canvasWidth + blockSizeMarginH * -2;

    const visibleMinY =
      Math.round(player.y / world.blockSize) * world.blockSize - (Math.floor(halfCanvasHeight) - blockSizeMarginV);
    const visibleMaxY = visibleMinY + canvasHeight + blockSizeMarginV * -2 - world.blockSize * 3;

    let worldRowsList = [];
    for (let y = visibleMinY; y < visibleMaxY; y += world.blockSize) {
      worldRowsList.push(...world.getRowToRender(visibleMinX, visibleMaxX, y));
    }

    //console.log(worldRowsList);

    if (gravity < maxGravity) {
      gravity += gravityIncreaseRate;
    }
    if (gravity > maxGravity) {
      gravity = maxGravity;
    }
    player.speedY = gravity;

    // Horizontal movement
    if (gameSpace["a"]) {
      player.speedX = -playerSpeed;
      playerSprite.frameIds = ["birdleft00", "birdleft01", "birdleft02", "birdleft03", "birdleft04", "birdleft05"];
    }
    if (gameSpace["d"]) {
      player.speedX = playerSpeed;
      playerSprite.frameIds = ["birdright00", "birdright01", "birdright02", "birdright03", "birdright04", "birdright05"];
    }

    // Flappy Bird-like jump, only once per press
    if (!jumpState && (gameSpace[" "] || gameSpace["w"])) {
      // Space bar pressed and wasn't pressed before
      jumpState = 1;
      gravity = initialGravity;
    }

    if (jumpState && jumpState < 12) {
      if (jumpState % 2 === 0) playerSprite.nextFrame();

      player.speedY = -(jumpState > 6 ? (12 - jumpState) * 3 : jumpState * 3);

      jumpState++;
    } else if (jumpState && jumpState < 17) jumpState++;
    if (jumpState >= 17) {
      // Reset spacePressed when the space bar is released
      jumpState = 0;
      playerSprite.currentFrame = 0;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Render elements

    /* TODO
    Find a way to abstract background tilings
    Find a way to prevent duplicates in bgPhotos upon insertion
    */
    let haze1 = new MovingBox(
      camera.x - halfCanvasWidth,
      camera.y - halfCanvasHeight,
      canvasWidth,
      canvasHeight,
      rgba(123, 153, 103, 0.1)
    );

    generateBgObjs(haze1, bgPhotosO1, bgPhotoDimensions, visibleMinX, visibleMinY, visibleMaxX, visibleMaxY, "bg1");
    generateBgObjs(haze1, bgPhotosO2, bgPhotoDimensions, visibleMinX, visibleMinY, visibleMaxX, visibleMaxY, "b1");

    for (const key in bgPhotosO1) {
      const targetSpeedX = player.speedX !== 0 ? (player.speedX < 0 ? -0.1 : 0.1) : 0;
      const targetSpeedY = jumpState !== 0 ? -0.1 : 0.1;

      bgPhotosO1[key].speedX = lerp(bgPhotosO1[key].speedX, targetSpeedX, smootherT);
      bgPhotosO1[key].speedY = lerp(bgPhotosO1[key].speedY, targetSpeedY, smootherT);
    }

    for (const key in bgPhotosO2) {
      const targetSpeedX = player.speedX !== 0 ? (player.speedX < 0 ? -0.05 : 0.05) : 0;
      const targetSpeedY = jumpState !== 0 ? -0.05 : 0.05;

      bgPhotosO2[key].speedX = lerp(bgPhotosO2[key].speedX, targetSpeedX, smootherT);
      bgPhotosO2[key].speedY = lerp(bgPhotosO2[key].speedY, targetSpeedY, smootherT);
    }

    haze1.update();

    //draw bg here
    printObj(bgPhotosO1);
    printObj(bgPhotosO2);

    new MovingBox(
      camera.x - halfCanvasWidth,
      camera.y - halfCanvasHeight,
      canvasWidth,
      canvasHeight,
      rgba(123, 153, 103, 0.15)
    ).update();

    printList(worldRowsList);

    let text = new BaseText(400, 400, rgba(255, 255, 255, 1), "30px Arial", "Bleak World");
    text.update();
    playerSprite.speedX = player.speedX;
    playerSprite.speedY = player.speedY;

    camera.x = bezier(t, camera.x, camera.x + (player.x - camera.x) * 0.5, camera.x + (player.x - camera.x) * 0.5, player.x);
    camera.y = lerp(camera.y, player.y, smootherT);
    camera.update();

    playerSprite.update();
    player.update();

    UIstatistics.frames.updateText(`Frames Played: ${framesPlayed}`);
    UIstatistics.avgFrameRate.updateText(`Average FrameRate: ${(1000 / (totalDelta / framesPlayed)).toFixed(3)}`);
    UIstatistics.frameRate.updateText(`Current FrameRate: ${(1000 / delta).toFixed(3)}`);
    UIstatistics.playerPosition.updateText(`Player's Position (x: ${player.x.toFixed(3)}, y: ${player.y.toFixed(3)})`);
    UIstatistics.playerSpeed.updateText(`Player's Speed (x: ${player.speedX.toFixed(3)}, y: ${player.speedY.toFixed(3)})`);
    UIstatistics.windowBounds.updateText(
      `Window Bounds: [(x: ${(player.x - canvasWidth / 2).toFixed(1)}, y: ${(player.y - canvasHeight / 2).toFixed(1)}), (x: ${(
        player.x +
        canvasWidth / 2
      ).toFixed(1)}, y: ${(player.y + canvasHeight / 2).toFixed(1)})]`
    );
    UIstatistics.loadedBounds.updateText(
      `Loaded Bounds [(x: ${visibleMinX}, y: ${visibleMinY}), (x: ${visibleMaxX}, y: ${visibleMaxY})]`
    );
    printUIStatistics();
  }
};
