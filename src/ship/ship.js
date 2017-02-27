import { SkilledEntity } from 'xethya-entity';

export default class Ship extends SkilledEntity {
  get shipClass() {
    return this.__meta__.shipClass;
  }

  set shipClass(className) {
    this.__meta__.shipClass = className;

    if (this.__element__) {
      this.refreshShipSizeCache();
    }
  }

  getPosition() {
    const rect = this.__element__.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top
    }
  }

  get shipSize() {
    return this.__meta__.shipSize;
  }

  refreshShipSizeCache() {
    this.__meta__.shipSize = this.calculateShipSize();
  }

  calculateShipSize() {
    const rect = this.__element__.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    }
  }

  renderTo(scene) {
    const dom = scene.ownerDocument;
    const ship = dom.createElement('ship');

    ship.classList.add(this.shipClass);
    ship.appendChild(dom.createElement('weapons'));
    ship.controllerObject = this;

    this.__element__ = ship;

    scene.appendChild(ship);

    this.refreshShipSizeCache();
    this.bindEvents();
  }

  bindEvents() {
    this.on('damageReceived', this.onDamageReceived.bind(this));
  }

  onDamageReceived(source) {
    const dom = this.__element__.ownerDocument;
    dom.querySelector('audio-emitter').controllerObject.emit('explosion--small');
    console.log('HIT! by ', source);
  }
}
