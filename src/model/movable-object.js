import { Canvas } from "/src/canvas/canvas.js";

export class MovableObject {
  constructor(position, direction, radius, speed, color) {
    this._canvas = new Canvas();
    this._position = position;
    this._direction = direction;
    this._radius = radius;
    this._speed = speed;
    this._color = color;
  }

  get position() {
    return this._position;
  }

  set position(value) {
    this._position = value;
  }

  get direction() {
    return this._direction;
  }

  set direction(value) {
    this._direction = value;
  }

  get radius() {
    return this._radius;
  }

  get color() {
    return this._color;
  }

  get speed() {
    return this._speed;
  }

  update(dt) {
    this.position = this.position.add(
      this.direction.scalarMult(this.speed * dt),
    );
  }

  render() {
    this._canvas.drawCircle(this.position, this.radius, this.color);
  }

  collidesWith(object) {
    return (
      this.position.distance(object.position) <= this.radius + object.radius
    );
  }
}
