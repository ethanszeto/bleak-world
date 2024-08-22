window.addEventListener("load", () => {
  canvas = document.getElementById("canvas");

  world = new WorldGenerator();
  //world.generate(111634516782378);
  world.generate(Math.floor(Math.random() * 1000000000000));

  canvas.width = window.innerWidth;
  canvasWidth = canvas.width;
  canvas.height = window.innerHeight;
  canvasHeight = canvas.height;
  ctx = canvas.getContext("2d");

  setUpGameFrame(canvas, world);

  // just above 30 fps
  setInterval(() => {
    canvas.width = window.innerWidth;
    canvasWidth = canvas.width;
    canvas.height = window.innerHeight;
    canvasHeight = canvas.height;
    render(canvas, world);
  }, 32);
});

//make sure to change canvas on window resize

window.addEventListener("keydown", (e) => {
  gameSpace[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  delete gameSpace[e.key];
});
