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

    // this.getStatById('strength').on('change', this.calculateShieldRatio.bind(this));

    this.addAttribute('rechargeRate', options.rechargeRate || 1, Range.fromArray([1, 50]));
    this.addAttribute('rechargeSpeed', options.rechargeSpeed || 1, Range.fromArray([1, 5000]));
    this.addAttribute('absorption', options.absorption || 0.01, Range.fromArray([0.01, 0.5]));

    this.addModifier('recharging', 0);
    this.deactivateModifier('recharging');

    this.addStat('rechargeAmount', () => {
      return options.maximumStrength * (1 / this.getAttributeById('rechargeRate').getValue());
    });

    this.renderTo(options.owner.__element__);
  }

  recharge() {
    const shieldStrength = this.getStatById('strength');
    const stopValue = this.__meta__.maximumStrength;
    const before = shieldStrength.getValue();
    const mustRecharge = shieldStrength.getValue() < stopValue;
    /* if (mustRecharge) {
      console.log(this.__meta__.strengthReduced, this.getStatById('rechargeAmount').getValue());
      this.__meta__.strengthReduced -= this.getStatById('rechargeAmount').getValue();
    } else {
      this.deactivateModifier('recharging');
    }
    this.__meta__.rechargeTimeout = setTimeout(this.recharge.bind(this), 10000 * this.__meta__.rechargeSpeed); */
  }

  calculateShieldRatio() {
    const stat = this.getStatById('strength');
    const percentile = (stat.getValue() / this.__meta__.maximumStrength);
    const ratio = percentile.toFixed(1);
    const gaugeLevel = Math.min(((1 - percentile) * 100).toFixed(0), 100);
    console.log(percentile, ratio, gaugeLevel);
    this.__element__.setAttribute('ratio', ratio);
    this.emit('strengthChanged', ratio, gaugeLevel);
    console.log('strength changed');
    return percentile;
  }

  onModifierActivated(modifier) {
    if (modifier.getId() === 'recharging') {
      console.log('modifier activated: recharge');
      this.recharge();
    }
  }

  onModifierDeactivated(modifier) {
    if (modifier.getId() === 'recharging') {
      console.log('modifier deactivated: recharge');
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
    const damage = shieldRoll.getTotalRollValue() * (1 - this.getAttributeById('absorption').getValue());
    this.__meta__.strengthReduced += damage;

    //this.activateModifier('recharging');
    return this.calculateShieldRatio();
  }
}

ShieldMixins.forEach(mixin => PrototypeExtensions.injectExtensionClass(mixin, Shield));

export default Shield;
