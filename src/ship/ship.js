import { LivingEntity } from 'xethya-entity';

export default class Ship extends LivingEntity {
  constructor(options) {
    const ShipClass = require(`./classes/${options.shipClass}`).default;
    super(options.id, options.name, new ShipClass());
  }

  /**
   * @override
   */
  registerAttributes() {
    this.addAttribute('impulse', 10);
    this.addAttribute('lateralThrusters', 10);

    this.__meta__.movementEasing = {
      x: 'lateralThrusters',
      y: 'impulse'
    };
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
    const dom = scene.__element__.ownerDocument;
    const ship = dom.createElement('ship');

    ship.classList.add(this.getRace().getName());
    ship.appendChild(dom.createElement('weapons'));
    ship.controllerObject = this;

    this.__element__ = ship;

    scene.__element__.appendChild(ship);

    this.refreshShipSizeCache();
    this.bindEvents();
  }

  bindEvents() {
    this.on('damageReceived', this.onDamageReceived.bind(this));
  }

  getMomentumFactor(axis) {
    return this.getAttributeById(this.__meta__.movementEasing[axis]).getComputedValue() / 100;
  }

  move(delta, scene) {
    if (!scene.canPointerMove) return;

    const position = this.getPosition();
    const easedX = position.x + delta.x * this.getMomentumFactor('x');
    const easedY = position.y + delta.y * this.getMomentumFactor('y');

    this.__element__.style.transform = `translateX(${easedX}px) translateY(${easedY}px)`;
  }

  onDamageReceived(source) {
    const dom = this.__element__.ownerDocument;
    dom.querySelector('audio-emitter').controllerObject.emit('explosion--small');
  }
}
