export class Color {
  constructor(hue, saturation, lightness) {
    this._hue = hue;
    this._saturation = saturation;
    this._lightness = lightness;
  }

  get hue() {
    return this._hue;
  }

  get saturation() {
    return this._saturation;
  }

  get lightness() {
    return this._lightness;
  }

  toString() {
    return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
  }
}
