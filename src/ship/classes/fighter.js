import { EntityRace } from 'xethya-entity';

export default class FighterClassVessel extends EntityRace {
  constructor() {
    super();

    this.setName('fighter');
    this.addAttributeBoost('impulse', 30);
    this.addAttributeBoost('lateralThrusters', 10);
  }
}
