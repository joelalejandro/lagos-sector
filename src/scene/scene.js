export default class Scene {
  constructor(options) {
    this.__meta__ = options;
    this.__meta__.pointer = {};
    this.renderTo(window.document.body);
  }

  destroy() {
    this.__element__.remove();
    this.__meta__.isDestroyed = true;
  }

  renderTo(target) {
    const dom = target.ownerDocument;
    const scene = dom.createElement('scene');

    scene.setAttribute('background', this.__meta__.background);
    scene.controllerObject = this;

    target.appendChild(scene);
    this.__element__ = scene;

    this.canPointerMove = true;
  }

  bindCapturePointerEvent() {
    this.__element__.addEventListener('mouseenter', this.executePointerLockRequest.bind(this), false);
    this.__element__.addEventListener('mousemove', this.savePointerData.bind(this), false);
    window.addEventListener('focus', this.allowSavingPointerData.bind(this), false);
    window.addEventListener('blur', this.preventSavingPointerData.bind(this), false);
  }

  executePointerLockRequest() {
    this.allowSavingPointerData();
  }

  allowSavingPointerData() {
    this.canPointerMove = true;
    this.__element__.requestPointerLock();
  }

  preventSavingPointerData() {
    this.canPointerMove = false;
    this.__element__.ownerDocument.exitPointerLock();
  }

  savePointerData(event) {
    if (this.canPointerMove) {
      this.__meta__.pointer = {
        absolute: {
          x: event.x,
          y: event.y,
        },
        relative: {
          x: event.movementX || 0,
          y: event.movementY || 0
        }
      };
    }
  }

  getPointerData() {
    return this.__meta__.pointer;
  }
}
