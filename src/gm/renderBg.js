function roundToNearest(num, n) {
  return Math.round(num / n) * n;
}

function bgObjHash(x, y) {
  return `${roundToNearest(x, bgPhotoDimensions.x)}|${roundToNearest(y, bgPhotoDimensions.y)}`;
}

const generateBgObjs = (
  viewportObj,
  bgPhotosObj,
  bgPhotoDimensions,
  visibleMinX,
  visibleMinY,
  visibleMaxX,
  visibleMaxY,
  imgId
) => {
  let bgSpan = {};
  for (const key in bgPhotosObj) {
    if (
      !Collision.boxWithBox(
        new Box(bgPhotosObj[key].x, bgPhotosObj[key].y, bgPhotoDimensions.x * 2, bgPhotoDimensions.y * 2, rgba(0, 0, 0, 0)),
        viewportObj
      )
    ) {
      delete bgPhotosObj[key];
      continue;
    }
    if (bgSpan.minX ?? true) {
      bgSpan.minX = bgPhotosObj[key].x;
      bgSpan.minY = bgPhotosObj[key].y;
      bgSpan.maxX = bgPhotosObj[key].x + bgPhotoDimensions.x * 2;
      bgSpan.maxY = bgPhotosObj[key].y + bgPhotoDimensions.y * 2;
      continue;
    }
    bgSpan.minX = Math.min(bgPhotosObj[key].x, bgSpan.minX);
    bgSpan.minY = Math.min(bgPhotosObj[key].y, bgSpan.minY);
    bgSpan.maxX = Math.max(bgSpan.maxX, bgPhotosObj[key].x + bgPhotoDimensions.x * 2);
    bgSpan.maxY = Math.max(bgSpan.maxY, bgPhotosObj[key].y + bgPhotoDimensions.y * 2);
  }

  if (bgSpan.minX > visibleMinX) {
    for (let y = bgSpan.minY; y < visibleMaxY; y += bgPhotoDimensions.y * 2) {
      let key = bgObjHash(bgSpan.minX - bgPhotoDimensions.x * 2, y);
      if (!bgPhotosObj[key])
        bgPhotosObj[key] = new TiledBackground(
          bgSpan.minX - bgPhotoDimensions.x * 2,
          y,
          bgPhotoDimensions.x,
          bgPhotoDimensions.y,
          imgId
        );
    }
  }
  if (bgSpan.minY > visibleMinY) {
    for (let x = bgSpan.minX; x < visibleMaxX; x += bgPhotoDimensions.x * 2) {
      let key = bgObjHash(x, bgSpan.minY - bgPhotoDimensions.y * 2);
      if (!bgPhotosObj[key])
        bgPhotosObj[key] = new TiledBackground(
          x,
          bgSpan.minY - bgPhotoDimensions.y * 2,
          bgPhotoDimensions.x,
          bgPhotoDimensions.y,
          imgId
        );
    }
  }
  if (bgSpan.maxX < visibleMaxX) {
    for (let y = bgSpan.minY; y < visibleMaxY; y += bgPhotoDimensions.y * 2) {
      let key = bgObjHash(bgSpan.minX + bgPhotoDimensions.x * 2);
      if (!bgPhotosObj[key])
        bgPhotosObj[key] = new TiledBackground(
          bgSpan.minX + bgPhotoDimensions.x * 2,
          y,
          bgPhotoDimensions.x,
          bgPhotoDimensions.y,
          imgId
        );
    }
  }
  if (bgSpan.maxY < visibleMaxY) {
    for (let x = bgSpan.minX; x < visibleMaxX; x += bgPhotoDimensions.x * 2) {
      let key = bgObjHash(x, bgSpan.maxY);
      if (!bgPhotosObj[key])
        bgPhotosObj[key] = new TiledBackground(x, bgSpan.maxY, bgPhotoDimensions.x, bgPhotoDimensions.y, imgId);
    }
  }
};
