const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

// Jugador
const player = { x: 50, y: 300, width: 40, height: 60, color: '#ff5733', speed: 5 };

// Latas
let cans = [];
for (let i = 0; i < 10; i++) {
  cans.push({ x: Math.random() * 550 + 20, y: Math.random() * 300 + 20, width: 20, height: 30, color: '#ffd700' });
}

// Bolsito y puntaje
let bagCount = 0;
let totalScore = 0;
let recyclePointVisible = false;

// Teclas
const keys = {};

// Escucha teclas
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function update() {
  // Mover jugador
  if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
  if (keys['ArrowDown'] && player.y + player.height < canvas.height) player.y += player.speed;
  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x + player.width < canvas.width) player.x += player.speed;

  // Revisar colisión con latas
  cans.forEach((can, index) => {
    if (player.x < can.x + can.width &&
        player.x + player.width > can.x &&
        player.y < can.y + can.height &&
        player.y + player.height > can.y) {
      cans.splice(index, 1);
      bagCount++;
      totalScore++;
      if (bagCount >= 10) recyclePointVisible = true;
    }
  });

  // Reinicio al llegar a 30 latas
  if (totalScore >= 30) {
    alert("¡Eres un gran recolector!");
    bagCount = 0;
    totalScore = 0;
    recyclePointVisible = false;
    // Generar nuevas latas
    cans = [];
    for (let i = 0; i < 10; i++) {
      cans.push({ x: Math.random() * 550 + 20, y: Math.random() * 300 + 20, width: 20, height: 30, color: '#ffd700' });
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar jugador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Dibujar latas
  cans.forEach(can => {
    ctx.fillStyle = can.color;
    ctx.fillRect(can.x, can.y, can.width, can.height);
  });

  // Dibujar bolsito
  ctx.fillStyle = 'brown';
  ctx.fillRect(player.x + player.width / 2 - 10, player.y + player.height, 20, bagCount * 3); // tamaño crece con latas

  // Punto de reciclaje
  if (recyclePointVisible) {
    ctx.fillStyle = 'green';
    ctx.fillRect(canvas.width - 50, canvas.height - 70, 40, 60);
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText('Recicla', canvas.width - 50, canvas.height - 75);
  }

  // Mostrar puntaje
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText(`Latas recogidas: ${totalScore}`, 10, 20);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
