import { MovableObject } from "/src/model/movable-object.js";
import { Vector2 } from "/src/data-types/vector-2.js";
import { EventPublisher } from "/src/events/event-publisher.js";
import { Bullet } from "/src/model/bullet.js";
import { Canvas } from "/src/canvas/canvas.js";
import { Color } from "/src/data-types/color.js";
import { Game } from "/src/model/game.js";
import { HealthBar } from "/src/hud/health-bar.js";

const initialPosition = Canvas.instance.center;
const initialDirection = Vector2.zero();
const radius = 50;
const speed = 1000;
const color = new Color(0, 100, 50);
const maxHealth = 100;
const healthBarColor = new Color(100, 100, 50);
const healthBarBackgroundColor = new Color(0, 100, 50);
const healthBarHeight = 20;
const directions = {
  w: new Vector2(0, -1),
  a: new Vector2(-1, 0),
  s: new Vector2(0, 1),
  d: new Vector2(1, 0),
};

export class Player extends MovableObject {
  constructor() {
    if (Player._instance) {
      return Player._instance;
    }

    super(initialPosition, initialDirection, radius, speed, color);
    this._healthBar = new HealthBar(
      maxHealth,
      healthBarColor,
      healthBarBackgroundColor,
      healthBarHeight,
    );
    EventPublisher.instance.addSubscriber(this);

    Player._instance = this;
    return this;
  }

  static get instance() {
    return new Player();
  }

  get healthBar() {
    return this._healthBar;
  }

  get health() {
    return this.healthBar.health;
  }

  set health(value) {
    this.healthBar.health = value;
  }

  update(dt) {
    super.update(dt);

    const radiusVector = Vector2.fromScalar(this.radius);
    const maxPosition = Canvas.instance.size.sub(
      new Vector2(this.radius, this.radius + healthBarHeight),
    );
    this._position = this.position.clamp(radiusVector, maxPosition);
  }

  render() {
    this._color = new Color(
      this._color.hue,
      (this.health / maxHealth) * 100,
      this._color.lightness,
    );
    super.render();
  }

  onKeyDown(event) {
    if (
      event.key in directions &&
      !EventPublisher.instance.keysPressed.has(event.key)
    ) {
      this.direction = this.direction.add(directions[event.key]);
    }
  }

  onKeyUp(event) {
    if (
      event.key in directions &&
      EventPublisher.instance.keysPressed.has(event.key)
    ) {
      this.direction = this.direction.sub(directions[event.key]);
    }
  }

  onMouseDown(event) {
    if (Game.instance.isRunning) {
      const rect = Canvas.instance.rect;
      const mousePosition = new Vector2(
        event.clientX - rect.left,
        event.clientY - rect.top,
      );
      const direction = mousePosition.sub(this.position).normalize();
      const bullet = new Bullet(this.position, direction);

      EventPublisher.instance.onPlayerShot(bullet);
    }
  }

  onBlur() {
    this.direction = Vector2.zero();
  }
}
