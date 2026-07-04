import { MovableObject } from "/src/model/movable-object.js";

const radius = 20;
const speed = 5000;
const color = "red";
const maxLifetime = 2;

export class Bullet extends MovableObject {
  constructor(position, direction) {
    super(position, direction, radius, speed, color);
    this._lifetime = maxLifetime;
  }

  get lifetime() {
    return this._lifetime;
  }

  update(dt) {
    super.update(dt);
    this._lifetime -= dt;
  }
}
