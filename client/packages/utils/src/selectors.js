import { reduce, prop, sortWith, ascend, descend, unnest, find, isEmpty, groupBy, join, sum, range, pipe, map, uniqBy, anyPass, both } from 'ramda';
import { createSelector, mapStateWithSelectors } from 'no-redux';
import { findById, getNameById, toDate, addIndex, diff, tap } from '.';

const _form = s => s.form || {};
const _filter = s => s.filter || {};

const form = p => s => _form(s)[p] || {};
const filter = p => s => _filter(s)[p] || {};

const isLoading = s => s.isLoading;
const lastAction = s => s.lastAction || '';
const error = s => s.error;
const lookup = s => s.lookup || {};
const lang = s => s.lang || {};
const cats = s => s.cats || [];
const products = s => s.products || [];
const _players = s => s.players || [];
const tournaments = s => s.tournaments || [];
const _tournament = s => s.tournament || {};
const history = s => s.history || [];

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

const players = createSelector(
  _players,
  ps => sortWith([ascend(prop('name'))])(ps.map(p => ({ ...p, name: p.firstName + ' ' + p.lastName })).map(p => ({ ...p, text: p.name, value: p.id })))
);

const filteredPlayers = createSelector(
  players,
  form('player'),
  (ps, f) => sortWith([descend(prop('rating'))])(ps.filter(p => isEmpty(f) || p.name.toLowerCase().indexOf(f) > -1))
);

const dsPlayers = createSelector(
  filteredPlayers,
  ps => ps.map(p => ({ ...p, text: `${p.name} (${p.rating})` }))
);

const teams = createSelector(
  _tournament,
  t => t.teams || []
);

const pn = (n, g) => g['p' + n];
const findGames = (s, m, gs) => gs.filter(g => g.t1 == m.home && g.t2 == m.away);
const gg = (g, x) => +(g && g[x] || 0);
const getResult = g => g.result || (range(0, 5).filter(n => gg(g.g1, n) > gg(g.g2, n)).length + ':' + range(0, 5).filter(n => gg(g.g1, n) < gg(g.g2, n)).length);
const getPlayerName = (n, g, ps) => getNameById(pn(n, g))(ps) + (g.isDouble ? ' / ' + getNameById(pn(n + 2, g))(ps) : '');
const getPlayer = (pid, tid, ts) => findById(pid)(findById(tid)(ts).players);
const subs = (n, g) => (pn(n, g) || {}).isSub ? 1 : 0;
const totalSubs = g => subs(1, g) + subs(3, g) - subs(2, g) - subs(4, g);
const isWin = g => {
  const s = totalSubs(g);
  return s === 0 ? g.result[0] > g.result[2] : s < 0;
}

const tournament = createSelector(
  _tournament,
  players,
  (t, ps) => {
    if (ps.length === 0) return t;
    const teams = (t.teams || []).map(t => ({ ...t, text: t.name, value: t.id, players: t.players.map(p => ({ ...findById(p.id)(ps), initRating: p.rating, isSub: p.isSub })) }));
    const games = (t.games || []).map(g => {
      const result = getResult(g);
      const p1 = getPlayer(g.p1, g.t1, teams);
      const p2 = getPlayer(g.p2, g.t2, teams);
      const p3 = getPlayer(g.p3, g.t1, teams);
      const p4 = getPlayer(g.p4, g.t2, teams);
      const game = {...g, p1, p2, p3, p4, result, player1: getPlayerName(1, g, ps), player2: getPlayerName(2, g, ps)};
      game.isWin = isWin(game);
      return game;
    });
    const schedules = (t.schedules || []).map(s => ({
      ...s,
      date: toDate(s.date),
      matches: range(1, 9)
        .map(n => findById(n)(s.matches) || {})
        .map(m => {
          const gs = findGames(s, m, games);
          const wn = gs.filter(g => g.isWin).length;
          const ln = gs.length - wn;
          return {...m, result: wn + ':' + ln };
        })
    }));
    return teams.length > 0 ? { ...t, teams, schedules, games } : t;
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

const standing = createSelector(
  tournament,
  teams,
  (tt, ts) => pipe(
    sortWith([descend(prop('points')), ascend(prop('total')), descend(prop('w'))]),
    addIndex('rank')
  )(ts.map(t => {
    const ms = unnest(tt.schedules.map(s => s.matches)).filter(m => (m.home == t.id || m.away == t.id) && m.result != '0:0');
    const ws = ms.filter(m => (m.home == t.id && m.result[0] > m.result[2]) || (m.away == t.id && m.result[0] < m.result[2]));
    const wn = ws.length;
    const ln = ms.length - wn;
    const ps = sum(ms.map(m => +m.result[m.home == t.id ? 0 : 2]));
    return { team: t.name, total: ms.length, w: wn, l: ln, points: ps };
  }))
);

const isSamePlayer = (p1, p2) => p1 && p2 && p1.id === p2.id;
const isHomePlayer = p => g => isSamePlayer(g.p1, p) || isSamePlayer(g.p3, p);
const isAwayPlayer = p => g => isSamePlayer(g.p2, p) || isSamePlayer(g.p4, p);
const isPlayerInGame = anyPass([isHomePlayer, isAwayPlayer]);
const isPlayerWin = p => g => (isHomePlayer(p)(g) && g.isWin) || (isAwayPlayer(p)(g) && !g.isWin);

const stats = createSelector(
  tournament,
  t => pipe(
    map(x => x.players),
    unnest,
    uniqBy(x => x.id),
    ps => ps.map(p => {
      const gs = (t.games || []).filter(isPlayerInGame(p));
      const sgs = gs.filter(g => !g.isDouble);
      const dgs = gs.filter(g => g.isDouble);
      const total = sgs.length;
      const wins = sgs.filter(isPlayerWin(p));
      const loses = diff(sgs, wins);
      const gw = sum(sgs.map(g => +g.result[isHomePlayer(p)(g) ? 0 : 2]));
      const gl = sum(sgs.map(g => +g.result[isHomePlayer(p)(g) ? 2 : 0]));
      const w = wins.length;
      const l = loses.length;
      const d = w - l;
      const wpc = ((total && (w / total)) * 100).toFixed(1) + '%';
      const dwins = dgs.filter(isPlayerWin(p));
      const dloses = diff(dgs, dwins);
      const dw = dwins.length;
      const dl = dloses.length;
      return { player: p.name, 'mp': total, w, l, '+/-': d > 0 ? '+' + d : d, 'win %': wpc, gw, gl, dw, dl };
    }),
    sortWith([descend(prop('+/-')), descend(prop('win %'))]),
    addIndex('rank')
  )(t.teams || [])
);

const historyTable = createSelector(
  history,
  players,
  (h, ps) => sortWith([descend(prop('date'))], h.map(x => x.games)).map(g => ({
    id: g.id,
    date: toDate(g.date),
    player1: `${getNameById(g.p1)(ps)} (${g.p1Rating} ${(g.p1Diff > 0 ? '+ ' : '- ') + Math.abs(g.p1Diff)} = ${g.p1Rating + g.p1Diff})`,
    player2: `${getNameById(g.p2)(ps)} (${g.p2Rating} ${(g.p2Diff > 0 ? '+ ' : '- ') + Math.abs(g.p2Diff)} = ${g.p2Rating + g.p2Diff})`,
    result: g.result
  }))
);

export const successSelector = a => mapStateWithSelectors({ success: success(a) });
export const lookupSelector = mapStateWithSelectors({ lookup, lang });
export const langSelector = mapStateWithSelectors({ lang });
export const catsSelector = mapStateWithSelectors({ cats, cat: form('cat'), lang });
export const productsSelector = mapStateWithSelectors({ products: filteredProducts, productFilter: filter('product'), lookup, lang, product: form('product'), cats: catsDD });
export const ratingsSelector = mapStateWithSelectors({ cats, form, lang });
export const playersSelector = mapStateWithSelectors({ players, lookup, player: form('player') });
export const tournamentsSelector = mapStateWithSelectors({ tournaments: tournamentsWithYears, lookup });
export const tournamentSelector = mapStateWithSelectors({ tournament, lookup, players });
export const tourSelector = mapStateWithSelectors({ tournament: form('tournament'), tournaments });
export const historySelector = mapStateWithSelectors({ history: historyTable, lookup, players });
export const standingSelector = mapStateWithSelectors({ standing, tournament });
export const teamSelector = mapStateWithSelectors({ tournament, team: form('team'), players });
export const scheduleSelector = mapStateWithSelectors({ tournament, schedule: form('schedule') });
export const gameSelector = mapStateWithSelectors({ tournament, players, game: form('game') });
export const statsSelector = mapStateWithSelectors({ tournament, stats });
