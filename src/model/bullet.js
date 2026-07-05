import { MovableObject } from "./movable-object.js";
import { Color } from "../data-types/color.js";

const radius = 20;
const speed = 5000;
const maxLifetime = 2;

export class Bullet extends MovableObject {
  constructor(position, direction, color) {
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
