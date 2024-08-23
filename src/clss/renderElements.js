class Base {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class BaseText extends Base {
  constructor(x, y, color, font, text) {
    super(x, y);
    this.color = color;
    this.font = font;
    this.text = text;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.fillText(this.text, this.x, this.y);
  }

  update() {
    let m = ctx.measureText(this.text);
    ctx.save();
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);
    ctx.translate(this.x + m.width / 2, this.y + m.height / 2);
    ctx.translate(-(this.x + m.width / 2), -(this.y + m.height / 2));
    this.draw();
    ctx.restore();
  }
}

class UIText extends BaseText {
  constructor(x, y, color, font, text) {
    super(x, y, color, font, text);
  }

  update() {
    super.draw();
  }

  updateText(text) {
    this.text = text;
  }
}

class Circle extends Base {
  constructor(x, y, radius, color) {
    super(x, y);
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    // fix to translate circle properly
    ctx.save();
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    this.draw();
    ctx.restore();
  }
}

class Box extends Base {
  constructor(x, y, width, height, color) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    ctx.save();
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    this.draw();
    ctx.restore();
  }
}

class MovingBox extends Box {
  constructor(x, y, width, height, color) {
    super(x, y, width, height, color);
    this.speedX = 0;
    this.speedY = 0;
  }

  update() {
    ctx.save();
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    this.draw();
    ctx.restore();
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

class Player extends Box {
  update() {
    ctx.save();
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    this.draw();
    ctx.restore();
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

class Camera extends Box {
  constructor(x = 0, y = 0, width = 0, height = 0, color = rgba(0, 0, 0, 0)) {
    super(x, y, width, height, color);
  }
}

class BaseImage extends Base {
  constructor(x, y, width, height, imageId) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.imageId = imageId;
  }

  draw() {
    let image = document.getElementById(this.imageId);
    ctx.drawImage(image, this.x, this.y, this.width, this.height);
  }

  update() {
    ctx.save();
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    this.draw();
    ctx.restore();
  }
}

class BaseAnimation extends Base {
  constructor(x, y, width, height, frameIds) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.frameIds = frameIds;
    this.currentFrame = 0;
    this.maxFrames = frameIds.length - 1;
  }

  nextFrame() {
    if (this.currentFrame === this.maxFrames) {
      this.currentFrame = 0;
    } else {
      this.currentFrame++;
    }
  }

  draw() {
    let image = document.getElementById(this.frameIds[this.currentFrame]);
    ctx.drawImage(image, this.x, this.y, this.width, this.height);
  }

  update() {
    ctx.save();
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    this.draw();
    ctx.restore();
  }
}

class MovingAnimation extends BaseAnimation {
  update() {
    ctx.save();
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    super.draw();
    ctx.restore();
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

class TiledBackground extends BaseImage {
  constructor(x, y, width, height, imageId) {
    super(x, y, width, height, imageId);
    this.speedX = 0;
    this.speedY = 0;
  }

  draw() {
    let image = document.getElementById(this.imageId);
    ctx.save();

    // Draw the original image
    ctx.drawImage(image, this.x, this.y, this.width, this.height);

    // Flip horizontally
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Move to the center of the image
    ctx.scale(-1, 1); // Flip horizontally
    ctx.drawImage(image, -this.width * 1.5, -this.height / 2, this.width, this.height); // Draw flipped image
    ctx.restore();

    // Flip vertically
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Move to the center of the image
    ctx.scale(1, -1); // Flip vertically
    ctx.drawImage(image, -this.width / 2, -this.height * 1.5, this.width, this.height); // Draw flipped image
    ctx.restore();

    // Flip both horizontally and vertically
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Move to the center of the image
    ctx.scale(-1, -1); // Flip both horizontally and vertically
    ctx.drawImage(image, -this.width * 1.5, -this.height * 1.5, this.width, this.height); // Draw flipped image
    ctx.restore();

    ctx.restore();
  }

  update() {
    ctx.save();
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);
    ctx.translate(this.x + this.width, this.y + this.height);
    ctx.translate(-(this.x + this.width), -(this.y + this.height));
    this.draw();
    ctx.restore();
    this.x += this.speedX;
    this.y += this.speedY;
  }
}
