# hearthstone-bgs-leaderboards

Script to pull data from Hearthstone's Battlegrounds Leaderboards website

## Usage

### Pre-Requisites
1. Node.js (v16+)
2. npm

### Steps
1. Install the npm dependencies.
```
npm install
```
2. Run the script with the region and season ID.
```
node index.js -r US -s 8
```
The data will be saved in the `data` folder. 

3. For a list of commands and choices, run `node index.js --help`.
```
Usage: index [options]

Options:
  -r, --region <id>         region (choices: "US", "EU", "AP", default: "US")
  -l, --leaderboardId <id>  leaderboard (choices: "battlegrounds", default: "battlegrounds")
  -s, --seasonId <id>       season (default: 8)
  -h, --help                display help for command
```
   
## Notes
Hearthstone Battlegrounds (BGs) is a eight player auto-battler gamemode based in the Hearthstone universe. You can learn more about it [here](https://hearthstone.blizzard.com/en-gb/news/23156373).
  
After each win, you gain "MMR" points. Hearthstone maintains a public rankings leaderboard with the player name and respective MMR.

Since Blizzard does not offer an API for [Hearthstone](https://develop.battle.net/documentation/hearthstone) API for leaderboards, I resorted to using the internal API that is called by the official leaderboards [website](https://hearthstone.blizzard.com/en-gb/community/leaderboards?region=US&leaderboardId=battlegrounds). Blizzard does offer leaderboard APIs for its other games like [Starcraft](https://develop.battle.net/documentation/starcraft-2/community-apis) and [WoW](https://develop.battle.net/documentation/world-of-warcraft/game-data-apis).

The script in the current form is very rudimentary and does not parallelize requests. Also, since the script takes a extremely long time to run and ranking is updated regularly, there could be a slight delta between the current leaderboards and the data in this repository.



