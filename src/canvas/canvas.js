import { EventPublisher } from "../events/event-publisher.js";
import { Vector2 } from "../data-types/vector-2.js";
import { Game } from "../model/game.js";
import { Color } from "../data-types/color.js";

export class Canvas {
  constructor(size) {
    if (Canvas._instance) {
      return Canvas._instance;
    }

    this._createCanvas(size);
    this._context = this._canvas.getContext("2d");
    EventPublisher.instance.addSubscriber(this);

    Canvas._instance = this;
    return this;
  }

  static get instance() {
    return new Canvas();
  }

  get size() {
    return new Vector2(this._canvas.width, this._canvas.height);
  }

  set size(value) {
    this._canvas.width = value.x;
    this._canvas.height = value.y;
  }

  get center() {
    return this.size.scalarMult(0.5);
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

  drawRectangle(position, size, color) {
    this._setColor(color);
    this._context.fillRect(position.x, position.y, size.x, size.y);
  }

  drawCircle(position, radius, color) {
    this._setColor(color);
    this._context.beginPath();
    this._context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    this._context.fill();
  }

  drawText(text, size, color, position, align) {
    this._context.fillStyle = color.toString();
    this._context.font = `${size}px sans-serif`;
    this._context.textAlign = align ?? "center";

    const textHeight = this._context.measureText(text).actualBoundingBoxAscent;
    this._context.fillText(text, position.x, position.y + textHeight / 2);
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

  _setColor(color) {
    const fillColor = Game.instance.isRunning
      ? color
      : new Color(color.hue, 20, color.lightness);
    this._context.fillStyle = fillColor.toString();
  }
}
