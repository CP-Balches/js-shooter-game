import { MovableObject } from "/src/model/movable-object.js";
import { Vector2 } from "/src/data-types/vector-2.js";
import { EventPublisher } from "/src/events/event-publisher.js";
import { Bullet } from "/src/model/bullet.js";
import { Canvas } from "/src/canvas/canvas.js";

const canvas = new Canvas();
const initialPosition = canvas.size.scalarMult(0.5);
const initialDirection = Vector2.zero();
const radius = 50;
const speed = 1000;
const color = "red";
const maxHealth = 100;
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

    super(initialPosition, initialDirection, radius, speed, color);
    this._health = maxHealth;
    this._eventPublisher = new EventPublisher();
    this._eventPublisher.addSubscriber(this);

    Player._instance = this;
    return this;
  }

  static get instance() {
    return Player._instance;
  }

  get health() {
    return this._health;
  }

  set health(value) {
    this._health = value;
  }

  update(dt) {
    super.update(dt);

    const radiusVector = Vector2.fromScalar(this.radius);
    const maxPos = this._canvas.size.sub(radiusVector);
    this.position = this.position.clamp(radiusVector, maxPos);
  }

  onKeyDown(event) {
    if (
      event.key in directions &&
      !this._eventPublisher.keysPressed.has(event.key)
    ) {
      this.direction = this.direction.add(directions[event.key]);
    }
  }

  onKeyUp(event) {
    if (
      event.key in directions &&
      this._eventPublisher.keysPressed.has(event.key)
    ) {
      this.direction = this.direction.sub(directions[event.key]);
    }
  }

  onMouseDown(event) {
    const rect = this._canvas.rect;
    const mousePos = new Vector2(
      event.clientX - rect.left,
      event.clientY - rect.top,
    );
    const direction = mousePos.sub(this.position).normalize();
    const bullet = new Bullet(this.position, direction);
    this._eventPublisher.onBulletCreated(bullet);
  }

  onBlur() {
    this.direction = new Vector2(0, 0);
  }
}
