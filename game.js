// ---- Shell: canvas + DOM setup ----
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score-display');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const highScoreEl = document.getElementById('high-score');

let state = 'start'; // 'start' | 'playing' | 'gameover'

// ---- Core: constants ----
const GRAVITY = 0.5;
const JUMP_STRENGTH = 8;

const GAP_HEIGHT = 150;
const PIPE_MARGIN = 20;
const PIPE_WIDTH = 60;
const PIPE_SPEED = 3;

// ---- Core: game state ----
const bird = {
  x: 80,
  y: canvas.height / 2,
  size: 20
};

let pipes = [];

function resetGame() {
  // TODO: reset score
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
}

function spawnPipe() {
  const minGapY = PIPE_MARGIN;
  const maxGapY = canvas.height - GAP_HEIGHT - PIPE_MARGIN;
  const gapY = minGapY + Math.random() * (maxGapY - minGapY);

  pipes.push({ x: canvas.width, gapY: gapY });
}

function update() {
  // apply gravity to bird velocity, update bird position
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  // move pipes left, spawn new pipes, despawn off-screen ones
  pipes.forEach(pipe => {
    pipe.x -= PIPE_SPEED;
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
    const gapBottom = pipe.gapY + GAP_HEIGHT;
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
    bird.velocity = 0;
  }

  // TODO: update score when bird passes a pipe
}

// ---- Shell: rendering ----
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    const gapBottom = pipe.gapY + GAP_HEIGHT;
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
  // TODO: update finalScoreEl / highScoreEl text, persist high score to localStorage
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
