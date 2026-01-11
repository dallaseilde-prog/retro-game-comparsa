import { Input } from './Input.js';
import { AudioController } from './Audio.js';
import { Tilemap } from './Tilemap.js';
import { LevelManager } from './LevelManager.js';
import { Player } from './Player.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.lastTime = 0;
    this.input = new Input();
    this.audio = new AudioController();
    this.levelManager = new LevelManager();
    this.tilemap = new Tilemap(20);
    this.player = new Player(this);
    
    this.state = 'START';
    this.levelIndex = 0;
    this.score = 0;
    this.totalCoffee = 0;
    this.lives = 3;

    this.uiScore = document.getElementById('score');
    this.uiTotal = document.getElementById('total-coffee');
    this.uiLevel = document.getElementById('level');
    this.overlay = document.getElementById('overlay');
    this.overlayTitle = document.getElementById('overlay-title');
    this.overlayMsg = document.getElementById('overlay-message');

    this.showOverlay('ANDEAN RETRO', 'PRESS ENTER');
  }

  start() {
    this.loadLevel(0);
    requestAnimationFrame((ts) => this.loop(ts));
  }

  loadLevel(index) {
    const level = this.levelManager.getLevel(index);
    if (!level) {
      this.setState('VICTORY');
      return;
    }
    this.levelIndex = index;
    this.totalCoffee = this.tilemap.load(JSON.parse(JSON.stringify(level.map)));
    this.player.reset(level.start.x, level.start.y);
    this.score = 0;
    this.updateHUD();
  }

  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    this.update(Math.min(dt, 0.1));
    this.draw();
    requestAnimationFrame((ts) => this.loop(ts));
  }

  update(dt) {
    if (this.state === 'START') {
      if (this.input.isDown('Enter')) this.setState('PLAYING');
    } else if (this.state === 'PLAYING') {
      this.player.update(dt);
    } else if (this.state === 'GAMEOVER') {
      if (this.input.isDown('KeyR')) {
        this.lives = 3;
        this.loadLevel(0);
        this.setState('PLAYING');
      }
    } else if (this.state === 'VICTORY') {
      if (this.input.isDown('Enter')) {
        this.lives = 3;
        this.loadLevel(0);
        this.setState('START');
      }
    }
  }

  draw() {
    this.ctx.fillStyle = '#222';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.tilemap.draw(this.ctx);
    this.player.draw(this.ctx);
  }

  collectCoffee() {
    this.score++;
    this.audio.playCollect();
    this.updateHUD();
  }

  winLevel() {
    this.audio.playWin();
    if (this.levelIndex + 1 < this.levelManager.levels.length) {
      this.loadLevel(this.levelIndex + 1);
    } else {
      this.setState('VICTORY');
    }
  }

  die() {
    this.audio.playDie();
    this.lives--;
    if (this.lives > 0) {
      const level = this.levelManager.getLevel(this.levelIndex);
      this.player.reset(level.start.x, level.start.y);
    } else {
      this.setState('GAMEOVER');
    }
  }

  setState(newState) {
    this.state = newState;
    if (newState === 'START') this.showOverlay('ANDEAN RETRO', 'PRESS ENTER TO START');
    else if (newState === 'PLAYING') this.hideOverlay();
    else if (newState === 'GAMEOVER') this.showOverlay('GAME OVER', 'PRESS R TO RESTART');
    else if (newState === 'VICTORY') this.showOverlay('VICTORY!', 'ALL LEVELS CLEARED\nPRESS ENTER');
  }

  showOverlay(title, msg) {
    this.overlay.classList.remove('hidden');
    this.overlayTitle.innerText = title;
    this.overlayMsg.innerText = msg;
  }

  hideOverlay() {
    this.overlay.classList.add('hidden');
  }

  updateHUD() {
    this.uiScore.innerText = this.score;
    this.uiTotal.innerText = this.totalCoffee;
    this.uiLevel.innerText = this.levelIndex + 1;
  }
}
