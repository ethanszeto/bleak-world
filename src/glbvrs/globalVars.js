// Important Objects
let player;
let camera;
let canvas;
let canvasHeight;
let canvasWidth;
let halfCanvasWidth = canvasWidth / 2;
let halfCanvasHeight = canvasHeight / 2;
let world;
let ctx;
let gameSpace = [];
let playerSpeed = 4;
let tempAllObjs = {};
let UIstatistics;

// World Gen Presets
const t = 0.25;
const smootherT = t * t * t * (t * (t * 6 - 15) + 10);
const marginV = -12;
const marginH = -4;

// Gameplay Presets
const initialGravity = 0.1;
const gravityIncreaseRate = 0.25;
const maxGravity = 8;
let gravity = initialGravity;
const cameraAdjustmentIntervalRate = 30;

// Game State
let jumpState = 0;
let jumpCounter = 0;
let blockSizeMarginH;
let blockSizeMarginV;
let dt = 1;
let lastUpdate = performance.now();
let totalDelta = 0;
let framesPlayed = 0;
let paused = false;
let now;
let timeSinceLastCameraAdjustment = [0];
let delta;
