import { Skill } from 'xethya-entity';
import * as DiceThrowType from 'xethya-dice';
import WeaponBurst from './weapon-burst';
import { Range } from 'xethya-range';

export default class EnergyCannon extends Skill {
  constructor(options) {
    super('energy-cannon', null, options.owner);

    this.__meta__.id = 'energy-cannon';
    this.__meta__.canFire = true;
    this.__meta__.activeShots = 0;

    this.addAttribute('power', options.power, Range.fromArray([1, 4]));
    this.__meta__.energyType = options.energy;

    this.renderTo(options.owner.__element__);
    this.bindEvents(options.owner.__element__);
  }

  get id() {
    return this.__meta__.id;
  }

  set id(val) {
    // throw new Error('EnergyCannon#id: cannot change ID');
  }

  get canFire() {
    return this.__meta__.canFire;
  }

  set canFire(value) {
    this.__meta__.canFire = !!value;
  }

  getModifierSum() {
    return 10;
  }

  bindEvents(element) {
    if (this.owner.__isPlayerShip__) {
      element.ownerDocument.addEventListener('mousedown', this.fire.bind(this), false);
    } else {
      this.updateFiringCondition();
    }
  }

  updateFiringCondition() {
    this.canFire = this.__meta__.activeShots < 1;
  }

  fire() {
    if (this.canFire) {
      const weaponFiredState = this.use();
      const shot = new WeaponBurst(this);

      if (!this.owner.__isPlayerShip__) {
        this.__meta__.activeShots += 1;
        this.updateFiringCondition();

        shot.once('weaponBurstGone', () => {
          this.__meta__.activeShots -= 1;
          this.updateFiringCondition();
        });
      } else {
        shot.once('weaponBurstExploded', (data) => {
          if (data.target.controllerObject.__isAIShip__) {
            const dom = this.__element__.ownerDocument;
            dom.querySelector('score').controllerObject.increaseBy(weaponFiredState.rolls[0]);
          }
        });
      }
    }
  }

  renderTo(owner) {
    const dom = owner.ownerDocument;
    const weaponsArray = owner.querySelector('weapons');
    const weapon = dom.createElement('energy-cannon');

    weapon.setAttribute('power-level', this.getAttributeById('power').value);
    weapon.setAttribute('energy', this.__meta__.energyType);
    weapon.controllerObject = this;

    if (this.owner.id !== 'PLAYER_SHIP') {
      weapon.setAttribute('fired-by', 'ai');
    }

    weaponsArray.appendChild(weapon);

    this.__element__ = weapon;
  }
}
