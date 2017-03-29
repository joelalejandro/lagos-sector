import Ship from './ship';
import EnergyCannon from '../weapons/energy-cannon';
import Shield from '../shields/shield';

export default class PlayerShip extends Ship {
  constructor(options) {
    super({
      id: 'PLAYER_SHIP',
      name: options.name,
      shipClass: options.shipClass
    });
    Object.defineProperty(this, '__isPlayerShip__', { get: () => true });
  }

  detectMovements() {
    const scene = this.__element__.ownerDocument.querySelector('scene').controllerObject;
    const pointer = scene.getPointerData();
    if (pointer && pointer.relative) {
      super.move(pointer.relative, scene);
    }
    // FIXME: This breaks movement once focus is lost.
    if (scene.canPointerMove && !scene.__meta__.isDestroyed) {
      this.dispatchMovementDetection();
    }
  }

  renderTo(scene) {
    super.renderTo(scene);

    this.__element__.setAttribute('controlled-by', 'player');

    // scene.addEventListener('mousemove', this.move.bind(this), false);
    this.dispatchMovementDetection();
    this.mountWeapon();
    this.mountShields();
  }

  dispatchMovementDetection() {
    this.__meta__.previousPosition = this.getPosition();
    this.__meta__.movementDetectorID = window.requestAnimationFrame(this.detectMovements.bind(this));
  }

  get shields() {
    return this.__meta__.shield;
  }

  set shields(_) {
    throw new Error('PlayerShip#shields: shields must be set via mountShields');
  }

  mountWeapon() {
    this.__meta__.weapon = new EnergyCannon({
      power: 1,
      owner: this,
      energy: 'plasma'
    });
  }

  mountShields() {
    const shield = new Shield({
      owner: this,
      initialStrength: 250,
      maximumStrength: 250,
      absorption: 0.01,
    });
    this.__meta__.shield = shield;
  }

  onDamageReceived(source) {
    super.onDamageReceived(source);
  }
}
