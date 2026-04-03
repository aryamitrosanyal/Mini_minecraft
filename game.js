const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// Bigger joystick settings
const joystick = {
  baseX: 100,
  baseY: canvas.height - 120,
  baseRadius: 60,
  knobRadius: 30,
  active: false,
  dx: 0
};

let player = {
  x: 100,
  y: canvas.height - 150,
  size: 30,
  velocityY: 0,
  jumping: false
};

// Ground level
const ground = canvas.height - 120;

// Jump button
const jumpBtn = document.getElementById("jumpBtn");
jumpBtn.onclick = () => {
  if (!player.jumping) {
    player.velocityY = -12;
    player.jumping = true;
  }
};

// Touch joystick
canvas.addEventListener("touchstart", (e) => {
  let touch = e.touches[0];
  let dx = touch.clientX - joystick.baseX;
  let dy = touch.clientY - joystick.baseY;

  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < joystick.baseRadius) {
    joystick.active = true;
  }
});

canvas.addEventListener("touchmove", (e) => {
  if (!joystick.active) return;

  let touch = e.touches[0];
  joystick.dx = touch.clientX - joystick.baseX;
});

canvas.addEventListener("touchend", () => {
  joystick.active = false;
  joystick.dx = 0;
});

// Movement (LESS sensitive)
function movePlayer() {
  if (joystick.dx > 20) {
    player.x += 4;
  } else if (joystick.dx < -20) {
    player.x -= 4;
  }
}

// Physics
function update() {
  movePlayer();

  player.y += player.velocityY;
  player.velocityY += 0.5;

  if (player.y > ground) {
    player.y = ground;
    player.jumping = false;
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ground
  ctx.fillStyle = "green";
  ctx.fillRect(0, ground + player.size, canvas.width, 50);

  // Player
  ctx.fillStyle = "black";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Joystick base
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(joystick.baseX, joystick.baseY, joystick.baseRadius, 0, Math.PI * 2);
  ctx.fill();

  // Joystick knob
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(
    joystick.baseX + Math.max(-40, Math.min(40, joystick.dx)),
    joystick.baseY,
    joystick.knobRadius,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.globalAlpha = 1;
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
