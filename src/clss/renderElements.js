class Base {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // Entry point for collision detection
  collidesWith(other) {
    return other.collideWith(this);
  }

  // Abstract methods for specific collisions
  collideWith(other) {
    throw new Error("collideWith method should be implemented in derived classes");
  }

  collideWithBox(box) {
    return false; // Default implementation for non-Box objects
  }

  collideWithCircle(circle) {
    return false; // Default implementation for non-Circle objects
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

  // Dispatch based on the type of the other object
  collideWith(other) {
    return other.collideWithCircle(this);
  }

  // Collision logic specific to another circle
  collideWithCircle(circle) {
    const distance = Math.hypot(this.x - circle.x, this.y - circle.y);
    return distance <= this.radius + circle.radius;
  }

  // Collision logic specific to a box
  collideWithBox(box) {
    const closestX = Math.max(box.x, Math.min(this.x, box.x + box.width));
    const closestY = Math.max(box.y, Math.min(this.y, box.y + box.height));
    const distance = Math.hypot(this.x - closestX, this.y - closestY);
    return distance <= this.radius;
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
    // ctx.save();
    // // Translate the context to the camera's position
    // ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);
    // // Draw the object relative to the new context origin
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.restore();
    ctx.save();
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }

  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  // Dispatch based on the type of the other object
  collideWith(other) {
    return other.collideWithBox(this);
  }

  // Collision logic specific to another box
  collideWithBox(box) {
    return !(
      this.x > box.x + box.width ||
      this.x + this.width < box.x ||
      this.y > box.y + box.height ||
      this.y + this.height < box.y
    );
  }

  // Collision logic specific to a circle
  collideWithCircle(circle) {
    return circle.collideWithBox(this); // Delegate to Circle's method
  }
}
