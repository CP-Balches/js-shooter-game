import { MovableObject } from "/src/model/movable-object.js";

export class Bullet extends MovableObject {
  constructor(position, direction) {
    super(position, 20, 5000, "red");
    this._direction = direction;
    this._lifetime = 2;
  }

  get lifetime() {
    return this._lifetime;
  }

  _move(dt) {
    super.move(this._direction, dt);
  }

  render(dt) {
    this._move(dt);
    super.render();
    this._lifetime -= dt;
  }
}
