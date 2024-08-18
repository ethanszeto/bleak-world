function print(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        print(obj[key]);
      } else {
        obj.update();
      }
    }
  }
}
