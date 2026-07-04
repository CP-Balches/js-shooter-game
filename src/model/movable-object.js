import { Canvas } from "/src/canvas/canvas.js";

export class MovableObject {
  constructor(position, direction, radius, speed, color) {
    this._lastPosition = position;
    this._position = position;
    this._direction = direction;
    this._radius = radius;
    this._speed = speed;
    this._color = color;
  }

  get lastPosition() {
    return this._lastPosition;
  }

  get position() {
    return this._position;
  }

  set position(value) {
    this._lastPosition = this._position;
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
    Canvas.instance.drawCircle(this.position, this.radius, this.color);
  }

  collidesWith(object) {
    const sumRadius = this.radius + object.radius;
    if (this.lastPosition === null || object.lastPosition === null) {
      return this.position.distance(object.position) <= sumRadius;
    }

    const displacement = this.position.sub(this.lastPosition);
    const objectDisplacement = object.position.sub(object.lastPosition);
    const deltaDisplacement = objectDisplacement.sub(displacement);
    if (deltaDisplacement.x === 0 && deltaDisplacement.y === 0) {
      return this.position.distance(object.position) <= sumRadius;
    }

    const deltaDisplacementSquaredMagnitude =
      Math.pow(deltaDisplacement.x, 2) + Math.pow(deltaDisplacement.y, 2);
    const deltaPosition = object.lastPosition.sub(this.lastPosition);
    const deltaPositionSquaredMagnitude =
      Math.pow(deltaPosition.x, 2) + Math.pow(deltaPosition.y, 2);
    const dotProduct = deltaPosition.dotProduct(deltaDisplacement);
    const discriminant =
      Math.pow(dotProduct, 2) -
      deltaDisplacementSquaredMagnitude *
        (deltaPositionSquaredMagnitude - Math.pow(sumRadius, 2));
    if (discriminant < 0) {
      return false;
    }

    const sqrtDiscriminant = Math.sqrt(discriminant);
    const collisionTime1 =
      (-dotProduct - sqrtDiscriminant) / deltaDisplacementSquaredMagnitude;
    if (collisionTime1 >= 0 && collisionTime1 <= 1) {
      return true;
    }

    const collisionTime2 =
      (-dotProduct + sqrtDiscriminant) / deltaDisplacementSquaredMagnitude;
    return collisionTime2 >= 0 && collisionTime2 <= 1;
  }
}
