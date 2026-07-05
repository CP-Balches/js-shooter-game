export class Vector2 {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
  }

  get magnitude() {
    return Math.hypot(this.x, this.y);
  }

  static zero() {
    return this.fromScalar(0);
  }

  static fromScalar(scalar) {
    return new Vector2(scalar, scalar);
  }

  add(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  sub(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  mult(other) {
    return new Vector2(this.x * other.x, this.y * other.y);
  }

  scalarMult(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  dotProduct(other) {
    const mult = this.mult(other);
    return mult.x + mult.y;
  }

  clamp(min, max) {
    return new Vector2(
      Math.min(Math.max(this.x, min.x), max.x),
      Math.min(Math.max(this.y, min.y), max.y),
    );
  }

  normalize() {
    return this.magnitude === 0
      ? Vector2.zero()
      : new Vector2(this.x / this.magnitude, this.y / this.magnitude);
  }

  distance(other) {
    return other.sub(this).magnitude;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}
