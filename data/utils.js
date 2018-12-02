const fs = require('fs');
const R = require('ramda');

const all = JSON.parse(fs.readFileSync('1.json'));
const games = R.sortBy(x => x.id, R.unnest(all.tournaments.map(x => x.games)));
const players = R.sortBy(x => x.id, all.players);
const t = R.fromPairs(players.map(p => {
  const g1 = games.find(g => g.p1 === p.id || g.p2 === p.id);
  return g1 && [p.id, g1.p1 === p.id ? g1.p1Rating : g1.p2Rating];
}).filter(x => x));

fs.writeFileSync('initialRatings.json', JSON.stringify(t));
