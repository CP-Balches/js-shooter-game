import { Canvas } from "/src/canvas/canvas.js";
import { Vector2 } from "/src/data-types/vector-2.js";
import { Player } from "/src/model/player.js";
import { Bullet } from "/src/model/bullet.js";
import { EventPublisher } from "/src/events/event-publisher.js";

export class Game {
  constructor() {
    if (Game.instance) {
      return Game.instance;
    }

    this._canvas = new Canvas();
    this._player = new Player();
    this._bullets = [];
    this._eventPublisher = new EventPublisher();
    this._eventPublisher.addSubscriber(this);
    this._lastTimestamp = null;
    this._renderLoop = this._render.bind(this);
    this._isRunning = false;

    Game.instance = this;
    return this;
  }

  start() {
    if (!this._isRunning) {
      this._isRunning = true;
      requestAnimationFrame(this._renderLoop);
    }
  }

  onBulletCreated(bullet) {
    this._bullets.push(bullet);
  }

  _render(timestamp) {
    const lastTimestamp = this._lastTimestamp ?? timestamp;
    const dt = (timestamp - lastTimestamp) / 1000;

    this._canvas.clear();
    this._renderFrame(dt);

    this._lastTimestamp = timestamp;
    requestAnimationFrame(this._renderLoop);
  }

  _renderFrame(dt) {
    this._player.render(dt);

    this._bullets = this._bullets.filter((bullet) => bullet.lifetime > 0);
    for (const bullet of this._bullets) {
      bullet.render(dt);
    }
  }
}
