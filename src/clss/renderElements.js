class Base {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
  }

  update() {
    ctx.save();
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    this.draw();
    ctx.restore();
    this.x += this.speedX * dt;
    this.y += this.speedY * dt;
  }
}

class Camera extends Box {
  constructor() {
    super(0, 0, 0, 0, rgba(0, 0, 0, 0));
  }
}
