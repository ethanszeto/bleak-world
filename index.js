const canvas = document.getElementById("canvas");

window.addEventListener("load", () => {
  const world = new WorldGenerator();
  world.generate(111634516782378);

  setInterval(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render(canvas, world);
  }, 1000);
});
