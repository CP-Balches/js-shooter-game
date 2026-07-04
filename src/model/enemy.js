import { MovableObject } from "/src/model/movable-object.js";

export class Enemy extends MovableObject {
  constructor(position, direction, radius, speed, color, damage) {
    super(position, direction, radius, speed, color);
    this._damage = damage;
  }

  get damage() {
    return this._damage;
  }
}
