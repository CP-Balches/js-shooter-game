export class EventPublisher {
  constructor() {
    if (EventPublisher.instance) {
      return EventPublisher.instance;
    }

    this._subscribers = new Set();
    this._keysPressed = new Set();

    window.addEventListener("resize", this._onResize.bind(this));
    window.addEventListener("keydown", this._onKeyDown.bind(this));
    window.addEventListener("keyup", this._onKeyUp.bind(this));
    window.addEventListener("mousedown", this._onMouseDown.bind(this));

    EventPublisher.instance = this;
    return this;
  }

  get keysPressed() {
    return this._keysPressed;
  }

  addSubscriber(subscriber) {
    this._subscribers.add(subscriber);
  }

  removeSubscriber(subscriber) {
    this._subscribers.delete(subscriber);
  }

  _onResize(event) {
    for (const subscriber of this._subscribers) {
      if (typeof subscriber.onResize === "function") {
        subscriber.onResize(event);
      }
    }
  }

  _onKeyDown(event) {
    for (const subscriber of this._subscribers) {
      if (typeof subscriber.onKeyDown === "function") {
        subscriber.onKeyDown(event);
      }
    }

    this._keysPressed.add(event.key);
  }

  _onKeyUp(event) {
    for (const subscriber of this._subscribers) {
      if (typeof subscriber.onKeyUp === "function") {
        subscriber.onKeyUp(event);
      }
    }

    this._keysPressed.delete(event.key);
  }

  _onMouseDown(event) {
    if (event.button === 0) {
      for (const subscriber of this._subscribers) {
        if (typeof subscriber.onMouseDown === "function") {
          subscriber.onMouseDown(event);
        }
      }
    }
  }

  onBulletCreated(bullet) {
    for (const subscriber of this._subscribers) {
      if (typeof subscriber.onBulletCreated === "function") {
        subscriber.onBulletCreated(bullet);
      }
    }
  }
}
