import { Skill, StatableObject } from 'xethya-entity';
import { PrototypeExtensions } from 'xethya-native-extensions';
import * as DiceThrowType from 'xethya-dice';
import { Range } from 'xethya-range';

const ShieldMixins = [StatableObject];

class Shield extends Skill {
  constructor(options) {
    super('shield', null, options.owner);

    ShieldMixins.forEach(mixin => mixin.call(this));

    this.__meta__ = Object.assign({}, this.__meta__, {
      maximumStrength: options.maximumStrength,
      initialStrength: options.initialStrength,
      rechargeRate: options.rechargeRate,
      rechargeSpeed: options.rechargeSpeed,
      strengthReduced: 0
    });
    this.addStat('strength', () => {
      return options.initialStrength - this.__meta__.strengthReduced;
    });

    this.addAttribute('rechargeRate', options.rechargeRate || 1, Range.fromArray([1, 50]));
    this.addAttribute('rechargeSpeed', options.rechargeSpeed || 1, Range.fromArray([1, 100]));
    this.addAttribute('absorption', options.absorption || 0.01, Range.fromArray([0.01, 0.5]));

    this.addModifier('recharging', 0);
    this.getModifierById('recharging').setActiveStatus(false);

    this.addStat('rechargeAmount', () => {
      return options.maximumStrength * (1 / this.getAttributeById('rechargeRate').getValue());
    });

    this.renderTo(options.owner.__element__);
  }

  recharge() {
    const shieldStrength = this.getStatById('strength');
    const stopValue = this.__meta__.maximumStrength;
    const mustRecharge = shieldStrength.getValue() < stopValue;
    this.getModifierById('recharging').active = mustRecharge;
    if (mustRecharge) {
      this.__meta__.strengthReduced -= this.getStatById('rechargeAmount').getValue();
    }
    this.__meta__.rechargeTimeout = setTimeout(this.recharge.bind(this), 10000 * this.__meta__.rechargeSpeed);
  }

  onStatValueChanged(stat, previousValue) {
    if (stat.__meta__.id === 'strength') {
      const percentile = (stat.getValue() / this.__meta__.maximumStrength);
      const ratio = percentile.toFixed(1);
      const gaugeLevel = ((1 - percentile) * 100).toFixed(0);
      this.__element__.setAttribute('ratio', ratio);
      this.emit('strengthChanged', ratio, gaugeLevel);
    }
  }

  onModifierActivated(modifier) {
    if (modifier.id === 'recharging') {
      this.recharge();
    }
  }

  onModifierDeactivated(modifier) {
    if (modifier.id === 'recharging') {
      clearTimeout(this.__meta__.rechargeTimeout);
    }
  }

  renderTo(owner) {
    const dom = owner.ownerDocument;
    const shield = dom.createElement('shield');

    shield.setAttribute('ratio', '1.0');

    shield.controllerObject = this;

    owner.appendChild(shield);

    this.__element__ = shield;
  }

  use(sourceDamage) {
    const shieldRoll = super.use();
    switch (shieldRoll.throwType) {
      case DiceThrowType.Failure:

        break;
      case DiceThrowType.Success:

        break;
      case DiceThrowType.CriticalSuccess:

        break;
    }
    this.getModifierById('recharging').setActiveStatus(true);
  }
}

ShieldMixins.forEach(mixin => PrototypeExtensions.injectExtensionClass(mixin, Shield));

export default Shield;
