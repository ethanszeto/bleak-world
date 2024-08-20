# manual

A project where I explore the depths of mathematics' application in game development. The project has no dependencies, and all mathematical functions are written manually, hence the name. 

## Mathematics Used:
- Perlin Noise
  - A modified Perlin Noise Generator creates the game world.
- Quintic Smoothstep Function
  - Vertical camera panning uses a fifth order smoothstep function for linear interpolation.
- Linear Interpolation
  - Perlin uses linear interpolation, as well as vertical camera panning.
- Cubic Bezier
  - The horizontal camera panning uses cubic bezier.
- Distance Formula
  - Collision detection between boxes and circles.

## Theory Used:
- Lazy Loading / Unloading
  - Blocks outside of the viewport are unrendered.
- Procedural World Generation
  - Given a seed, the world will be procedurally generated around that seed.
- Class Inheritence
  - Game objects follow an inheritence tree.
- Method Overriding
  - Movement of the player and other moving objects overrides updates in base game object classes.
- Spatial Hashing
  - Check only within locailty of colliding objects, rather than the entire game state.

