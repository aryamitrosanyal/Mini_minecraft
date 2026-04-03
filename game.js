const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 500;
canvas.height = 300;

const ctx = canvas.getContext("2d");

// Joystick variables
let touchX = null;

let player = {
  x: 50,
  y: 200,
  size: 20,
  velocityY: 0,
  jumping: false
};

// Touch controls
canvas.addEventListener("touchstart", (e) => {
  touchX = e.touches[0].clientX;

  // Tap = jump
  if (!player.jumping) {
    player.velocityY = -10;
    player.jumping = true;
  }
});

canvas.addEventListener("touchmove", (e) => {
  let currentX = e.touches[0].clientX;

  if (currentX < touchX - 10) {
    player.x -= 5; // move left
  } else if (currentX > touchX + 10) {
    player.x += 5; // move right
  }
});

canvas.addEventListener("touchend", () => {
  touchX = null;
});

function update() {
  player.y += player.velocityY;
  player.velocityY += 0.5;

  if (player.y > 200) {
    player.y = 200;
    player.jumping = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Draw joystick base
  ctx.beginPath();
  ctx.arc(60, 240, 30, 0, Math.PI * 2);
  ctx.stroke();

  // Draw joystick knob
  if (touchX !== null) {
    ctx.beginPath();
    ctx.arc(60, 240, 15, 0, Math.PI * 2);
    ctx.fill();
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
