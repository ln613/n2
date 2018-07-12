const fs = require('fs');
const util = require('util');

const players = JSON.parse(fs.readFileSync('player.json'));
const ratings = JSON.parse(fs.readFileSync('rating.json'));
const ts = JSON.parse(fs.readFileSync('Tournament.json'));
const games = JSON.parse(fs.readFileSync('game.json'));

const o = {};

o.players = players.map(x => ({
  id: +x.PK_INDEX,
  firstName: x.F_NAME.trim(),
  lastName: x.L_NAME.trim(),
  sex: x.GENDER,
  rating: +((ratings.find(y => y.PLAYER_ID == x.PK_INDEX) || {}).RATING || 100)
}));

const teams = require('./team');
Object.keys(teams).forEach(d => teams[d].forEach(t => t.players = t.players.map(x => {
  const ss = x.trim().split(' ');
  const p = { rating: +ss[0] };
  p.id = ss[1][0] === '+'
    ? +ss[1].slice(1)
    : ((o.players.find(y => y.firstName == ss[1] && y.lastName == ss[2]) || {}).id || 0);
  return p;
})));

const schedules = require('./schedule');

o.tournaments = ts.map(x => {
  const tts = teams[x.ID] || [];

  return {
    id: +x.ID,
    name: x.TournamentName,
    teams: tts,
    schedules: schedules[x.ID] || [],
    games: games.filter(y => y.TOURNAMENT_ID == x.ID).map(y => {
      const p1w = +y.PLAYER_A_WON_GAMES;
      const p2w = +y.PLAYER_B_WON_GAMES;
      const isP1 = p1w > p2w;
      const p1 = +y.PLAYER_A_ID;
      const p2 = +y.PLAYER_B_ID;

      const r = {
        id: y.GAME_ID,
        date: y.GAME_DATE,
        p1,
        p2,
        p1Rating: isP1 ? +y.WINNER_RATING : +y.LOSER_RATING,
        p2Rating: isP1 ? +y.LOSER_RATING : +y.WINNER_RATING,
        p1Diff: isP1 ? +y.WINNER_RATING_G_L : +y.LOSER_RATING_G_L,
        p2Diff: isP1 ? +y.LOSER_RATING_G_L : +y.WINNER_RATING_G_L,
        result: y.PLAYER_A_WON_GAMES + ':' + y.PLAYER_B_WON_GAMES,
        rated: y.GAME_RATED === '1'
      };

      if (x.ID === 86) {console.log(r.p1, r.p2);
        r.t1 = tts.find(z => z.players.some(p => p.id === r.p1)).id; 
        r.t2 = tts.find(z => z.players.some(p => p.id === r.p2)).id; 
      }

      return r;
    })
  };
});

fs.writeFileSync('1.json', JSON.stringify(o, null, 2));
