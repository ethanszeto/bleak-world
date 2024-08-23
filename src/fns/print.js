function printObj(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        printObj(obj[key]);
      } else {
        obj.update();
      }
    }
  }
}

function printList(list) {
  for (let element of list) {
    element.update();
  }
}
