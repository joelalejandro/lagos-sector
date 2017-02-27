import Ship from './ship';

export default class AIShip extends Ship {
  constructor(id, name) {
    super('AI_SHIP_${id}', name);
  }

  renderTo(scene) {
    super.renderTo(scene);

    this.__element__.style.left = `${this.startingXPos}px`;
    this.__element__.style.top = `${this.startingYPos}px`;

    this.__element__.setAttribute('controlled-by', 'ai');

    this.__element__.addEventListener('animationend', () => {
      scene.removeChild(this.__element__);
      this.emit('aiShipGone');
    });
  }
}
