// Important Objects
let player;
let playerSprite;
let camera;
let canvas;
let canvasHeight;
let canvasWidth;
let halfCanvasWidth = canvasWidth / 2;
let halfCanvasHeight = canvasHeight / 2;
let world;
let ctx;
let gameSpace = [];
let tempAllObjs = {};
let UIstatistics;

// World Gen Presets
const t = 0.25;
const smootherT = t * t * t * (t * (t * 6 - 15) + 10);
const marginV = -12;
const marginH = -4;

// Gameplay Presets
let playerSpeed = 8;
const initialGravity = 0;
const gravityIncreaseRate = 0.4;
const maxGravity = 16;
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
let bgPhotoDimensions = { x: 1728, y: 993 };
let bgPhotosL1 = [];
let bgPhotosL2 = [];

const dialogue = `
> Do you ever feel as if you're going no where?
.
.
.
>> Mentally or physically?
.
.
.
> How about both. Let's start with mentally.
.
.
.
>> Routine erodes time, passing years carelessly. Monotony weathersthe mind. But occasionally you find someone that breathes life into the world. Giving it colour. Giving it and movement. 
.
.
.
> Like a Prometheus of life, perhaps, of love?
.
.
.
>> If only Prometheus unwittingly brought fire to the heart of man.
.
.
.
> And physically?
.
.
.
>> Physically, I wish to be a bird, to simply fly away from the problems. Migrate from the monotony, the sadness, the disappointment. Build a nest somewhere safe and warm, with colour, with excitement. 
.
.
.
> But unfortunately we must live with a bleak world, as a bird that can never nestle in tranquility.
`;
