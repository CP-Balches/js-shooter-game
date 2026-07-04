import { EventPublisher } from "/src/events/event-publisher.js";
import { Vector2 } from "/src/data-types/vector-2.js";

export class Canvas {
  constructor(size) {
    if (Canvas.instance) {
      return Canvas.instance;
    }

    this._createCanvas(size);
    this._context = this._canvas.getContext("2d");
    this._eventPublisher = new EventPublisher();
    this._eventPublisher.addSubscriber(this);

    Canvas.instance = this;
    return this;
  }

  get size() {
    return new Vector2(this._canvas.width, this._canvas.height);
  }

  set size(value) {
    this._canvas.width = value.x;
    this._canvas.height = value.y;
  }

  get rect() {
    return this._canvas.getBoundingClientRect();
  }

  addSubscriber(subscriber) {
    this._subscribers.add(subscriber);
  }

  removeSubscriber(subscriber) {
    this._subscribers.delete(subscriber);
  }

  clear() {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  drawCircle(position, radius, color) {
    this._context.fillStyle = color;
    this._context.beginPath();
    this._context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    this._context.fill();
  }

  onResize() {
    this.size = new Vector2(window.innerWidth, window.innerHeight);
  }

  _createCanvas(size) {
    const canvas = document.createElement("canvas");
    canvas.width = size ? size.x : window.innerWidth;
    canvas.height = size ? size.y : window.innerHeight;
    document.body.appendChild(canvas);

    this._canvas = canvas;
  }
}
