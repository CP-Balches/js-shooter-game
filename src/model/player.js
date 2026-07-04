import { MovableObject } from "/src/model/movable-object.js";
import { Vector2 } from "/src/data-types/vector-2.js";
import { EventPublisher } from "/src/events/event-publisher.js";
import { Bullet } from "/src/model/bullet.js";
import { Canvas } from "/src/canvas/canvas.js";

const directions = {
  w: new Vector2(0, -1),
  a: new Vector2(-1, 0),
  s: new Vector2(0, 1),
  d: new Vector2(1, 0),
};

export class Player extends MovableObject {
  constructor() {
    if (Player.instance) {
      return Player.instance;
    }

    const canvas = new Canvas();
    const initialPos = canvas.size.scalarMult(0.5);
    super(initialPos, 50, 1000, "red");
    this._direction = new Vector2(0, 0);
    this._eventPublisher = new EventPublisher();
    this._eventPublisher.addSubscriber(this);

    Player.instance = this;
    return this;
  }

  get direction() {
    return this._direction;
  }

  set direction(value) {
    this._direction = value;
  }

  render(dt) {
    this._move(dt);
    super.render();
  }

  onKeyDown(event) {
    if (
      event.key in directions &&
      !this._eventPublisher.keysPressed.has(event.key)
    ) {
      this._direction = this._direction.add(directions[event.key]);
    }
  }

  onKeyUp(event) {
    if (
      event.key in directions &&
      this._eventPublisher.keysPressed.has(event.key)
    ) {
      this._direction = this._direction.sub(directions[event.key]);
    }
  }

  onMouseDown(event) {
    const rect = this._canvas.rect;
    const mousePos = new Vector2(
      event.clientX - rect.left,
      event.clientY - rect.top,
    );
    const direction = mousePos.sub(this._position).normalize();
    const bullet = new Bullet(this._position, direction);
    this._eventPublisher.onBulletCreated(bullet);
  }

  _move(dt) {
    super.move(this._direction, dt);

    const radiusVector = new Vector2(this._radius, this._radius);
    this._position = this._position.clamp(
      radiusVector,
      this._canvas.size.sub(radiusVector),
    );
  }
}
