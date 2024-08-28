startGame = () => {
  document.getElementById("title-page").style.display = "none";
  document.getElementById("world-options").style.display = "none";
  document.getElementById("prologue").style.display = "none";
  document.getElementById("canvas").style.display = "block";
  lastUpdate = performance.now();
  now = performance.now();

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
};

document.getElementById("open-start-selection").addEventListener("click", () => {
  document.getElementById("title-page").style.display = "none";
  document.getElementById("world-options").style.display = "block";
  document.getElementById("world-seed").value = state.world.seed;
  document.getElementById("scale").value = presets.worldGen.baseScale;
  document.getElementById("variation-scale").value = presets.worldGen.variationScale;
  document.getElementById("variation-intensity").value = presets.worldGen.variationIntensity;
  document.getElementById("cave-threshold").value = presets.worldGen.threshold;
  document.getElementById("small-cave-threshold").value = presets.worldGen.smallCaveThreshold;
  document.getElementById("small-cave-scale").value = presets.worldGen.smallCaveScale;
  document.getElementById("tunnel-effect").value = presets.worldGen.tunnelEffect;
  document.getElementById("initial-gravity").value = presets.gravity.initial;
  document.getElementById("gravity-increase-rate").value = presets.gravity.increaseRate;
  document.getElementById("max-gravity").value = presets.gravity.max;
  document.getElementById("player-speed").value = presets.playerSpeed;
});

document.getElementById("start-game").addEventListener("click", () => {
  document.getElementById("title-page").style.display = "none";
  document.getElementById("world-options").style.display = "none";
  document.getElementById("prologue").style.display = "block";
  let i = 0;
  let speed = 25;
  const typeEffect = () => {
    if (i < dialogue.length) {
      let textToAdd = "";
      if (
        (dialogue.charAt(i) === " " && dialogue.charAt(i + 1) === " ") ||
        dialogue.charAt(i) === "." ||
        dialogue.charAt(i) === ","
      ) {
        speed = 500;
      } else {
        speed = 25;
      }
      console.log(dialogue.substring(i, i + 5));
      if (dialogue.substring(i, i + 5) === "     ") {
        textToAdd += "<br/>";
      }

      if (dialogue.charAt(i) === ">" && dialogue.charAt(i + 1) === ">") {
        textToAdd += "<br/>";
      } else if (dialogue.charAt(i) === ">" && dialogue.charAt(i - 1) !== ">") {
        textToAdd += "<br/>";
      }

      textToAdd += dialogue.charAt(i);
      document.getElementById("dialogue").innerHTML += textToAdd;
      i++;

      setTimeout(typeEffect, speed);
    } else {
      startGame();
    }
  };
  typeEffect();
});

document.getElementById("open-advanced").addEventListener("click", () => {
  document.getElementById("open-advanced").style.display = "none";
  document.getElementById("advanced-options").style.display = "inline-grid";
});

//make sure to change canvas on window resize

window.addEventListener(
  "keydown",
  (e) => {
    if (
      (document.getElementById("world-options").style.display === "block" ||
        document.getElementById("title-page").style.display === "") &&
      e.key === "q"
    ) {
      startGame();
    }
  },
  { once: true }
);

window.addEventListener("keydown", (e) => {
  gameSpace[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  delete gameSpace[e.key];
});
