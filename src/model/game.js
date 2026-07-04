import { Canvas } from "/src/canvas/canvas.js";
import { Vector2 } from "/src/data-types/vector-2.js";
import { Player } from "/src/model/player.js";
import { Bullet } from "/src/model/bullet.js";
import { Enemy } from "/src/model/enemy.js";
import { EventPublisher } from "/src/events/event-publisher.js";
import { Color } from "/src/data-types/color.js";
import { Text } from "/src/hud/text.js";

const mainTextSize = 100;
const mainTextColor = new Color(0, 0, 100);
const gameOverColor = new Color(0, 100, 50);
const playerHealthBarHeight = 20;
const enemyLimits = {
  minRadius: 10,
  maxRadius: 100,
  minSpeed: 300,
  maxSpeed: 800,
  minDamage: 10,
  maxDamage: 50,
};

export class Game {
  constructor() {
    if (Game.instance) {
      return Game.instance;
    }

    this._bullets = [];
    this._enemies = [];
    EventPublisher.instance.addSubscriber(this);
    this._lastTimestamp = null;
    this._renderLoop = this._render.bind(this);
    this._isRunning = false;
    this._isGameOver = false;
    this._nextEnemySpawnTimestamp = 0;
    this._maxEnemySpawnCooldown = 3;

    const center = Canvas.instance.size.scalarMult(0.5);
    this._pauseText = new Text("PAUSED", center, mainTextSize, mainTextColor);
    this._gameOverText = new Text(
      "GAME OVER",
      center,
      mainTextSize,
      gameOverColor,
    );

    Game._instance = this;
    return this;
  }

  static get instance() {
    return Game._instance;
  }

  get isRunning() {
    return this._isRunning;
  }

  get isGameOver() {
    return this._isGameOver;
  }

  start() {
    if (!this.isRunning) {
      this._isRunning = true;
      requestAnimationFrame(this._renderLoop);
    }
  }

  onBulletCreated(bullet) {
    this._bullets.push(bullet);
  }

  onKeyDown(event) {
    if (event.key === " ") {
      this._isRunning = !this.isRunning;
      this._renderObjects();
    }
  }

  _render(timestamp) {
    if (this.isRunning && !this.isGameOver) {
      this._update(timestamp);
      this._renderObjects();

      this._lastTimestamp = timestamp;
    }
    requestAnimationFrame(this._renderLoop);
  }

  _update(timestamp) {
    const lastTimestamp = this._lastTimestamp ?? timestamp;
    const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.033);

    Player.instance.update(dt);
    this._updateBullets(dt);
    this._updateEnemies(dt);

    if (timestamp >= this._nextEnemySpawnTimestamp) {
      this._spawnEnemy();
      this._nextEnemySpawnTimestamp =
        timestamp + Math.random() * this._maxEnemySpawnCooldown * 1000;
    }
  }

  _updateBullets(dt) {
    this._bullets = this._bullets.filter((bullet) => bullet.lifetime > 0);
    for (const bullet of this._bullets) {
      bullet.update(dt);
    }
  }

  _updateEnemies(dt) {
    for (let i = 0; i < this._enemies.length; i++) {
      const enemy = this._enemies[i];
      enemy.direction = Player.instance.position
        .sub(enemy.position)
        .normalize();
      enemy.update(dt);

      if (enemy.collidesWith(Player.instance)) {
        Player.instance.health -= enemy.damage;
        if (Player.instance.health <= 0) {
          this._isGameOver = true;
        }
        this._enemies.splice(i, 1);
      } else {
        let j = 0;
        while (
          j < this._bullets.length &&
          !this._bullets[j].collidesWith(enemy)
        ) {
          j++;
        }
        if (j < this._bullets.length) {
          this._bullets.splice(j, 1);
          this._enemies.splice(i, 1);
        }
      }
    }
  }

  _spawnEnemy() {
    const minDistance = Canvas.instance.size.magnitude;
    const distance = minDistance * (1 + 0.5 * Math.random());
    const angle = Math.random() * 2 * Math.PI;
    const x = distance * Math.cos(angle);
    const y = distance * Math.sin(angle);
    const position = new Vector2(x, y);
    const direction = Player.instance.position.sub(position).normalize();
    const radius =
      enemyLimits.minRadius +
      (enemyLimits.maxRadius - enemyLimits.minRadius) * Math.random();
    const speed =
      enemyLimits.minSpeed +
      (enemyLimits.maxSpeed - enemyLimits.minSpeed) *
        ((enemyLimits.maxRadius - radius) /
          (enemyLimits.maxRadius - enemyLimits.minRadius));
    const color = new Color(Math.random() * 360, 100, 50);
    const damage =
      enemyLimits.minDamage +
      (enemyLimits.maxDamage - enemyLimits.minDamage) *
        ((radius - enemyLimits.minRadius) /
          (enemyLimits.maxRadius - enemyLimits.minRadius));
    const enemy = new Enemy(position, direction, radius, speed, color, damage);
    this._enemies.push(enemy);
  }

  _renderObjects() {
    Canvas.instance.clear();

    Player.instance.render();
    this._renderList(this._bullets);
    this._renderList(this._enemies);
    Player.instance.healthBar.render();

    if (!this.isRunning) {
      this._pauseText.render();
    }

    if (this.isGameOver) {
      this._gameOverText.render();
    }
  }

  _renderList(list) {
    for (const element of list) {
      element.render();
    }
  }
}
