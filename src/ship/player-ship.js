import Ship from './ship';
import EnergyCannon from '../weapons/energy-cannon';

export default class PlayerShip extends Ship {
  constructor(options) {
    super({
      id: 'PLAYER_SHIP',
      name: options.name,
      shipClass: options.shipClass
    });
    this.__isPlayerShip__ = true;
  }

  detectMovements() {
    const scene = this.__element__.ownerDocument.querySelector('scene').controllerObject;
    const pointer = scene.getPointerData();
    if (pointer && pointer.relative) {
      super.move(pointer.relative, scene);
    }
    // FIXME: This breaks movement once focus is lost.
    if (scene.canPointerMove) {
      this.dispatchMovementDetection();
    }
  }

  renderTo(scene) {
    super.renderTo(scene);

    this.__element__.setAttribute('controlled-by', 'player');

    // scene.addEventListener('mousemove', this.move.bind(this), false);
    this.dispatchMovementDetection();
    this.mountWeapon();
  }

  dispatchMovementDetection() {
    this.__meta__.previousPosition = this.getPosition();
    this.__meta__.movementDetectorID = window.requestAnimationFrame(this.detectMovements.bind(this));
  }

  mountWeapon() {
    this.__meta__.weapon = new EnergyCannon({
      power: 3,
      owner: this,
      energy: 'plasma'
    });
  }
}
