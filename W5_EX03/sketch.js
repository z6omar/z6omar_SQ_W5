
// ============================================================
// Maze with Animated Character and Keys
// Background image + smaller maze in bottom half
// ============================================================

const SPRITE = {
  frameWidth: 247,
  frameHeight: 247,
  numFrames: 6,
  animSpeed: 20,
  scale: 0.2,

  rows: {
    down: 0,
    up: 1,
    left: 2,
    right: 3,
  },

  offsets: {
    down: { x: 25, y: 0 },
    up: { x: 25, y: 0 },
    right: { x: 25, y: 0 },
    left: { x: 25, y: 0 },
  },
};

const COIN = {
  frameWidth: 170.67,
  frameHeight: 500,
  numFrames: 9,
  animSpeed: 6,
  scale: 0.1,
};

const TILE_SIZE = 35;

// Move whole maze
const MAZE_OFFSET_X = 120;
const MAZE_OFFSET_Y = 180;

const MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 1, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 3, 1, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 3, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let player = {
  x: 0,
  y: 0,
  speed: 2,

  currentFrame: 0,
  frameTimer: 0,
  direction: "down",
  isMoving: false,

  hw: 9,
  hh: 9,
};

let coins = [];
let coinsCollected = 0;
let gameWon = false;

let characterSheet;
let coinSheet;
let backgroundImg;

function preload() {
  characterSheet = loadImage("assets/images/character_sprite_sheet.png");
  coinSheet = loadImage("assets/images/key_sprite_sheet.png");
  backgroundImg = loadImage("assets/images/background.png");
}

function setup() {
  createCanvas(800, 500);
  imageMode(CENTER);

  for (let row = 0; row < MAZE.length; row++) {
    for (let col = 0; col < MAZE[row].length; col++) {
      let tile = MAZE[row][col];

      if (tile === 2) {
        player.x = col * TILE_SIZE + TILE_SIZE / 2 + MAZE_OFFSET_X;
        player.y = row * TILE_SIZE + TILE_SIZE / 2 + MAZE_OFFSET_Y;
      }

      if (tile === 3) {
        coins.push({
          x: col * TILE_SIZE + TILE_SIZE / 2 + MAZE_OFFSET_X,
          y: row * TILE_SIZE + TILE_SIZE / 2 + MAZE_OFFSET_Y,
          frame: floor(random(COIN.numFrames)),
          frameTimer: 0,
          collected: false,
        });
      }
    }
  }
}

function draw() {
  image(backgroundImg, width / 2, height / 2, width, height);

  drawMaze();

  updateCoins();
  drawCoins();

  handleInput();
  resolveWallCollisions();
  checkCoinCollection();
  checkExit();

  animateSprite();
  drawCharacter();
  drawHUD();

  if (gameWon) {
    drawWinScreen();
  }
}

function drawMaze() {
  rectMode(CORNER);
  noStroke();

  for (let row = 0; row < MAZE.length; row++) {
    for (let col = 0; col < MAZE[row].length; col++) {
      let tile = MAZE[row][col];

      let x = col * TILE_SIZE + MAZE_OFFSET_X;
      let y = row * TILE_SIZE + MAZE_OFFSET_Y;

      if (tile === 0 || tile === 2 || tile === 3) {
        fill(35, 35, 45, 180);
        rect(x, y, TILE_SIZE, TILE_SIZE);
      }

      if (tile === 4) {
        fill(30, 200, 120, 180);
        rect(x, y, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function updateCoins() {
  for (let i = 0; i < coins.length; i++) {
    if (coins[i].collected) continue;

    coins[i].frameTimer++;

    if (coins[i].frameTimer >= COIN.animSpeed) {
      coins[i].frameTimer = 0;
      coins[i].frame = (coins[i].frame + 1) % COIN.numFrames;
    }
  }
}

function drawCoins() {
  for (let i = 0; i < coins.length; i++) {
    if (coins[i].collected) continue;

    let coin = coins[i];

    let sx = coin.frame * COIN.frameWidth;
    let sy = 0;

    let dw = COIN.frameWidth * COIN.scale;
    let dh = COIN.frameHeight * COIN.scale;

    image(
      coinSheet,
      coin.x,
      coin.y - 20,
      dw,
      dh,
      sx,
      sy,
      COIN.frameWidth,
      COIN.frameHeight
    );
  }
}

function handleInput() {
  if (gameWon) return;

  player.isMoving = false;

  if (keyIsDown(87)) {
    player.y -= player.speed;
    player.direction = "up";
    player.isMoving = true;
  }

  if (keyIsDown(83)) {
    player.y += player.speed;
    player.direction = "down";
    player.isMoving = true;
  }

  if (keyIsDown(65)) {
    player.x -= player.speed;
    player.direction = "left";
    player.isMoving = true;
  }

  if (keyIsDown(68)) {
    player.x += player.speed;
    player.direction = "right";
    player.isMoving = true;
  }
}

function resolveWallCollisions() {
  let corners = [
    { x: player.x - player.hw, y: player.y - player.hh },
    { x: player.x + player.hw, y: player.y - player.hh },
    { x: player.x - player.hw, y: player.y + player.hh },
    { x: player.x + player.hw, y: player.y + player.hh },
  ];

  for (let i = 0; i < corners.length; i++) {
    let c = corners[i];

    let col = floor((c.x - MAZE_OFFSET_X) / TILE_SIZE);
    let row = floor((c.y - MAZE_OFFSET_Y) / TILE_SIZE);

    if (row < 0 || row >= MAZE.length || col < 0 || col >= MAZE[0].length) continue;

    if (MAZE[row][col] === 1) {
      let tileLeft = col * TILE_SIZE + MAZE_OFFSET_X;
      let tileRight = tileLeft + TILE_SIZE;
      let tileTop = row * TILE_SIZE + MAZE_OFFSET_Y;
      let tileBottom = tileTop + TILE_SIZE;

      let overlapLeft = player.x + player.hw - tileLeft;
      let overlapRight = tileRight - (player.x - player.hw);
      let overlapTop = player.y + player.hh - tileTop;
      let overlapBottom = tileBottom - (player.y - player.hh);

      let minOverlap = min(overlapLeft, overlapRight, overlapTop, overlapBottom);

      if (minOverlap === overlapLeft) {
        player.x -= overlapLeft;
      } else if (minOverlap === overlapRight) {
        player.x += overlapRight;
      } else if (minOverlap === overlapTop) {
        player.y -= overlapTop;
      } else if (minOverlap === overlapBottom) {
        player.y += overlapBottom;
      }
    }
  }
}

function checkCoinCollection() {
  for (let i = 0; i < coins.length; i++) {
    if (coins[i].collected) continue;

    let d = dist(player.x, player.y, coins[i].x, coins[i].y);

    if (d < TILE_SIZE * 0.6) {
      coins[i].collected = true;
      coinsCollected++;
    }
  }
}

function checkExit() {
  if (coinsCollected < coins.length) return;

  for (let row = 0; row < MAZE.length; row++) {
    for (let col = 0; col < MAZE[row].length; col++) {
      if (MAZE[row][col] === 4) {
        let exitX = col * TILE_SIZE + TILE_SIZE / 2 + MAZE_OFFSET_X;
        let exitY = row * TILE_SIZE + TILE_SIZE / 2 + MAZE_OFFSET_Y;

        if (dist(player.x, player.y, exitX, exitY) < TILE_SIZE * 0.6) {
          gameWon = true;
        }
      }
    }
  }
}

function animateSprite() {
  if (player.isMoving) {
    player.frameTimer++;

    if (player.frameTimer >= SPRITE.animSpeed) {
      player.frameTimer = 0;
      player.currentFrame = (player.currentFrame + 1) % SPRITE.numFrames;
    }
  } else {
    player.currentFrame = 0;
    player.frameTimer = 0;
  }
}

function drawCharacter() {
  let row = SPRITE.rows[player.direction];
  let offset = SPRITE.offsets[player.direction];

  let sx = player.currentFrame * SPRITE.frameWidth + offset.x;
  let sy = row * SPRITE.frameHeight + offset.y;

  let dw = SPRITE.frameWidth * SPRITE.scale;
  let dh = SPRITE.frameHeight * SPRITE.scale;

  image(
    characterSheet,
    player.x,
    player.y,
    dw,
    dh,
    sx,
    sy,
    SPRITE.frameWidth,
    SPRITE.frameHeight
  );
}

function drawHUD() {
  noStroke();
  fill(255);
  textSize(14);
  textAlign(LEFT);
  textFont("monospace");
  text("Keys: " + coinsCollected + " / " + coins.length, 10, 20);

  if (coinsCollected === coins.length) {
    fill(30, 200, 120);
    text("Exit is open! Find the green tile.", 10, 40);
  }
}

function drawWinScreen() {
  fill(0, 0, 0, 160);
  rectMode(CORNER);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER);
  textSize(48);
  text("You Escaped!", width / 2, height / 2 - 20);

  textSize(16);
  fill(180);
  text("All keys collected", width / 2, height / 2 + 20);
}

