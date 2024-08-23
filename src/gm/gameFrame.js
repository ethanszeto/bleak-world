function bgObjHash(x, y) {
  return `${x},${y}`;
}

const setUpGameFrame = (canvas, world) => {
  player = new Player(canvasWidth / 2, canvasHeight / 2, world.blockSize, world.blockSize * 2, rgba(255, 255, 255, 0));
  playerSprite = new MovingAnimation(player.x - 40, player.y - 40, 100, 100, [
    "birdright00",
    "birdright01",
    "birdright02",
    "birdright03",
    "birdright04",
    "birdright05",
  ]);
  camera = new Camera(canvasWidth / 2, canvasHeight / 2, world.blockSize, world.blockSize, rgba(0, 0, 0, 0));
  halfCanvasWidth = canvasWidth / 2;
  halfCanvasHeight = canvasHeight / 2;
  blockSizeMarginH = world.blockSize * marginH;
  blockSizeMarginV = world.blockSize * marginV;
  //bgPhotosL1.push(new TiledBackground(0, 0, bgPhotoDimensions.x, bgPhotoDimensions.y, "bg1"));
  bgPhotosO1[bgObjHash(0, 0)] = new TiledBackground(0, 0, bgPhotoDimensions.x, bgPhotoDimensions.y, "bg1");
  bgPhotosL2.push(new TiledBackground(0, 0, bgPhotoDimensions.x, bgPhotoDimensions.y, "b1"));
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
    } else if (jumpState && jumpState < 20) jumpState++;
    if (jumpState >= 20) {
      // Reset spacePressed when the space bar is released
      jumpState = 0;
      playerSprite.currentFrame = 0;
    }

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

    let bgSpanL1 = {};
    for (const key in bgPhotosO1) {
      if (
        !Collision.boxWithBox(
          new Box(bgPhotosO1[key].x, bgPhotosO1[key].y, bgPhotoDimensions.x * 2, bgPhotoDimensions.y * 2, rgba(0, 0, 0, 0)),
          haze1
        )
      ) {
        delete bgPhotosO1[key];
        continue;
      }
      if (bgSpanL1.minX ?? true) {
        bgSpanL1.minX = bgPhotosO1[key].x;
        bgSpanL1.minY = bgPhotosO1[key].y;
        bgSpanL1.maxX = bgPhotosO1[key].x + bgPhotoDimensions.x * 2;
        bgSpanL1.maxY = bgPhotosO1[key].y + bgPhotoDimensions.y * 2;
        continue;
      }
      bgSpanL1.minX = Math.min(bgPhotosO1[key].x, bgSpanL1.minX);
      bgSpanL1.minY = Math.min(bgPhotosO1[key].y, bgSpanL1.minY);
      bgSpanL1.maxX = Math.max(bgSpanL1.maxX, bgPhotosO1[key].x + bgPhotoDimensions.x * 2);
      bgSpanL1.maxY = Math.max(bgSpanL1.maxY, bgPhotosO1[key].y + bgPhotoDimensions.y * 2);
    }

    if (bgSpanL1.minX > visibleMinX) {
      for (let y = bgSpanL1.minY; y < visibleMaxY; y += bgPhotoDimensions.y * 2) {
        let key = bgObjHash(bgSpanL1.minX - bgPhotoDimensions.x * 2, y);
        if (!bgPhotosO1[key])
          bgPhotosO1[key] = new TiledBackground(
            bgSpanL1.minX - bgPhotoDimensions.x * 2,
            y,
            bgPhotoDimensions.x,
            bgPhotoDimensions.y,
            "bg1"
          );
      }
    }
    if (bgSpanL1.minY > visibleMinY) {
      for (let x = bgSpanL1.minX; x < visibleMaxX; x += bgPhotoDimensions.x * 2) {
        let key = bgObjHash(x, bgSpanL1.minY - bgPhotoDimensions.y * 2);
        if (!bgPhotosO1[key])
          bgPhotosO1[key] = new TiledBackground(
            x,
            bgSpanL1.minY - bgPhotoDimensions.y * 2,
            bgPhotoDimensions.x,
            bgPhotoDimensions.y,
            "bg1"
          );
      }
    }
    if (bgSpanL1.maxX < visibleMaxX) {
      for (let y = bgSpanL1.minY; y < visibleMaxY; y += bgPhotoDimensions.y * 2) {
        let key = bgObjHash(bgSpanL1.minX + bgPhotoDimensions.x * 2);
        if (!bgPhotosO1[key])
          bgPhotosO1[key] = new TiledBackground(
            bgSpanL1.minX + bgPhotoDimensions.x * 2,
            y,
            bgPhotoDimensions.x,
            bgPhotoDimensions.y,
            "bg1"
          );
      }
    }
    if (bgSpanL1.maxY < visibleMaxY) {
      for (let x = bgSpanL1.minX; x < visibleMaxX; x += bgPhotoDimensions.x * 2) {
        let key = bgObjHash(x, bgSpanL1.maxY);
        if (!bgPhotosO1[key])
          bgPhotosO1[key] = new TiledBackground(x, bgSpanL1.maxY, bgPhotoDimensions.x, bgPhotoDimensions.y, "bg1");
      }
    }

    let bgSpanL2 = {};
    for (let i = 0; i < bgPhotosL2.length; i++) {
      if (
        !Collision.boxWithBox(
          new Box(bgPhotosL2[i].x, bgPhotosL2[i].y, bgPhotoDimensions.x * 2, bgPhotoDimensions.y * 2, rgba(0, 0, 0, 0)),
          haze1
        )
      ) {
        bgPhotosL2.splice(i, 1);
        i--;
        continue;
      }
      if (bgSpanL2.minX ?? true) {
        bgSpanL2.minX = bgPhotosL2[i].x;
        bgSpanL2.minY = bgPhotosL2[i].y;
        bgSpanL2.maxX = bgPhotosL2[i].x + bgPhotoDimensions.x * 2;
        bgSpanL2.maxY = bgPhotosL2[i].y + bgPhotoDimensions.y * 2;
        continue;
      }
      bgSpanL2.minX = Math.min(bgPhotosL2[i].x, bgSpanL2.minX);
      bgSpanL2.minY = Math.min(bgPhotosL2[i].y, bgSpanL2.minY);
      bgSpanL2.maxX = Math.max(bgSpanL2.maxX, bgPhotosL2[i].x + bgPhotoDimensions.x * 2);
      bgSpanL2.maxY = Math.max(bgSpanL2.maxY, bgPhotosL2[i].y + bgPhotoDimensions.y * 2);
    }

    if (bgSpanL2.minX > visibleMinX) {
      for (let y = bgSpanL2.minY; y < visibleMaxY; y += bgPhotoDimensions.y * 2) {
        bgPhotosL2.push(
          new TiledBackground(bgSpanL2.minX - bgPhotoDimensions.x * 2, y, bgPhotoDimensions.x, bgPhotoDimensions.y, "b1")
        );
      }
    }
    if (bgSpanL2.minY > visibleMinY) {
      for (let x = bgSpanL2.minX; x < visibleMaxX; x += bgPhotoDimensions.x * 2) {
        bgPhotosL2.push(
          new TiledBackground(x, bgSpanL2.minY - bgPhotoDimensions.y * 2, bgPhotoDimensions.x, bgPhotoDimensions.y, "b1")
        );
      }
    }
    if (bgSpanL2.maxX < visibleMaxX) {
      for (let y = bgSpanL2.minY; y < visibleMaxY; y += bgPhotoDimensions.y * 2) {
        bgPhotosL2.push(
          new TiledBackground(bgSpanL2.minX + bgPhotoDimensions.x * 2, y, bgPhotoDimensions.x, bgPhotoDimensions.y, "b1")
        );
      }
    }
    if (bgSpanL2.maxY < visibleMaxY) {
      for (let x = bgSpanL2.minX; x < visibleMaxX; x += bgPhotoDimensions.x * 2) {
        bgPhotosL2.push(new TiledBackground(x, bgSpanL2.maxY, bgPhotoDimensions.x, bgPhotoDimensions.y, "b1"));
      }
    }

    // for (const tile of bgPhotosL1) {
    //   tile.speedX = player.speedX / 7;
    //   tile.speedY = gameSpace[" "] || gameSpace["w"] ? -0.1 : player.speedY / 7;
    // }

    // for (const tile of bgPhotosL2) {
    //   tile.speedX = player.speedX / 8;
    //   tile.speedY = gameSpace[" "] || gameSpace["w"] ? -0.1 : player.speedY / 8;
    // }

    console.log(bgPhotosO1);

    haze1.update();

    //draw bg here
    //printList(bgPhotosL1);
    printObj(bgPhotosO1);
    printList(bgPhotosL2);

    new MovingBox(
      camera.x - halfCanvasWidth,
      camera.y - halfCanvasHeight,
      canvasWidth,
      canvasHeight,
      rgba(123, 153, 103, 0.1)
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
