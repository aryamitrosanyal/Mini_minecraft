const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 500;
canvas.height = 300;

const ctx = canvas.getContext("2d");

let player = {
  x: 50,
  y: 200,
  size: 20,
  velocityY: 0,
  jumping: false
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") player.x += 10;
  if (e.key === "ArrowLeft") player.x -= 10;

  if (e.key === " " && !player.jumping) {
    player.velocityY = -10;
    player.jumping = true;
  }
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
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
