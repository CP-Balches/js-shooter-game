import { Canvas } from "/src/canvas/canvas.js";
import { Color } from "/src/data-types/color.js";

const defaultPosition = Canvas.instance.center;
const defaultSize = 100;
const defaultColor = new Color(0, 0, 100);
const defaultFadeTime = 0;

export class Text {
  constructor(
    text,
    {
      position,
      size,
      color,
      isXPositionPercentage,
      isYPositionPercentage,
      fadeInTime,
      fadeOutTime,
    } = {},
  ) {
    this._text = text;
    this._position = position ?? defaultPosition;
    this._size = size ?? defaultSize;
    this._color = color ?? defaultColor;
    this._isXPositionPercentage = isXPositionPercentage || !position;
    this._isYPositionPercentage = isYPositionPercentage || !position;
    this._alpha = this._color.alpha;
    this._dalpha = 0;
    this._fadeInTime = fadeInTime ?? defaultFadeTime;
    this._fadeOutTime = fadeOutTime ?? defaultFadeTime;
    this._fadeTime = null;
    this._onFadedIn = null;
    this._onFadedOut = null;
  }

  update(dt) {
    if (this._dalpha !== 0) {
      this._alpha += (this._dalpha * dt) / this._fadeTime;

      if (this._alpha < 0) {
        this._alpha = 0;
        this._dalpha = 0;

        if (this._onFadedOut) {
          this._onFadedOut();
        }
      } else if (this._alpha > 1) {
        this._alpha = 1;
        this._dalpha = 0;

        if (this._onFadedIn) {
          this._onFadedIn();
        }
      }
    }
  }

  render() {
    const alphaColor = this._color.clone();
    alphaColor.alpha = this._alpha;
    const canvasSize = Canvas.instance.size;
    const position = this._position.clone();

    if (this._isXPositionPercentage) {
      position.x *= canvasSize.x;
    }

    if (this._isYPositionPercentage) {
      position.y *= canvasSize.y;
    }

    Canvas.instance.drawText(this._text, this._size, alphaColor, position);
  }

  fadeIn(onFadedIn) {
    if (this._fadeInTime === 0) {
      this._alpha = 1;
    } else {
      this._alpha = 0;
      this._dalpha = 1;
      this._fadeTime = this._fadeInTime;
      this._onFadedIn = onFadedIn ?? null;
    }
  }

  fadeOut(onFadedOut) {
    if (this._fadeOutTime === 0) {
      this._alpha = 0;
    } else {
      this._alpha = 1;
      this._dalpha = -1;
      this._fadeTime = this._fadeOutTime;
      this._onFadedOut = onFadedOut ?? null;
    }
  }
}
