import { Canvas } from "../canvas/canvas.js";
import { Vector2 } from "../data-types/vector-2.js";

export class HealthBar {
  constructor(health, color, backgroundColor, height) {
    this._maxHealth = health;
    this._health = health;
    this._color = color;
    this._backgroundColor = backgroundColor;
    this._height = height;
  }

  get health() {
    return this._health;
  }

  set health(value) {
    this._health = value;
  }

  render() {
    const canvasSize = Canvas.instance.size;
    const position = new Vector2(0, canvasSize.y - this._height);
    const size = new Vector2(
      (this.health / this._maxHealth) * canvasSize.x,
      this._height,
    );
    Canvas.instance.drawRectangle(position, size, this._color);

    const backgroundPosition = new Vector2(position.x + size.x, position.y);
    const backgroundSize = new Vector2(canvasSize.x - size.x, size.y);
    Canvas.instance.drawRectangle(
      backgroundPosition,
      backgroundSize,
      this._backgroundColor,
    );
  }
}
