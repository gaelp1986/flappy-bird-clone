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
const GRAVITY = 0.5;
const JUMP_STRENGTH = 8;

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
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    const gapBottom = pipe.gapY + pipe.gapHeight;
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
    ctx.fillRect(pipe.x, gapBottom, PIPE_WIDTH, canvas.height - gapBottom);
  });

  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
  ctx.fillStyle = 'yellow';
  ctx.fill();
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
