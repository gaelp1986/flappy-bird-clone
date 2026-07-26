// ---- Shell: canvas + DOM setup (scaffolded) ----
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score-display');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const highScoreEl = document.getElementById('high-score');

let state = 'start'; // 'start' | 'playing' | 'gameover'

// ---- Core: YOU write this part ----
// bird object (position, velocity, size)
const GRAVITY = 0.5;
const JUMP_STRENGTH = 8;
const bird = {
  x : 80,
  y: canvas.height / 2,
  size: 20

};
// pipes array (position, gap, speed)
// gravity + jump constants

function resetGame() {
  // TODO: reset bird position/velocity, clear pipes, reset score
  bird.y = canvas.height / 2;
  bird.velocity = 0;

}

function update() {
  // TODO: apply gravity to bird velocity, update bird position
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  // TODO: move pipes left, spawn new pipes, despawn off-screen ones
  // TODO: check collisions (bird vs pipes, bird vs ground/ceiling)
  if ( bird.y - bird.size < 0){
    bird.y= bird.size;
    bird.velocity = 0;
  }

  if (bird.y + bird.size > canvas.height){
      bird.y = canvas.height - bird.size;
      bird.velocity = 0;
  }


  // TODO: update score when bird passes a pipe
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // TODO: draw bird
  ctx.beginPath();
  ctx.arc(bird.x,bird.y, bird.size, 0, Math.PI * 2);
  ctx.fillStyle = 'yellow';
  ctx.fill();
  // TODO: draw pipes
}

function gameLoop() {
  if (state === 'playing') {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}

function flap() {
  // TODO: set bird velocity upward
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
