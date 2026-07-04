import { Canvas } from "/src/canvas/canvas.js";

export class Text {
  constructor(text, position, size, color) {
    this._text = text;
    this._position = position;
    this._size = size;
    this._color = color;
  }

  render() {
    Canvas.instance.drawText(
      this._text,
      this._position,
      this._size,
      this._color,
    );
  }
}
