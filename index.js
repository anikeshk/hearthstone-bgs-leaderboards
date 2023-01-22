const fs = require('fs');
const { program, Option } = require('commander');
const axios = require('axios');

const { api, headers, body, method } = require('./constants.js');

program
  .addOption(new Option('-r, --region <id>', 'region').choices(['US', 'EU', 'AP']).default('US'))
  .addOption(new Option('-l, --leaderboardId <id>', 'leaderboard').choices(['battlegrounds']).default('battlegrounds'))
  .addOption(new Option('-s, --seasonId <id>', 'season').default(8))
  .parse();

const { region, leaderboardId, seasonId } = program.opts();

const startTime = new Date();
console.log(`Start time: ${startTime}`);
const file = `data/bgs-${region}-${seasonId}-${startTime.toISOString().slice(0, 10)}-${startTime
  .toISOString()
  .slice(12, 16)}.csv`;
fs.writeFileSync(file, 'rank,accountid,rating\n');

const request = axios.create({
  baseURL: api,
  headers,
  body,
  params: {
    region,
    leaderboardId,
    page: 1,
    seasonId,
  },
});

try {
  getLeaderboards();
} catch (error) {
  console.log(error);
}

async function getLeaderboards() {
  let res = await request.get();
  if (res.status === 200) {
    let { leaderboard } = res.data;
    let { rows, pagination } = leaderboard;
    let { totalPages, totalSize } = pagination;
    console.log(
      `Hearthstone ${leaderboardId} Region ${region} Season ID ${seasonId} has ${totalPages} pages and ${totalSize} players`
    );
    writeToFile(rows);
    console.log(`${new Date()}: Added ${rows.length} rows from page 1...`);
    for (let i = 2; i <= totalPages; i++) {
      let rows;
      rows = await getData(i);
      if (rows.length === 0) {
        console.log(`${new Date()}: Re-trying page ${i}...`);
        i--;
      } else {
        writeToFile(rows);
        console.log(`${new Date()}: Added ${rows.length} rows from page ${i}...`);
      }
    }
  } else {
    throw new Error(res.statusText);
  }
  const endTime = new Date();
  console.log(`End time: ${endTime}`);
  console.log(`Total time: ${Math.floor((endTime - startTime) / 1000)}s`);
}

function writeToFile(data) {
  data.forEach((player) => {
    fs.appendFileSync(file, `${player.rank},${player.accountid},${player.rating}\n`);
  });
}

async function getData(page) {
  request.defaults.params.page = page;
  try {
    let res = await request.get();
    let { leaderboard } = res.data;
    let { rows } = leaderboard;
    return rows;
  } catch (error) {
    console.log(error);
  }
}
