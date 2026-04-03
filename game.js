const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// Player
let player = {
  x: 200,
  y: canvas.height - 150,
  size: 30,
  velocityY: 0,
  jumping: false
};

const ground = canvas.height - 120;

// Joystick
const joystick = {
  baseX: 100,
  baseY: canvas.height - 120,
  baseRadius: 60,
  knobRadius: 30,
  active: false,
  dx: 0
};

// Jump button
const jumpBtn = document.getElementById("jumpBtn");
jumpBtn.onclick = () => {
  if (!player.jumping) {
    player.velocityY = -12;
    player.jumping = true;
  }
};

// Touch controls
canvas.addEventListener("touchstart", (e) => {
  let t = e.touches[0];
  let dx = t.clientX - joystick.baseX;
  let dy = t.clientY - joystick.baseY;

  if (Math.sqrt(dx * dx + dy * dy) < joystick.baseRadius) {
    joystick.active = true;
  }
});

canvas.addEventListener("touchmove", (e) => {
  if (!joystick.active) return;
  joystick.dx = e.touches[0].clientX - joystick.baseX;
});

canvas.addEventListener("touchend", () => {
  joystick.active = false;
  joystick.dx = 0;
});

// Movement
function movePlayer() {
  if (joystick.dx > 20) player.x += 4;
  if (joystick.dx < -20) player.x -= 4;
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

// 🔥 Draw 3D block
function drawBlock(x, y, size) {
  // Front
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(x, y, size, size);

  // Top
  ctx.fillStyle = "#81C784";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 10, y - 10);
  ctx.lineTo(x + size + 10, y - 10);
  ctx.lineTo(x + size, y);
  ctx.fill();

  // Side
  ctx.fillStyle = "#388E3C";
  ctx.beginPath();
  ctx.moveTo(x + size, y);
  ctx.lineTo(x + size + 10, y - 10);
  ctx.lineTo(x + size + 10, y + size - 10);
  ctx.lineTo(x + size, y + size);
  ctx.fill();
}

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ground blocks
  for (let i = 0; i < canvas.width; i += 40) {
    drawBlock(i, ground + 30, 40);
  }

  // Player (as cube)
  drawBlock(player.x, player.y, player.size);

  // Joystick
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(joystick.baseX, joystick.baseY, joystick.baseRadius, 0, Math.PI * 2);
  ctx.fill();

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

// Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
