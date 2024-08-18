const setUpGameFrame = (canvas, world) => {
  player = new Box(canvasWidth / 2, canvasHeight / 2, world.blockSize, world.blockSize * 2, rgba(255, 255, 255, 1));
  camera = new Box(canvasWidth / 2, canvasHeight / 2, world.blockSize, world.blockSize, rgba(0, 0, 0, 0.5));
};

function lerp(start, end, t) {
  return start + (end - start) * t;
}

const render = (canvas, world) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.speedX = 0;
  player.speedY = 0;
  camera.speedX = 0;
  camera.speedY = 0;

  // Calculate the visible range
  const marginV = world.blockSize * 16; // Adjust this value as needed
  const marginH = world.blockSize * 8;

  // Calculate the extended visible range
  const visibleMinX = Math.round(player.x / world.blockSize) * world.blockSize - canvasWidth / 2 - marginH;
  const visibleMaxX = visibleMinX + canvasWidth + marginH * 2;
  const visibleMinY = Math.round(player.y / world.blockSize) * world.blockSize - canvasHeight / 2 - marginV;
  const visibleMaxY = visibleMinY + canvasHeight + marginV * 2;

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
  } // Rate at which gravity increases over time

  // Gravity variables

  // Reset speeds before checking controls
  player.speedY += gravity;
  camera.speedY -= gravity;

  // Horizontal movement
  if (gameSpace["a"]) {
    player.speedX = -playerSpeed;
    camera.speedX = playerSpeed;
  }
  if (gameSpace["d"]) {
    player.speedX = playerSpeed;
    camera.speedX = -playerSpeed;
  }

  // Flappy Bird-like jump, only once per press
  if (!jumpState && gameSpace[" "]) {
    // Space bar pressed and wasn't pressed before
    jumpState = 1;
    gravity = initialGravity;
  }

  if (jumpState && jumpState < 5) {
    player.speedY = (-1 / player.speedY) * 15;
    camera.speedY = (-1 / camera.speedY) * 15;
    jumpState++;
  } else if (jumpState && jumpState < 15) jumpState++;
  if (jumpState >= 15) {
    // Reset spacePressed when the space bar is released
    jumpState = 0;
  }

  // Increase gravity over time
  if (gravity < maxGravity) gravity += gravityIncreaseRate;

  print(tempAllObjs);

  camera.update();
  // const t = 0.1; // Adjust t for smoothness; 0 < t < 1
  // camera.x = bezier(t, camera.x, camera.x + (player.x - camera.x) * 0.5, camera.x + (player.x - camera.x) * 0.5, player.x);
  // camera.y = bezier(t, camera.y, camera.y + (player.y - camera.y) * 0.5, camera.y + (player.y - camera.y) * 0.5, player.y);

  const t = 0.5; // Adjust t for smoothness; 0 < t < 1
  camera.x = lerp(camera.x, player.x, t);
  camera.y = lerp(camera.y, player.y, t);
  camera.newPos();
  player.update();
  player.newPos();

  player.draw();
  camera.draw();
};
