import { EntityRace } from 'xethya-entity';

export default class InterceptorClassVessel extends EntityRace {
  constructor() {
    super();
    
    this.name = 'interceptor';
    this.addAttributeBoost('impulse', 10);
    this.addAttributeBoost('lateralThrusters', 5);
  }
}
