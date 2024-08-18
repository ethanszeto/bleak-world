class Collision {
  static check(a, b) {
    if (a instanceof Box) {
      if (b instanceof Box) {
        return this.boxWithBox(a, b);
      }
      return this.boxWithCircle(a, b);
    }
    if (b instanceof Box) {
      return this.boxWithCircle(b, a);
    }
    return this.circleWithCircle(a, b);
  }

  static boxWithBox(a, b) {
    return !(a.x > b.x + b.width || a.x + a.width < b.x || a.y > b.y + b.height || a.y + a.height < b.y);
  }

  static boxWithCircle(b, c) {
    return (
      Math.hypot(c.x - Math.max(b.x, Math.min(c.x, b.x + b.width)), c.y - Math.max(b.y, Math.min(c.y, b.y + b.height))) <=
      c.radius
    );
  }

  static circleWithCircle(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y) <= a.radius + b.radius;
  }
}
