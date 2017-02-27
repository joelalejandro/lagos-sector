// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import { SkilledEntity } from 'xethya-entity';

const Player = new SkilledEntity('ENTITY_MAIN_PLAYER', 'Joe\'s Ship');
console.log(Player);
