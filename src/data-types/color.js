export class Color {
  constructor(hue, saturation, lightness, alpha) {
    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
    this.alpha = alpha ?? 1;
  }

  get hue() {
    return this._hue;
  }

  set hue(value) {
    this._hue = value;
  }

  get saturation() {
    return this._saturation;
  }

  set saturation(value) {
    this._saturation = value;
  }

  get lightness() {
    return this._lightness;
  }

  set lightness(value) {
    this._lightness = value;
  }

  get alpha() {
    return this._alpha;
  }

  set alpha(value) {
    this._alpha = value;
  }

  clone() {
    return new Color(this.hue, this.saturation, this.lightness, this.alpha);
  }

  toString() {
    return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
  }
}
