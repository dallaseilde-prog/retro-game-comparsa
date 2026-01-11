const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 360;

const player = {
    x: 50,
    y: 50,
    width: 32,
    height: 32,
    color: 'dodgerblue',
    vx: 0,
    vy: 0,
    speed: 5,
    jumpForce: 10,
    gravity: 0.5,
    grounded: false
};

const keys = {};

window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

function update() {
    // Horizontal movement
    if (keys['ArrowLeft'] || keys['KeyA']) player.vx = -player.speed;
    else if (keys['ArrowRight'] || keys['KeyD']) player.vx = player.speed;
    else player.vx = 0;

    // Jump
    if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && player.grounded) {
        player.vy = -player.jumpForce;
        player.grounded = false;
    }

    // Apply gravity
    player.vy += player.gravity;
    
    // Apply movement
    player.x += player.vx;
    player.y += player.vy;

    // Simple floor collision
    const floorY = canvas.height - 32;
    if (player.y + player.height > floorY) {
        player.y = floorY - player.height;
        player.vy = 0;
        player.grounded = true;
    }

    // Bounds check
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw floor
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, canvas.height - 32, canvas.width, 32);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
