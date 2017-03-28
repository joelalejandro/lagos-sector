export default class ShieldGauge {
  constructor() {
    this.__element__ = window.document.createElement('shield-gauge');
    this.__element__.controllerObject = this;
    document.body.appendChild(this.__element__);

    const playerShip = document.querySelector('ship[controlled-by="player"]');
    playerShip.controllerObject.shields.on('strengthChanged', (ratio, gaugeLevel) => {
      this.refreshUI(gaugeLevel);
    });

    this.refreshUI('0');
  }

  refreshUI(gaugeLevel) {
    this.__element__.setAttribute('damage', gaugeLevel);
  }
}
