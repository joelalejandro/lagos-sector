import { Entity, OwnedObject } from 'xethya-entity';
import { PrototypeExtensions } from 'xethya-native-extensions';

const WeaponBurstMixins = [OwnedObject];

const WeaponBurstSpeedSettings = [600, 700, 850, 1000];

class WeaponBurst extends Entity {
  constructor(owner) {
    super('shot', null);

    WeaponBurstMixins.forEach(mixin => mixin.call(this));

    this.setOwner(owner);
    this.renderTo(owner.__element__);
  }

  beginCollideCheck() {
    this.__meta__.collideID = window.requestAnimationFrame(this.collideCheck.bind(this));
  }

  /**
   * @see http://stackoverflow.com/a/35974082/250301
   */
  boundingBoxesAreOverlapped(burst, target) {
    return !(
        ((burst.top + burst.height) < (target.top)) ||
        (burst.top > (target.top + target.height)) ||
        ((burst.left + burst.width) < target.left) ||
        (burst.left > (target.left + target.width))
    );
  }

  collideCheck() {
    const scene = window.document.querySelector('scene');
    for (let node of scene.childNodes) {
      if (node instanceof HTMLElement && node.controllerObject && node !== this.__element__ && node !== this.__meta__.owningShip.__element__) {
        const burstPosition = this.__element__.getBoundingClientRect();
        const nodePosition = node.getBoundingClientRect();
        if (this.boundingBoxesAreOverlapped(burstPosition, nodePosition)) {
          this.explode(burstPosition);
          this.emit('weaponBurstExploded', { target: node });
          node.controllerObject.emit('damageReceived', { source: this });
          this.stopCollideCheck();
        }
      }
    }
    this.beginCollideCheck();
  }

  stopCollideCheck() {
    window.cancelAnimationFrame(this.__meta__.collideID);
    delete this.__meta__.collideID;
  }

  renderTo(owner) {
    const dom = owner.ownerDocument;
    const shot = dom.createElement('shot');
    const scene = dom.querySelector('scene');
    const owningWeapon = this.getOwner();
    const owningWeaponPower = owningWeapon.getAttributeById('power');
    const owningShip = owningWeapon.getOwner();
    const owningShipPosition = owningShip.getPosition();
    const owningShipSize = owningShip.shipSize;
    const shotSpeed = WeaponBurstSpeedSettings[owningWeaponPower.getValue() - 1];

    this.__meta__.owningShip = owningShip;

    // TODO: Center burst relative to the ship.
    shot.style.left = `${owningShipPosition.x}px`;
    shot.style.top = `${owningShipPosition.y}px`;

    shot.setAttribute('weapon', owningWeapon.getId());
    shot.setAttribute('power-level', owningWeaponPower.getValue());
    shot.setAttribute('speed', shotSpeed);
    shot.setAttribute('fired-by', owningShip.__isPlayerShip__ ? 'player' : 'ai');
    shot.setAttribute('energy', owningWeapon.getEnergyType());
    shot.controllerObject = this;

    shot.style.animationDuration = `${shotSpeed / 1000}s`;

    scene.appendChild(shot);

    dom.querySelector('audio-emitter').controllerObject.emit('energy-cannon');

    this.__element__ = shot;

    this.emit('weaponBurstSpawned');

    this.beginCollideCheck();

    shot.addEventListener('animationend', () => {
      if (this.__meta__.collideID) {
        this.stopCollideCheck();
      }
      scene.removeChild(shot);
      this.emit('weaponBurstGone');
    });
  }

  explode(position) {
    const dom = this.__element__.ownerDocument;
    const scene = dom.querySelector('scene');

    const explosion = dom.createElement('explosion');
    explosion.setAttribute('strength', 1);
    explosion.style.left = `${position.left}px`;
    explosion.style.top = `${position.top}px`;

    scene.appendChild(explosion);
    this.__element__.remove();

    explosion.addEventListener('animationend', () => {
      explosion.remove();
    });
  }
}

WeaponBurstMixins.forEach(mixin => PrototypeExtensions.injectExtensionClass(mixin, WeaponBurst));

export default WeaponBurst;
