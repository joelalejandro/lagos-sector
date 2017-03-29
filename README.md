# Lagos Sector

This is a proof-of-concept space shooter 2D game for testing several components of the [Xethya framework](https://github.com/xethya). It uses [Electron](https://github.com/electron/electron) too, and has just ~700 JavaScript SLoC so far (as of commit `7963874`).

```
┌───────────┬──────────┬────────┬─────────┬─────────────────────┬───────────────┬───────┬───────┬───────┐
│ Extension │ Physical │ Source │ Comment │ Single-line comment │ Block comment │ Mixed │ Empty │ To Do │
├───────────┼──────────┼────────┼─────────┼─────────────────────┼───────────────┼───────┼───────┼───────┤
│ - Total - │ 1719     │ 1413   │ 57      │ 42                  │ 15            │ 2     │ 251   │ 1     │
├───────────┼──────────┼────────┼─────────┼─────────────────────┼───────────────┼───────┼───────┼───────┤
│ scss      │ 782      │ 694    │ 8       │ 6                   │ 2             │ 2     │ 82    │ 0     │
├───────────┼──────────┼────────┼─────────┼─────────────────────┼───────────────┼───────┼───────┼───────┤
│ js        │ 897      │ 679    │ 49      │ 36                  │ 13            │ 0     │ 169   │ 1     │
├───────────┼──────────┼────────┼─────────┼─────────────────────┼───────────────┼───────┼───────┼───────┤
│ html      │ 40       │ 40     │ 0       │ 0                   │ 0             │ 0     │ 0     │ 0     │
└───────────┴──────────┴────────┴─────────┴─────────────────────┴───────────────┴───────┴───────┴───────┘
```

Check out current stats by running `npm run code-metrics`.

## How to play

Until binaries are released:

```bash
git clone https://github.com/joelalejandro/lagos-sector
cd lagos-sector
npm install
npm run game
```

## Screenshots
![Screenshot 1](http://i.imgur.com/NWlq35q.png)
![Screenshot 2](http://i.imgur.com/MoT5oas.png)

## Components used

- **xethya-dice:** Used for random-related actions (damage levels, spawners, etc.)
- **xethya-entity:** Every element on stage is either a `SkilledEntity` or a plain, basic `Entity`.
- **xethya-native-extensions:** Used to apply a mixin pattern.

## Assets

Assets have been pulled off from [OpenGameArt.org](http://opengameart.org):

### Sprites

- [Spaceships] (http://opengameart.org/content/spaceships-1) by wuhu
- [Stars - Parallax backgrounds] (http://opengameart.org/content/stars-parallax-backgrounds) by Bonsaiheldin
- [Lasers and beams] (http://opengameart.org/content/lasers-and-beams) by Rawdanitsu

### Sounds

- [Boom Pack 1] (http://opengameart.org/content/boom-pack-1) by dklon
- [63 Digital sound effects (lasers, phasers, space etc.)] (http://opengameart.org/content/63-digital-sound-effects-lasers-phasers-space-etc) by Kenney

### Music

- [Through Space] (http://opengameart.org/content/through-space) by maxstack

### Fonts

- [5by7] (https://fontlibrary.org/en/font/5by7) by Peter Wiegel
