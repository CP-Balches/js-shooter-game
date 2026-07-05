export class EventPublisher {
  constructor() {
    if (EventPublisher._instance) {
      return EventPublisher._instance;
    }

    this._subscribers = new Set();
    this._keysPressed = new Set();

    window.addEventListener("resize", this._onResize.bind(this));
    window.addEventListener("keydown", this._onKeyDown.bind(this));
    window.addEventListener("keyup", this._onKeyUp.bind(this));
    window.addEventListener("mousedown", this._onMouseDown.bind(this));
    window.addEventListener("blur", this._onBlur.bind(this));

    EventPublisher._instance = this;
    return this;
  }

  static get instance() {
    return new EventPublisher();
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
    const parsedEvent = this._keyEventToLowercase(event);

    for (const subscriber of this._subscribers) {
      if (typeof subscriber.onKeyDown === "function") {
        subscriber.onKeyDown(parsedEvent);
      }
    }

    this.keysPressed.add(parsedEvent.key);
  }

  _onKeyUp(event) {
    const parsedEvent = this._keyEventToLowercase(event);

    for (const subscriber of this._subscribers) {
      if (typeof subscriber.onKeyUp === "function") {
        subscriber.onKeyUp(parsedEvent);
      }
    }

    this.keysPressed.delete(parsedEvent.key);
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

  _onBlur() {
    this.keysPressed.clear();

    for (const subscriber of this._subscribers) {
      if (typeof subscriber.onBlur === "function") {
        subscriber.onBlur();
      }
    }
  }

  onPlayerShot(bullet) {
    for (const subscriber of this._subscribers) {
      if (typeof subscriber.onPlayerShot === "function") {
        subscriber.onPlayerShot(bullet);
      }

      if (typeof subscriber.onBulletCreated === "function") {
        subscriber.onBulletCreated(bullet);
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

  _keyEventToLowercase(event) {
    return {
      ...event,
      key: event.key?.toLowerCase(),
    };
  }
}
