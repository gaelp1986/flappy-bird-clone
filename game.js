// ---- Shell: canvas + DOM setup ----
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score-display');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const highScoreEl = document.getElementById('high-score');

let state = 'start'; // 'start' | 'playing' | 'gameover'

let score = 0;
let highScore = Number(localStorage.getItem('flappyHighScore')) || 0;

// ---- Core: constants ----
const GRAVITY = 0.4;
const JUMP_STRENGTH = 9;

const BASE_GAP_HEIGHT = 150;
const PIPE_MARGIN = 20;
const PIPE_WIDTH = 60;
const BASE_PIPE_SPEED = 3;
const MIN_GAP_HEIGHT = 90;

let pipeSpeed = BASE_PIPE_SPEED;
let gapHeight = BASE_GAP_HEIGHT;

// ---- Core: game state ----
const bird = {
  x: 80,
  y: canvas.height / 2,
  size: 20
};

let pipes = [];

function resetGame() {
  score = 0;
  scoreDisplay.textContent = score;
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  pipeSpeed = BASE_PIPE_SPEED;
  gapHeight = BASE_GAP_HEIGHT;
}

function spawnPipe() {
  const minGapY = PIPE_MARGIN;
  const maxGapY = canvas.height - gapHeight - PIPE_MARGIN;
  const gapY = minGapY + Math.random() * (maxGapY - minGapY);

  pipes.push({ x: canvas.width, gapY: gapY, gapHeight: gapHeight,  passed: false });
}

function update() {
  // apply gravity to bird velocity, update bird position
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  // move pipes left, spawn new pipes, despawn off-screen ones
  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;
  });

  const lastPipe = pipes[pipes.length - 1];
  if (pipes.length === 0 || bird.x > lastPipe.x + PIPE_WIDTH / 2) {
    spawnPipe();
  }

  pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);

  // TODO: check collisions (bird vs pipes)
  const birdLeft = bird.x - bird.size;
  const birdRight = bird.x + bird.size;
  const birdTop = bird.y -bird.size;
  const birdBottom = bird.y + bird.size;
  
  pipes.forEach(pipe =>{
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + PIPE_WIDTH;
    const gapTop = pipe.gapY;
    const gapBottom = pipe.gapY + pipe.gapHeight;
    if ((birdTop < gapTop || birdBottom > gapBottom) && (birdRight > pipeLeft && birdLeft < pipeRight)){
      endGame();
    }
  });

  if (bird.y - bird.size < 0) {
    bird.y = bird.size;
    bird.velocity = 0;
  }

  if (bird.y + bird.size > canvas.height) {
    bird.y = canvas.height - bird.size;
    endGame();
  }

  pipes.forEach(pipe => {
    if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
      pipe.passed = true;
      score++;
      pipeSpeed = BASE_PIPE_SPEED + score * 0.1;
      gapHeight = Math.max(MIN_GAP_HEIGHT, BASE_GAP_HEIGHT - score * 2);
      scoreDisplay.textContent = score;
    }
  });
}

// ---- Shell: rendering ----
ctx.imageSmoothingEnabled = false;

const pipeImg = new Image();
pipeImg.src = 'assets/pipe.png';
const PIPE_SPRITE_WIDTH = 100;
const PIPE_CAP_SOURCE_Y = 345;
const PIPE_CAP_SOURCE_HEIGHT = 55;
const PIPE_BODY_SOURCE_HEIGHT = 345;
const PIPE_CAP_HEIGHT = 16;

const birdFrames = [new Image(), new Image()];
birdFrames[0].src = 'assets/bird1.png';
birdFrames[1].src = 'assets/bird2.png';
let animFrame = 0;

const CLOUDS = [
  { x: 60, y: 60 },
  { x: 220, y: 110 },
  { x: 360, y: 50 },
];

const GROUND_HEIGHT = 10;

function drawClouds() {
  ctx.fillStyle = '#ffffff';
  CLOUDS.forEach(cloud => {
    ctx.fillRect(cloud.x, cloud.y, 40, 12);
    ctx.fillRect(cloud.x + 10, cloud.y - 8, 20, 12);
  });
}

function drawPipeSegment(destX, destTop, destHeight, capAtTop) {
  const bodyHeight = destHeight - PIPE_CAP_HEIGHT;
  const bodyDestY = capAtTop ? destTop + PIPE_CAP_HEIGHT : destTop;
  const capDestY = capAtTop ? destTop : destTop + bodyHeight;

  ctx.drawImage(pipeImg, 0, 0, PIPE_SPRITE_WIDTH, PIPE_BODY_SOURCE_HEIGHT, destX, bodyDestY, PIPE_WIDTH, bodyHeight);
  ctx.drawImage(pipeImg, 0, PIPE_CAP_SOURCE_Y, PIPE_SPRITE_WIDTH, PIPE_CAP_SOURCE_HEIGHT, destX, capDestY, PIPE_WIDTH, PIPE_CAP_HEIGHT);
}

function drawPipe(pipe) {
  const gapBottom = pipe.gapY + pipe.gapHeight;
  drawPipeSegment(pipe.x, 0, pipe.gapY, false);
  drawPipeSegment(pipe.x, gapBottom, canvas.height - gapBottom, true);
}

function drawGround() {
  ctx.fillStyle = '#ded895';
  ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
  ctx.fillStyle = '#c9b458';
  for (let x = 0; x < canvas.width; x += 8) {
    ctx.fillRect(x, canvas.height - GROUND_HEIGHT, 4, 4);
  }
}

function drawBird() {
  const frame = birdFrames[Math.floor(animFrame / 10) % 2];
  ctx.drawImage(frame, bird.x - bird.size, bird.y - bird.size, bird.size * 2, bird.size * 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawClouds();
  pipes.forEach(drawPipe);
  drawGround();
  drawBird();

  animFrame++;
}

function gameLoop() {
  if (state === 'playing') {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}

function flap() {
  bird.velocity = -JUMP_STRENGTH;
}

function handleInput() {
  if (state === 'start') {
    state = 'playing';
    startScreen.classList.add('hidden');
    resetGame();
  } else if (state === 'playing') {
    flap();
  } else if (state === 'gameover') {
    state = 'playing';
    gameOverScreen.classList.add('hidden');
    resetGame();
  }
}

function endGame() {
  state = 'gameover';

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('flappyHighScore', highScore);
  }

  finalScoreEl.textContent = `Score: ${score}`;
  highScoreEl.textContent = `High Score: ${highScore}`;
  gameOverScreen.classList.remove('hidden');
}

canvas.addEventListener('click', handleInput);
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    handleInput();
  }
});

requestAnimationFrame(gameLoop);
