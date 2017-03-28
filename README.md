# Lagos Sector

This is a proof-of-concept space shooter 2D game for testing several components of the [Xethya framework](https://github.com/xethya). It uses [Electron](https://github.com/electron/electron) too, and has just ~600 SLoC so far (as of commit 328b34c).

```
┌───────────┬──────────┬────────┬─────────┬─────────────────────┬───────────────┬───────┬───────┬───────┐
│ Extension │ Physical │ Source │ Comment │ Single-line comment │ Block comment │ Mixed │ Empty │ To Do │
├───────────┼──────────┼────────┼─────────┼─────────────────────┼───────────────┼───────┼───────┼───────┤
│ js        │ 740      │ 586    │ 10      │ 4                   │ 6             │ 0     │ 144   │ 1     │
└───────────┴──────────┴────────┴─────────┴─────────────────────┴───────────────┴───────┴───────┴───────┘
```

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
