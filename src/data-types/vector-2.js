export class Vector2 {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get magnitude() {
    return Math.hypot(this._x, this._y);
  }

  add(other) {
    return new Vector2(this._x + other._x, this._y + other._y);
  }

  sub(other) {
    return new Vector2(this._x - other._x, this._y - other._y);
  }

  mult(other) {
    return new Vector2(this._x * other._x, this._y * other._y);
  }

  scalarMult(scalar) {
    return new Vector2(this._x * scalar, this._y * scalar);
  }

  clamp(min, max) {
    return new Vector2(
      Math.min(Math.max(this._x, min._x), max._x),
      Math.min(Math.max(this._y, min._y), max._y),
    );
  }

  normalize() {
    return this.magnitude === 0
      ? new Vector2(0, 0)
      : new Vector2(this._x / this.magnitude, this._y / this.magnitude);
  }

  toString() {
    return `(${this._x}, ${this._y})`;
  }
}
