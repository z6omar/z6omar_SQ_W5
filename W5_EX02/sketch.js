// ============================================================
// Week 5 Example 2 — Animated Coin
// ============================================================

// ------------------------------------------------------------
// COIN SPRITE CONFIGURATION
// Coin sheet: 256 x 32px — 8 frames in a single row.
// Adjust these values to match your own sprite sheet.
// ------------------------------------------------------------
const COIN = {
  frameWidth:  32,  // 256px total / 8 frames
  frameHeight: 32,  // only one row, full sheet height
  numFrames:   8,   // 8 frames of spin animation
  animSpeed:   6,   // draw() frames per sprite frame (lower = faster)
  scale:       2.0, // scale up so the coin is visible on screen
};

// ------------------------------------------------------------
// COIN OBJECTS
// Each coin is an object with a position and its own
// frame and frameTimer so they animate independently.
// Storing coins in an array means we can loop through
// and update or draw all of them with a single for loop.
// Starting each coin on a different frame gives visual variety —
// they won't all spin in sync.
// ------------------------------------------------------------
let coins = [
  { x: 200, y: 150, frame: 0, frameTimer: 0 },
  { x: 400, y: 280, frame: 2, frameTimer: 0 }, // offset start frame for variety
  { x: 600, y: 180, frame: 5, frameTimer: 0 },
  { x: 300, y: 350, frame: 3, frameTimer: 0 },
  { x: 550, y: 360, frame: 1, frameTimer: 0 },
];

let coinSheet; // the loaded coin sprite sheet image

// ============================================================
// preload()
// Runs once before setup(). Always load images here so they
// are ready before the sketch tries to use them.
// ============================================================
function preload() {
  coinSheet = loadImage("assets/images/coin_gold.png");
}

// ============================================================
// setup()
// Runs once at the very start of the sketch.
// imageMode(CENTER) makes image() draw from the centre point
// rather than the top-left corner.
// ============================================================
function setup() {
  createCanvas(800, 450);
  imageMode(CENTER);
}

// ============================================================
// draw()
// Runs repeatedly in a loop after setup() finishes.
// Update and draw are called separately to keep responsibilities clear:
// updateCoins() advances animation state,
// drawCoins() renders the current state to the canvas.
// ============================================================
function draw() {
  background(30);

  updateCoins();
  drawCoins();
  drawHUD();
}

// ------------------------------------------------------------
// updateCoins()
// Loops through every coin and advances its animation frame.
// Each coin has its own frameTimer so they animate independently.
// frameTimer counts up every draw() call; when it reaches
// animSpeed, the frame advances and the timer resets.
// % numFrames wraps the frame back to 0 after the last frame.
// ------------------------------------------------------------
function updateCoins() {
  for (let i = 0; i < coins.length; i++) {
    let coin = coins[i];

    // Advance the animation timer each frame
    coin.frameTimer++;
    if (coin.frameTimer >= COIN.animSpeed) {
      coin.frameTimer = 0;
      coin.frame = (coin.frame + 1) % COIN.numFrames;
    }
  }
}

// ------------------------------------------------------------
// drawCoins()
// Loops through every coin and draws it at its current frame.
// Coins only have one row so sy (source y) is always 0.
// sx slides along the row by multiplying the frame number
// by frameWidth — the same pattern as the walking character.
// ------------------------------------------------------------
function drawCoins() {
  for (let i = 0; i < coins.length; i++) {
    let coin = coins[i];

    // Source x position on the sprite sheet
    // Coins have only one row so sy is always 0
    let sx = coin.frame * COIN.frameWidth;
    let sy = 0;

    // Draw size (original frame size multiplied by scale)
    let dw = COIN.frameWidth  * COIN.scale;
    let dh = COIN.frameHeight * COIN.scale;

    image(
      coinSheet,
      coin.x, coin.y, // destination centre position
      dw, dh,         // destination size (scaled)
      sx, sy,         // source position on sheet
      COIN.frameWidth,  // source width  (one frame)
      COIN.frameHeight, // source height (one row)
    );
  }
}

// ------------------------------------------------------------
// drawHUD()
// HUD = Heads Up Display.
// Shows the current config values — useful when tuning
// animation speed and scale on a new sprite sheet.
// ------------------------------------------------------------
function drawHUD() {
  noStroke();
  fill(160);
  textSize(13);
  textAlign(LEFT);
  textFont("monospace");
  text("5 animated coins — each has its own frame counter", 16, 24);

  // Config readout — useful when tuning a new sprite sheet
  fill(100);
  textSize(11);
  text("COIN.animSpeed: " + COIN.animSpeed + "  (lower = faster)", 16, 44);
  text("COIN.scale: "     + COIN.scale,                            16, 58);
  text("COIN.numFrames: " + COIN.numFrames,                        16, 72);
}
