function print(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        // Recursively iterate through the nested object
        print(obj[key]);
      } else {
        obj.update();
        obj.newPos();
        obj.draw();
      }
    }
  }
}
