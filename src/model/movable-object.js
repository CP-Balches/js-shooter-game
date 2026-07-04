import { Canvas } from "/src/canvas/canvas.js";

export class MovableObject {
  constructor(position, radius, speed, color) {
    this._canvas = new Canvas();
    this._position = position;
    this._radius = radius;
    this._speed = speed;
    this._color = color;
  }

  get position() {
    return this._position;
  }

  move(direction, dt) {
    this._position = this._position.add(direction.scalarMult(this._speed * dt));
  }

  render() {
    this._canvas.drawCircle(this._position, this._radius, this._color);
  }
}
