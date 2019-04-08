import { reduce, prop, sortWith, sortBy, ascend, descend, unnest, find, isEmpty, groupBy, groupWith, join, sum, range, pipe, map, filter as where, uniqBy, anyPass, both, dropLast, isNil, toPairs, is } from 'ramda';
import { createSelector, mapStateWithSelectors } from '@ln613/state';
import { Bold, Italic } from '@ln613/ui';
import { findById, getNameById, getPropById, toDate, toMonth, addIndex, diff, tap, split2, toAbsDate, findByName } from '@ln613/util';
import { highlightSub } from './';

const _form = s => s.form || {};
const _filter = s => s.filter || {};

const form = p => s => _form(s)[p] || {};
const filter = p => s => _filter(s)[p] || {};

const isLoading = s => s.isLoading;
const isMobile = s => s.isMobile;
const lastAction = s => s.lastAction || '';
const error = s => s.error;
const lookup = s => s.lookup || {};
const lang = s => s.lang || {};
const cats = s => s.cats || [];
const products = s => s.products || [];
const _players = s => s.players || [];
const tournaments = s => s.tournaments || [];
const _tournament = s => s.tournament || {};
const _history = s => s.history || [];
const newGameId = s => s.newGameId;
const auth = s => s.auth || {};

const success = a => createSelector(
  isLoading,
  lastAction,
  error,
  (il, la, e) => il || la.toLowerCase() !== ('set' + a) ? null : !e
)

const sortedList = (list, filter) => createSelector(
  list,
  filter,
  (l, f) => {
    const sort = f.sort;
    if (!sort || sort.length < 2) return l;

    const by = prop(sort[0]);
    return sortWith([sort[1] === 2 ? descend(by) : ascend(by)], l);
  }
)

const catsDD = createSelector(
  cats,
  cs => cs.map(c => ({...c, text: c.name, value: c.id,
    subs: (c.subs || []).map(s => ({...s, text: s.name, value: s.id}))}))
);

const productsWithCat = createSelector(
  products,
  cats,
  (ps, cs) => ps.map(p => {
    const c = findById(p.cat)(cs);
    return {...p, cat_name: c && c.name, cat1_name: getNameById(p.cat1)(c && c.subs)};
  })
);

const filteredProducts = createSelector(
  productsWithCat,
  filter('product'),
  (ps, f) => reduce((p, c) => p.filter(c), ps, Object.keys(f).map(k => {
    if (k === 'cat') {
      if (f[k] === 1) return p => p;
      if (f[k] === 2) return p => p.sale;
    }
    return p => p[k] === f[k];
  }))
);

const fullname = p => p.firstName + ' ' + p.lastName;

const namedPlayers = createSelector(
  _players,
  ps => ps.map(p => ({ ...p, name: fullname(p) }))
);

const players = createSelector(
  namedPlayers,
  sortWith([ascend(prop('name'))])
);

const sortedPlayers = createSelector(
  namedPlayers,
  sortWith([descend(prop('rating'))])
);

const filteredPlayers = createSelector(
  sortedPlayers,
  form('player'),
  (ps, f) => ps.filter(p => !is(String, f) || p.name.toLowerCase().indexOf(f.toLowerCase()) > -1)
);

const dsPlayers = createSelector(
  filteredPlayers,
  ps => ps.map(p => ({ ...p, text: `${p.name} (${p.rating})` }))
);

const teams = createSelector(
  _tournament,
  players,
  (t, ps) => (t.teams || []).map(x => ({ ...x, name: x.name || (getNameById(x.players[0].id)(ps) + " / " + getNameById(x.players[1].id)(ps))}))
);

const pn = (n, g) => g['p' + n];
const tn = (n, g) => g['t' + (n > 2 ? n - 2 : n)];
const findGames = (s, m, gs) => gs.filter(g => toAbsDate(g.date) === toAbsDate(s.date) && ((g.t1 === m.home && g.t2 === m.away) || (g.t2 === m.home && g.t1 === m.away)));
const gg = (g, x) => +(g && g[x] || 0);
const getResult = g => g.result || (range(0, 5).filter(n => gg(g.g1, n) > gg(g.g2, n)).length + ':' + range(0, 5).filter(n => gg(g.g1, n) < gg(g.g2, n)).length);
const getPlayerName = (n, g, ps, ts) => getNameWithSub(n, g, ps, ts) + (g.isDouble ? ' / ' + getNameWithSub(n + 2, g, ps, ts) : '');
const getPlayer = (pid, tid, ts) => findById(pid)((findById(tid)(ts) || {}).players);
const getIsSub = (pid, tid, ts) => (getPlayer(pid, tid, ts) || {}).isSub;
const getNameWithSub = (n, g, ps, ts) => highlightSub(getNameById(pn(n, g))(ps), getIsSub(pn(n, g), tn(n, g), ts));
const subs = (n, g, ts) => (getPlayer(pn(n, g), tn(n, g), ts) || {}).isSub ? 1 : 0;
const totalSubs = (g, ts) => subs(1, g, ts) + subs(3, g, ts) - subs(2, g, ts) - subs(4, g, ts);
const isWin = (g, ts) => {
  const s = totalSubs(g, ts);
  return s === 0 ? g.result[0] > g.result[2] : s < 0;
}
const getSinglePlayer = (id, ps) => {
  const p = findById(id)(ps);
  return `${p.rank}. ${p.name} (${p.tRating})`;
}

const tournament = createSelector(
  _tournament,
  players,
  teams,
  (t, ps, ts) => {
    if (ps.length === 0) return t;
    const teams = (ts || []).map(m => ({
      ...m, text: m.name, value: m.id,
      players: sortWith([ascend(x => x.isSub ? 1 : 0), descend(x => x.tRating || x.rating)], m.players.map(p => [p, findById(p.id)(ps)]).map(([mp, p]) => ({
        ...mp, sex: p.sex.slice(0, 1).toUpperCase(), rating: p.rating, tRating: mp.rating, name: fullname(p), firstName: p.firstName, lastName: p.lastName
      })))
    }));
    const groups = teams.length === 0 || isNil(teams[0].group) ? null : toPairs(groupBy(x => x.group, teams));
    const players = addIndex('rank')(sortWith([descend(x => x.tRating)], (t.players || []).map(p => ({...findById(p.id)(ps), tRating: p.rating }))));
    const games = (t.games || []).map(g => {
      const result = getResult(g);
      const team1 = getNameById(g.t1)(teams);
      const team2 = getNameById(g.t2)(teams);
      const game = {...g, result, player1: getPlayerName(1, g, ps, teams), player2: getPlayerName(2, g, ps, teams), team1, team2};
      game.isWin = isWin(game, teams);
      return game;
    });
    const schedules = (t.schedules || []).map(s => ({
      ...s,
      date: s.date,
      matches: t.isSingle ?
        s.matches.map(m => ({...m, player1: getSinglePlayer(m.home, players), player2: getSinglePlayer(m.away, players), result: m.result || ''})) :
        ((s.group || s.ko) ? s.matches : range(1, 9).map(n => findById(n)(s.matches) || {}))
        .map(m => {
          const gs = findGames(s, m, games).filter(g => s.group ? s.group == g.group : (s.ko ? s.ko == g.ko : true));
          const wn = gs.filter(g => (g.isWin && g.t1 === m.home) || (!g.isWin && g.t1 === m.away)).length;
          const ln = gs.length - wn;
          const groupGames = (m.games || [])
            .map(x => ({...x, isDouble: x.p3 && x.p4}))
            .map(x => ({
              ...x,
              team1: getNameById(x.t1)(teams),
              team2: getNameById(x.t2)(teams),
              player1: getPlayerName(1, x, ps, teams),
              player2: getPlayerName(2, x, ps, teams),
              p1Rating: getPropById('rating')(x.p1)(ps),
              p2Rating: getPropById('rating')(x.p2)(ps),
              isDouble: !!x.p3,
              result: (find(g1 => g1.t1 == x.t1 && g1.t2 == x.t2 && g1.p1 == x.p1 && g1.p2 == x.p2 && g1.p3 == x.p3 && g1.p4 == x.p4, gs) || {}).result
            }));
          return {...m, team1: getNameById(m.home)(teams), team2: getNameById(m.away)(teams), result: wn + ':' + ln, games: groupGames };
        })
    }));
    return { ...t, teams, groups, players, schedules, games };
  }
);

const tournamentsWithYears = createSelector(
  tournaments,
  ts => sortWith(
    [descend(prop('year')), ascend(prop('name'))],
    ts.map(t => ({ year: +find(x => !isNaN(+x), unnest(t.name.split(' ').map(x => x.split('/')))), ...t }))
  )
);

const games = createSelector(
  _tournament,
  t => t.games || []
);

const gameDetail = (n, g) => {
  const r1 = +g.result.split(':')[n];
  const r2 = 5 - r1;
  const g1 = range(0, r1).map(x => 11);
  const g2 = range(0, r2).map(x => 0);
  return r1 > 2 ? g1.concat(g2) : g2.concat(g1);
}

const gamesWithTeams = createSelector(
  teams,
  players,
  games,
  (ts, ps, gs) => gs.map(g => ({
    ...g,
    date: toDate(g.date),
    player1: (findById(g.p1)(ps) || {}).name,
    player2: (findById(g.p2)(ps) || {}).name,
    team1: find(x => findById(g.p1)(x.players), ts),
    team2: find(x => findById(g.p2)(x.players), ts),
    g1: g.g1 || gameDetail(0, g),
    g2: g.g2 || gameDetail(1, g),
  })).map(g => ({...g, t1: (g.team1 || {}).id, t2: (g.team2 || {}).id, team1: (g.team1 || {}).name, team2: (g.team2 || {}).name}))
);

const redSpan = x => `<span class="red">${x}</span>`;

const getPoints = (m, t, v) => m[t] === v ? m[t + 'Points'] : 0;

const dp = s => descend(prop(s ? 'gw' : 'points'));
const at = ascend(prop('total'));
const dw = descend(prop('w'));
const dl = descend(prop('gw'));
const al = ascend(prop('gl'));
const dm = descend(prop('mw'));
const am = ascend(prop('ml'));

const standing = createSelector(
  tournament,
  teams,
  (tt, ts) => {
    const st = (tt.isSingle ? tt.players : ts).map(t => {
      const ms = unnest((tt.schedules || []).filter(s => !s.ko).map(s => s.matches)).filter(m => (m.home === t.id || m.away === t.id) && m.result && m.result != '0:0');
      const ws = ms.filter(m => (m.home === t.id && m.result[0] > m.result[2]) || (m.away === t.id && m.result[0] < m.result[2]));
      const wn = ws.length;
      const ln = ms.length - wn;
      const ps = sum(ms.map(m => +m.result[m.home == t.id ? 0 : 2]));
      const ps1 = sum(ms.map(m => +m.result[m.home == t.id ? 2 : 0]));
      const s = { [tt.isSingle ? 'player' : 'team']: t.name, id: t.id, total: ms.length, w: wn, l: ln, [tt.isSingle ? 'gw' : (tt.groups ? 'mw' : 'points')]: ps, rank: t.rank, group: t.group };
      if (tt.isSingle) s.gl = ps1;
      if (tt.groups) {
        s.ml = ps1;
        s.gw = sum(ms.map(m => sum(m.games.filter(g => g.result).map(g => +g.result[m.home == t.id ? 0 : 2]))));
        s.gl = sum(ms.map(m => sum(m.games.filter(g => g.result).map(g => +g.result[m.home == t.id ? 2 : 0]))));
      }
      return s;
    });
    
    const p = pipe(
      sortWith(tt.isSingle ? [dw, at, dp(1), al] : (tt.groups ? [dw, at, dm, am, dl, al] : [dp(0), at, dw])),
      addIndex('rank')
    );

    return tt.has2half ? pipe(sortBy(prop('rank')), split2, map(p))(st) :
      (tt.teams && tt.teams.length > 0 && !isNil(tt.teams[0].group) ? pipe(groupBy(t => t.group), toPairs, map(x => x[1]), map(p))(st) :
      p(st));
  }
);

const ko = createSelector(
  tournament,
  t => {
    const kos = (t.schedules || []).filter(s => s.ko);
    if (kos.length === 0) return null;
    const ms = sortBy(s => s.ko, kos)[0].matches;
    if (ms.length === 1 || ms.some(m => !m.result || m.result == '0:0')) return null;
    return ms.map(m => m.result[0] > m.result[2] ? m.home : m.away);
  }
);

const isSamePlayer = (p1, id) => p1 && id && p1.id == id || false;
const isHomePlayer = p => g => isSamePlayer(p, g.p1) || isSamePlayer(p, g.p3);
const isAwayPlayer = p => g => isSamePlayer(p, g.p2) || isSamePlayer(p, g.p4);
const isPlayerInGame = p => anyPass([isHomePlayer(p), isAwayPlayer(p)]);
const isPlayerWin = p => g => (isHomePlayer(p)(g) && g.isWin) || (isAwayPlayer(p)(g) && !g.isWin);
const isPlayerLose = p => g => (isHomePlayer(p)(g) && !g.isWin) || (isAwayPlayer(p)(g) && g.isWin);
const isPlayerSub = p => g => teams => (isHomePlayer(p)(g) && findById(p.id)(findById(g.t1)(teams).players).isSub) || (isAwayPlayer(p)(g) && findById(p.id)(findById(g.t2)(teams).players).isSub);

const stats = createSelector(
  tournament,
  players,
  (t, ps) => {
    const teams = t.teams || [];

    const players = pipe(
      map(x => x.players.map(p => ({...p, isUpperDiv: x.rank <= teams.length / 2}))),
      unnest,
      where(x => !x.isSub),
      uniqBy(x => +x.id)
    )(teams);

    const st = pipe(
      map(p => {
        const gs = (t.games || []).filter(isPlayerInGame(p)).filter(g => !isPlayerSub(p)(g)(teams));
        const sgs = gs.filter(g => !g.isDouble);
        const dgs = gs.filter(g => g.isDouble);
        const total = sgs.length;
        const wins = sgs.filter(isPlayerWin(p));
        const loses = sgs.filter(isPlayerLose(p));
        const gw = sum(sgs.map(g => +g.result[isHomePlayer(p)(g) ? 0 : 2]));
        const gl = sum(sgs.map(g => +g.result[isHomePlayer(p)(g) ? 2 : 0]));
        const w = wins.length;
        const l = loses.length;
        const d = w - l;
        const wpc = ((total && (w / total)) * 100).toFixed(1) + '%';
        const dwins = dgs.filter(isPlayerWin(p));
        const dloses = dgs.filter(isPlayerLose(p));
        const dw = dwins.length;
        const dl = dloses.length;
        return { player: p.name || getNameById(p.id)(ps), 'mp': total, w, l, '+/-': d > 0 ? '+' + d : d, 'win %': wpc, gw, gl, dw, dl };
      }),
      sortWith([descend(x => +x['+/-']), descend(x => +(dropLast(1, x['win %']))), descend(x => x.gw), ascend(x => x.gl)]),
      addIndex('#')
    );
    
    if (t.has2half) {
      const p1 = players.filter(x => x.isUpperDiv);
      const p2 = players.filter(x => !x.isUpperDiv);
      return map(st, [p1, p2]);
    }

    return st(players);
  }
);

const history = createSelector(
  _history,
  players,
  (h, ps) => sortWith(
    [
      descend(g => new Date(g.date)),
      descend(g => (g.group && +g.group) || Number.POSITIVE_INFINITY),
      descend(g => (g.round && +g.round) || Number.POSITIVE_INFINITY),
      ascend(g => g.ko || 0),
      descend(prop('id'))
    ],
    h.map(x => {
      const g = x.games;
      let player1 = `${getNameById(g.p1)(ps)} (${g.p1Rating} ${(g.p1Diff > 0 ? '+ ' : '- ') + Math.abs(g.p1Diff)} = ${Math.max(100, g.p1Rating + g.p1Diff)})`;
      let player2 = `${getNameById(g.p2)(ps)} (${g.p2Rating} ${(g.p2Diff > 0 ? '+ ' : '- ') + Math.abs(g.p2Diff)} = ${Math.max(100, g.p2Rating + g.p2Diff)})`;

      if (g.p1 === +x.pid) player1 = Italic(player1);
      else player2 = Italic(player2);

      if (+g.result[0] > +g.result[2]) player1 = Bold(player1);
      else player2 = Bold(player2);

      return {
        id: g.id,
        date: toDate(g.date),
        tournament: x.name,
        month: toMonth(g.date),
        player1,
        result: g.result,
        player2,
        group: g.group,
        ko: g.ko,
        round: g.round
      };
    })
  )
  //groupWith((a, b) => a.month === b.month, gs).forEach(x => x[0].isLastGameInMonth = true);
);

const monthRatings = createSelector(
  history,
  h => h.filter(x => x.isLastGameInMonth).map(x => ({ text: x.month, value: x.rating }))
);

export const successSelector = a => mapStateWithSelectors({ success: success(a) });
export const lookupSelector = mapStateWithSelectors({ lookup, lang, isMobile });
export const langSelector = mapStateWithSelectors({ lang });
export const catsSelector = mapStateWithSelectors({ cats, cat: form('cat'), lang });
export const productsSelector = mapStateWithSelectors({ products: filteredProducts, productFilter: filter('product'), lookup, lang, product: form('product'), cats: catsDD });
export const ratingSelector = mapStateWithSelectors({ players: filteredPlayers });
export const playersSelector = mapStateWithSelectors({ players, lookup, player: form('player') });
export const tournamentsSelector = mapStateWithSelectors({ tournaments: tournamentsWithYears, lookup });
export const tournamentSelector = mapStateWithSelectors({ tournament, lookup, players, formMatch: form('match'), newGameId });
export const tourSelector = mapStateWithSelectors({ tournament: form('tournament'), tournaments, players, standing, ko });
export const historySelector = mapStateWithSelectors({ history, lookup, players });
export const standingSelector = mapStateWithSelectors({ standing, tournament, players });
export const teamSelector = mapStateWithSelectors({ tournament, team: form('team'), players, monthRatings });
export const scheduleSelector = mapStateWithSelectors({ tournament, schedule: form('schedule'), players });
export const gameSelector = mapStateWithSelectors({ tournament, players, game: form('game') });
export const statsSelector = mapStateWithSelectors({ tournament, stats });
export const authSelector = mapStateWithSelectors({ auth, login: form('login') });
