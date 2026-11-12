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
