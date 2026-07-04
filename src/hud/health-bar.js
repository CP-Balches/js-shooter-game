import { Canvas } from "/src/canvas/canvas.js";
import { Vector2 } from "/src/data-types/vector-2.js";

export class HealthBar {
  constructor(health, color, height) {
    this._maxHealth = health;
    this._health = health;
    this._color = color;
    this._height = height;
  }

  get health() {
    return this._health;
  }

  set health(value) {
    this._health = value;
  }

  render() {
    const position = new Vector2(0, Canvas.instance.size.y - this._height);
    const size = new Vector2(
      (this.health / this._maxHealth) * Canvas.instance.size.x,
      this._height,
    );
    Canvas.instance.drawRectangle(position, size, this._color);
  }
}
