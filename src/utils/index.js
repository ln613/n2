import { last, isNil, pipe, filter, map, fromPairs, isEmpty as _isEmpty, either } from 'ramda';

export const isDev = process.env.NODE_ENV === 'development';

export const isEmpty = either(isNil, _isEmpty);

export const cdurl = (l, c, n) => l.cdVersion ? `http://res.cloudinary.com/vttc/image/upload/v${l.cdVersion}/${c}/${n}.jpg` : '';

const rdiff = [[3,0],[5,-2],[8,-5],[10,-7],[13,-9],[15,-11],[18,-14],[20,-16],[25,-21],[30,-26],[35,-31],[40,-36],[45,-41],[50,-45],[55,-50]];
const rdelta = [401,301,201,151,101,51,26,-24,-49,-99,-149,-199,-299,-399];

const rateDiff = (r1, r2) => {
  const n = rdelta.findIndex(x => x <= r1 - r2);
  return n === -1 ? last(rdiff) : rdiff[n];
}

export const winner = x => x && x.result && x.result !== '0:0' ? (+x.result[0] > +x.result[2] ? 1 : 2) : 0;

export const adjustRating = g => {
  if (g.isDouble) {
      return g;
  } else {
    const p1Win = +g.result[0] > +g.result[2];
    const d = p1Win ? rateDiff(g.p1Rating, g.p2Rating) : rateDiff(g.p2Rating, g.p1Rating);
    return {...g, p1Diff: p1Win ? d[0] : d[1], p2Diff: p1Win ? d[1] : d[0]};
  }
}

export const toGame = (g, s, m) => {
  const g1 = adjustRating({ id: g.id, isDouble: g.isDouble, date: s.date, t1: +m.home, t2: +m.away, p1: +g.p1, p2: +g.p2, p1Rating: g.p1Rating, p2Rating: g.p2Rating, result: g.result });
  if (g.isDouble) {
    g1.p3 = +g.p3;
    g1.p4 = +g.p4;
  }
  if (!isNil(s.group)) g1.group = s.group;
  if (s.ko) g1.ko = s.ko;
  return g1;
}

export const newRating = (r, d) => Math.max(r + d, 100)

export const resultOptions = ['', '3:0', '3:1', '3:2', '2:3', '1:3', '0:3', '2:0', '2:1', '1:2', '0:2'];

export const kos = ['Final', 'Semifinals', 'Quarterfinals' ];

export const highlightWinner = g => {
  const w = winner(g);
  return !w ? g : pipe(
    filter(k => g[k]),
    map(k => [k, `<b>${g[k]}</b>`]),
    fromPairs,
    o => ({...g, ...o}),
  )(['player' + w, 'team' + w, w === 1 ? 'home' : 'away']);
}

export const highlightSub = (n, isSub) => n + (isSub ? ' (Sub)' : '');
