import Ship from './ship';
import EnergyCannon from '../weapons/energy-cannon';

import { CoinFlip } from 'xethya-dice';

export default class AIShip extends Ship {
  constructor(options) {
    super(options);
    this.__isAIShip__ = true;
  }

  renderTo(scene) {
    super.renderTo(scene);

    this.__element__.style.left = `${this.startingXPos}px`;
    this.__element__.style.top = `${this.startingYPos}px`;

    this.__element__.setAttribute('controlled-by', 'ai');

    this.__element__.addEventListener('animationstart', () => {
      setTimeout(() => { this.enterFiringDecisionLoop(); }, 1000);
    });

    this.__element__.addEventListener('animationend', () => {
      this.__element__.remove();
      this.emit('aiShipGone');
    });

    this.__decider__ = new CoinFlip();

    this.mountWeapon();
  }

  enterFiringDecisionLoop() {
    this.__meta__.firingLoopID = window.requestAnimationFrame(this.decideFiring.bind(this));
  }

  decideFiring() {
    const result = this.__decider__.roll();
    if (result === 1) {
      this.__meta__.weapon.fire();
    }
  }

  mountWeapon() {
    this.__meta__.weapon = new EnergyCannon({
      power: 2,
      owner: this,
      energy: 'photon'
    });
  }
}
