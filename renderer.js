// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import Scene from './src/scene/scene';
import AudioEmitter from './src/scene/audio-emitter';
import PlayerShip from './src/ship/player-ship';
import AIShip from './src/ship/ai-ship';
import Score from './src/ui/score';
import ShieldGauge from './src/ui/shield-gauge';

import { DiceThrow } from 'xethya-dice';

window.onload = function() {
  let scene = new Scene({ background: 'stars' });

  // Registering all sounds
  const audioEmitter = new AudioEmitter();
  audioEmitter.registerSound({ name: 'background-music', src: 'through-space.ogg', volume: 0.4 });
  audioEmitter.registerSound({ name: 'energy-cannon', src: 'laser4.mp3' });
  audioEmitter.registerSound({ name: 'explosion--small', src: 'boom3.wav', volume: 0.2 });

  audioEmitter.emit('background-music');

  const beginGame = () => {
    if (scene.__meta__.isDestroyed) {
      scene = new Scene({ background: 'stars' });
      if (document.querySelector('score')) {
        document.querySelector('score').remove();
      }
    }

    scene.bindCapturePointerEvent();

    // Rendering the player's ship
    const ship = new PlayerShip({ name: 'The Lagos', shipClass: 'interceptor' });
    ship.renderTo(scene);

    ship.on('destroyed', () => {
      console.log('destroyed');
      document.exitPointerLock();
      scene.destroy();
      shieldGauge.destroy();
      document.querySelector('game-over').style.display = 'block';
    });

    // Score controller
    const score = new Score();

    // Shield gauge
    const shieldGauge = new ShieldGauge();

    // Spawing fighters
    let fighterCount = 0;
    const maxFightersOnStage = 8;

    const diceThrow = new DiceThrow(maxFightersOnStage, scene.__element__.getBoundingClientRect().width);

    const spawner = () => {
      if (fighterCount < maxFightersOnStage) {
        const ship = new AIShip({
          name: `enemy${fighterCount + 1}`,
          shipClass: 'fighter'
        });
        ship.startingXPos = diceThrow.roll().rolls[fighterCount];
        ship.startingYPos = -diceThrow.roll().rolls[0];
        ship.renderTo(scene);
        fighterCount += 1;
        ship.on('aiShipGone', () => { fighterCount--; })
        ship.on('destroyed', () => { fighterCount--; });
      }
      callSpawner();
    };

    const callSpawner = () => {
      window.requestAnimationFrame(spawner);
    }

    callSpawner();

  };

  document.querySelectorAll('button.start-game').forEach((element) => {
    element.addEventListener('click', () => {
      document.querySelector('splash-screen').style.display = 'none';
      document.querySelector('game-over').style.display = 'none';
      beginGame();
    });
  });

  document.onkeydown = (e) => {
    if (e.keyCode === 82) window.location.reload();
    if (e.keyCode === 81) window.close();
  };
}
