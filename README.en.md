# Uphill

A pixel art driving game: a little car on endless hills, with real physics. Go as far as you can without landing on the roof or running out of fuel.

*Version française : [README.md](README.md)*

## The garage

Before each game, you stop at the garage:

- **13 worlds**: Meadow (from the start), Desert, Snow (slippery), Moon (you float), Forest, Beach, Jungle, Swamp (muddy), Canyon (steep slopes), Volcano, Mars (low gravity), Crystals and City at night, each with its own sky, scenery and physics: gravity, sand and mud that slow you down, ice and tarmac that let you roll.
- **12 vehicles**: Jeep (well balanced, from the start), Monster, Racer, Quad, Motorbike, Buggy, Tractor, Van, Truck, Rally, Rover (barely uses fuel) and Hot rod (the fastest). Each one has its own weight: heavy ones fall fast and turn little in the air, light ones bounce; the Motorbike and the Hot rod pop a wheelie when you accelerate, and rear-wheel drives only push with the back wheel.
- **Upgrades**, for each car: **engine**, **tyres** (grip) and **tank**, over 5 levels.

Terrains, cars and upgrades are bought with the **coins** picked up on the road.

## Controls

- Garage: **↑ ↓** pick a row, **← →** change, **Enter** unlock, upgrade or go.
- Road: **→** speed up, **←** brake. In the air, **→** lifts the nose and **←** lowers it.
- **P** or **Esc**: pause. After a game, **Space** goes back to the garage.

## Flying

- **Ramps**: after 90 m, wooden ramps rise steeper and steeper then drop away; at speed, the vehicle takes off far. Short bumps in the hills also make you jump on fast descents.
- In the air the vehicle **glides** a little; → lifts the nose, ← lowers it.
- **Flying pays**: a coin per half second in the air, 10 to 15 per **flip** (see Tricks and combos), and 2 for a **perfect landing** (both wheels down together, along the slope), which also gives a small boost.
- **Nitro** (**Space** or **Shift**): a push that makes you fly along, even in the air. Its blue gauge fills as you fly, flip and land flat.
- **The engine** has its own sound for each vehicle and rises with speed, throttle and nitro.
- **Full screen**: the button of the same name; Escape to leave it. On a wide screen, the scene widens to see further.

## Tricks and combos (new in 1.3.0)

- **Backflip** (the nose lifts and goes all the way round, → in the air): 10 coins per turn. **Front flip** (the nose dives, ← in the air), harder: 15 coins per turn. Two or three turns in a row make a **DOUBLE** or **TRIPLE** flip.
- **Air time**: a coin per half second in the air, counted with the flips of the same jump.
- **Wheelie**: riding more than a second on the back wheel alone (accelerating lifts the nose) gives 2 coins per second; the time is shown above the vehicle.
- **Combo**: a trick done less than 4 seconds (on the ground) after the previous one raises the combo, up to **×5**; every coin of the trick is multiplied, and so is the perfect landing. The combo and its purple gauge are shown under the top bar; a perfect landing refills the gauge.
- Trick messages stack above the vehicle without overlapping. The end of the game gives your best combo and longest wheelie; the side column keeps your total flips and best combo.

## How it works

- If the **roof** touches the ground, the game is over.
- Fuel goes down as you drive: grab the **red cans** to refuel.
- A full **flip** is worth 10 coins.
- A **best** in metres is kept for each terrain.

## Data and sync

Your coins, cars and bests are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Uphill → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
