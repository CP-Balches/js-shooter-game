import { Canvas } from "/src/canvas/canvas.js";
import { Vector2 } from "/src/data-types/vector-2.js";
import { Player } from "/src/model/player.js";
import { Bullet } from "/src/model/bullet.js";
import { Enemy } from "/src/model/enemy.js";
import { EventPublisher } from "/src/events/event-publisher.js";

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

    this._canvas = new Canvas();
    this._player = new Player();
    this._bullets = [];
    this._enemies = [];
    this._eventPublisher = new EventPublisher();
    this._eventPublisher.addSubscriber(this);
    this._lastTimestamp = null;
    this._renderLoop = this._render.bind(this);
    this._isRunning = false;
    this._nextEnemySpawnTimestamp = 0;
    this._maxEnemySpawnCooldown = 3;

    Game._instance = this;
    return this;
  }

  static get instance() {
    return Game._instance;
  }

  get isRunning() {
    return this._isRunning;
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

  _render(timestamp) {
    this._canvas.clear();
    this._update(timestamp);
    this._renderObjects();

    this._lastTimestamp = timestamp;
    requestAnimationFrame(this._renderLoop);
  }

  _update(timestamp) {
    const lastTimestamp = this._lastTimestamp ?? timestamp;
    const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.033);

    this._player.update(dt);
    this._updateBullets(dt);
    this._updateEnemies(dt);

    if (timestamp >= this._nextEnemySpawnTimestamp) {
      this._spawnEnemy();
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
      enemy.direction = this._player.position.sub(enemy.position).normalize();
      enemy.update(dt);

      if (enemy.collidesWith(this._player)) {
        this._player.health -= enemy.damage;
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
    const minDistance = this._canvas.size.magnitude;
    const distance = minDistance * (1 + Math.random());
    const angle = Math.random() * 2 * Math.PI;
    const x = distance * Math.cos(angle);
    const y = distance * Math.sin(angle);
    const position = new Vector2(x, y);
    const direction = this._player.position.sub(position).normalize();
    const radius =
      enemyLimits.minRadius +
      (enemyLimits.maxRadius - enemyLimits.minRadius) * Math.random();
    const speed =
      enemyLimits.minSpeed +
      (enemyLimits.maxSpeed - enemyLimits.minSpeed) *
        ((enemyLimits.maxRadius - radius) /
          (enemyLimits.maxRadius - enemyLimits.minRadius));
    const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    const damage =
      enemyLimits.minDamage +
      (enemyLimits.maxDamage - enemyLimits.minDamage) *
        ((radius - enemyLimits.minRadius) /
          (enemyLimits.maxRadius - enemyLimits.minRadius));
    const enemy = new Enemy(position, direction, radius, speed, color, damage);
    this._enemies.push(enemy);

    this._nextEnemySpawnTimestamp +=
      Math.random() * this._maxEnemySpawnCooldown * 1000;
  }

  _renderObjects() {
    this._player.render();
    for (const bullet of this._bullets) {
      bullet.render();
    }
    for (const enemy of this._enemies) {
      enemy.render();
    }
  }
}
