import Ship from './ship';
import EnergyCannon from '../weapons/energy-cannon';

export default class PlayerShip extends Ship {
  constructor(name) {
    super('PLAYER_SHIP', name);
  }

  move(event) {
    this.__element__.style.left = `${event.x + (this.__meta__.shipSize.width / 2)}px`;
    this.__element__.style.top = `${event.y + (this.__meta__.shipSize.height / 2)}px`;
  }

  renderTo(scene) {
    super.renderTo(scene);

    this.__element__.setAttribute('controlled-by', 'player');

    scene.addEventListener('mousemove', this.move.bind(this), false);
    this.mountWeapon();
  }

  mountWeapon() {
    this.__meta__.weapon = new EnergyCannon(1, this);
  }
}
