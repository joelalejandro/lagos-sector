import { Skill } from 'xethya-entity';
import * as DiceThrowType from 'xethya-dice';
import WeaponBurst from './weapon-burst';
import { Range } from 'xethya-range';

export default class EnergyCannon extends Skill {
  constructor(options) {
    super('energy-cannon', null, options.owner);

    this.__meta__.canFire = true;
    this.__meta__.activeShots = 0;

    this.addAttribute('power', options.power, Range.fromArray([1, 4]));
    this.__meta__.energyType = options.energy;

    this.renderTo(options.owner.__element__);
    this.bindEvents(options.owner.__element__);
  }

  getEnergyType() {
    return this.__meta__.energyType;
  }

  canFire(value) {
    if (value !== undefined) {
      this.__meta__.canFire = value;
    }
    return this.__meta__.canFire;
  }

  getModifierSum() {
    return 10;
  }

  bindEvents(element) {
    if (this.getOwner().__isPlayerShip__) {
      element.ownerDocument.querySelector('scene').addEventListener('mousedown', this.use.bind(this), false);
      this.getOwner().on('destroyed', () => {
        element.ownerDocument.querySelector('scene').removeEventListener('mousedown', this.use.bind(this), false);
      });
    } else {
      this.updateFiringCondition();
    }
  }

  updateFiringCondition() {
    this.canFire(this.__meta__.activeShots < 1);
  }

  use() {
    if (this.canFire()) {
      const weaponFiredState = Skill.prototype.use.call(this);
      const shot = new WeaponBurst(this);

      if (!this.getOwner().__isPlayerShip__) {
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
            const score = dom.querySelector('score').controllerObject;
            score.increaseBy(weaponFiredState.rolls[0]);
            const points = score.getScore();
            if (Range.fromArray([0, 100]).includes(points)) {
              this.setAttribute('power', 2);
            } else if (Range.fromArray([101, 500]).includes(points)) {
              this.setAttribute('power', 3);
            } else if (points > 500) {
              this.setAttribute('power', 4);
            }
            this.__element__.setAttribute('power-level', this.getAttributeById('power').getValue());
          }
        });
      }
    }
  }

  renderTo(owner) {
    const dom = owner.ownerDocument;
    const weaponsArray = owner.querySelector('weapons');
    const weapon = dom.createElement('energy-cannon');

    weapon.setAttribute('power-level', this.getAttributeById('power').getValue());
    weapon.setAttribute('energy', this.getEnergyType());
    weapon.controllerObject = this;

    if (this.getOwner().getId() !== 'PLAYER_SHIP') {
      weapon.setAttribute('fired-by', 'ai');
    }

    weaponsArray.appendChild(weapon);

    this.__element__ = weapon;
  }
}
