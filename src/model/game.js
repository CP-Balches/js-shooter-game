import { Canvas } from "/src/canvas/canvas.js";
import { Vector2 } from "/src/data-types/vector-2.js";
import { Player } from "/src/model/player.js";
import { Bullet } from "/src/model/bullet.js";
import { Enemy } from "/src/model/enemy.js";
import { EventPublisher } from "/src/events/event-publisher.js";
import { Color } from "/src/data-types/color.js";
import { Text } from "/src/hud/text.js";

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

export const GameStatuses = Object.freeze({
  READY: "READY",
  STARTED: "STARTED",
  PLAYER_MOVED: "PLAYER_MOVED",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  GAME_OVER: "GAME_OVER",
});

const tutorialTextOptions = {
  position: new Vector2(0.5, 150),
  size: 80,
  isXPositionPercentage: true,
};
const TextByStatus = Object.freeze({
  STARTED: new Text("WASD to move", { ...tutorialTextOptions, fadeInTime: 1 }),
  PLAYER_MOVED: new Text("Click to shoot", tutorialTextOptions),
  PAUSED: new Text("PAUSED"),
  GAME_OVER: new Text("GAME OVER", { color: gameOverColor }),
});

export class Game {
  constructor() {
    if (Game._instance) {
      return Game._instance;
    }

    this._bullets = [];
    this._enemies = [];
    EventPublisher.instance.addSubscriber(this);
    this._lastTimestamp = null;
    this._renderLoop = this._render.bind(this);
    this._text = null;
    this._nextEnemySpawnTimestamp = 0;
    this._maxEnemySpawnCooldown = 3;
    this._onTextUpdated = (newText) => {
      this._text = newText;
      if (this._text) {
        this._text.fadeIn();
      }
    };
    this._updateStatus(GameStatuses.READY);

    Game._instance = this;
    return this;
  }

  static get instance() {
    return new Game();
  }

  get status() {
    return this._status;
  }

  get isRunning() {
    return [
      GameStatuses.STARTED,
      GameStatuses.PLAYER_MOVED,
      GameStatuses.PLAYING,
    ].includes(this.status);
  }

  start() {
    if (this.status === GameStatuses.READY) {
      this._updateStatus(GameStatuses.STARTED);
      requestAnimationFrame(this._renderLoop);
    }
  }

  onPlayerShot(bullet) {
    if (this.status !== GameStatuses.PLAYING) {
      this._updateStatus(GameStatuses.PLAYING);
    }
  }

  onBulletCreated(bullet) {
    this._bullets.push(bullet);
  }

  onKeyDown(event) {
    if (event.key === " ") {
      if (this.status === GameStatuses.PLAYING) {
        this._updateStatus(GameStatuses.PAUSED);
        this._renderObjects();
      } else if (this.status === GameStatuses.PAUSED) {
        this._updateStatus(GameStatuses.PLAYING);
      }
    }
  }

  _render(timestamp) {
    if (this.isRunning) {
      this._update(timestamp);
      this._renderObjects();

      this._lastTimestamp = timestamp;
    }
    requestAnimationFrame(this._renderLoop);
  }

  _update(timestamp) {
    const lastTimestamp = this._lastTimestamp ?? timestamp;
    const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.033);

    if (
      this.status === GameStatuses.STARTED &&
      Player.instance.direction.magnitude > 0
    ) {
      this._updateStatus(GameStatuses.PLAYER_MOVED);
    }

    Player.instance.update(dt);
    this._updateBullets(dt);
    this._updateEnemies(dt);

    if (this._text) {
      this._text.update(dt);
    }

    if (
      this.status === GameStatuses.PLAYING &&
      timestamp >= this._nextEnemySpawnTimestamp
    ) {
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
          this._updateStatus(GameStatuses.GAME_OVER);
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
    const distance = Canvas.instance.size.magnitude;
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

  _updateStatus(newStatus) {
    this._status = newStatus;

    const newText =
      this.status in TextByStatus ? TextByStatus[this.status] : null;
    if (this._text) {
      this._text.fadeOut(() => this._onTextUpdated(newText));
    } else {
      this._onTextUpdated(newText);
    }
  }

  _renderObjects() {
    Canvas.instance.clear();

    Player.instance.render();
    this._renderList(this._bullets);
    this._renderList(this._enemies);
    Player.instance.healthBar.render();

    if (this._text) {
      this._text.render();
    }
  }

  _renderList(list) {
    for (const element of list) {
      element.render();
    }
  }
}
