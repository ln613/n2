import jwt from 'jsonwebtoken'
import { tap as _tap, isNil, append, sort as _sort, sortWith, descend, ascend, range, prop, insert, map, pipe, takeLast, sum, compose, splitEvery, unnest, last, xprod, take, curry, splitAt, find, is, fromPairs, nth } from 'ramda'
import axios from 'axios'
import moment from 'moment'

export const isDev = process.env.NODE_ENV === 'development'

export const tap = x => _tap(console.log, isNil(x) ? 'null' : x)

export const serial = (arr, func) =>
  arr.reduce(
    (promise, next) =>
      promise.then(r => func(next).then(r1 => append(r1, r))),
    Promise.resolve([])
  )

export const sort = _sort((a, b) => a - b)

export const sortDesc = _sort((a, b) => b - a)

export const isOdd = n => n % 2 === 1

export const trynull = f => {
  try {
    return f()
  } catch (e) {
    return null
  }
}

export const httpGet = url => axios.get(url).then(r => r.data)

export const authorize = async token => {
  try {
    await jwt.verify(token, process.env.JWT_SECRET)
    return true
  } catch (e) {
    return false
  }
}

const rrCycle = (x, r, l) => (x < r ? x - r + l : x - r + 1)

export const rrSchedule = (x, sorted, continuousId) => {
  const l = sorted ? x : sortWith([descend(prop('rating'))], x)
  if (isOdd(l.length)) l.push({ id: null })
  const t1 = range(1, l.length)
  const t2 = range(0, l.length / 2)
  return t1.map((r, i) => {
    const l1 = t1.map(n => l[rrCycle(n, r, l.length)])
    const l2 = insert(0, l[0], l1)
    return t2
      .map(n => ({
        round: i + 1,
        home: l2[n].id,
        away: l2[l.length - n - 1].id,
      }))
      .filter(t => t.home && t.away)
      .map((t, j) => ({
        ...t,
        id: continuousId ? (i * l.length) / 2 + j + 1 : j + 1,
      }))
  })
}

export const getTeamRating = (t, p3) =>
  t.players
    ? t.players.length > 1
      ? pipe(
          map(x => +(x.isSub ? 0 : x.tRating || x.rating)),
          sort,
          takeLast(p3 ? 3 : 2),
          sum
        )(t.players)
      : t.players.length === 1
      ? t.players[0].rating
      : 0
    : 0

const changeTable = (i, j, n, sids) => {
  const j1 = sids[i % n]
  return j === 0 ? j1 : j === j1 ? 0 : j
}

export const rrScheduleTeam = (teams, startDate, ids) => {
  if (!ids) ids = range(1, Math.min(Math.floor(teams.length / 2) + 1, 7))
  const sids = shuffle(range(0, ids.length))

  return compose(
    rs =>
      rs.map((w, i) => ({
        id: i + 1,
        matches: w.map((m, j) => {
          m.round = i + 1
          m.id = ids[changeTable(i, j, ids.length, sids)]
          return m
        }),
        date: toDateOnly(moment(startDate).add(i, 'week').toDate()),
      })),
    splitEvery(ids.length),
    unnest,
    rrSchedule,
    map(t => ({ ...t, rating: getTeamRating(t) }))
  )(teams)
}

export const json2js = x =>
  JSON.parse(x, (k, v) =>
    takeLast(4, k).toLowerCase() === 'date' ? new Date(v) : v
  )

const rdiff = [
  [3, 0],
  [5, -2],
  [8, -5],
  [10, -7],
  [13, -9],
  [15, -11],
  [18, -14],
  [20, -16],
  [25, -21],
  [30, -26],
  [35, -31],
  [40, -36],
  [45, -41],
  [50, -45],
  [55, -50],
]
const rdelta = [
  401, 301, 201, 151, 101, 51, 26, -24, -49, -99, -149, -199, -299, -399,
]

const rateDiff = (r1, r2) => {
  const n = rdelta.findIndex(x => x <= r1 - r2)
  return n === -1 ? last(rdiff) : rdiff[n]
}

export const adjustRating = (g, im = true) => {
  if (g.isDouble || !g.result || g.result === '0:0') {
    return g
  } else {
    const p1Win = +g.result[0] > +g.result[2]
    const d = p1Win
      ? rateDiff(g.p1Rating, g.p2Rating)
      : rateDiff(g.p2Rating, g.p1Rating)
    const c = { p1Diff: p1Win ? d[0] : d[1], p2Diff: p1Win ? d[1] : d[0] }
    return im ? Object.assign({}, g, c) : Object.assign(g, c)
  }
}

export const newRating = (r, d) => Math.max(r + d, 100)

export const sortTeam = (team, p3) =>
  pipe(
    map(t => [getTeamRating(t, p3), t]),
    sortWith([descend(nth(0))]),
    map(nth(1))
  )(team)

export const numOfGroups = n => Math.pow(2, Math.floor(Math.log10(n / 3) / Math.log10(2)))

export const group = (ts, nog) => {
  const n = ts.length
  const g = nog || numOfGroups(n)
  return ts.map((t, i) => {
    const l = Math.floor(i / g)
    const c = i % g
    const group = isOdd(l) ? g - c : c + 1
    return { ...t, group }
  })
}

export const gengames = (t, t1, t2) => {
  const team1 = findById(t1)(t.teams)
  const team2 = findById(t2)(t.teams)
  const ps1 = team1.players.map(x => +x.id)
  const ps2 = team2.players.map(x => +x.id)

  if (ps1.length === 1 && ps2.length === 1) {
    return [{ id: 1, date: t.startDate, t1, t2, p1: ps1[0], p2: ps2[0] }]
  }

  if (t.p3) {
    const p23 = [
      [0, 1],
      [0, 2],
      [1, 2],
    ]
    const pm = ps => p23.map(x => [ps[x[0]], ps[x[1]]])
    const gs1 = xprod(pm(ps1), pm(ps2)).map((x, n) => ({
      id: n + 1,
      date: t.startDate,
      t1,
      t2,
      p1: x[0][0],
      p2: x[1][0],
      p3: x[0][1],
      p4: x[1][1],
    }))
    const gs2 = xprod(ps1, ps2).map((x, n) => ({
      id: n + 10,
      date: t.startDate,
      t1,
      t2,
      p1: x[0],
      p2: x[1],
    }))
    return gs1.concat(gs2)
  }

  return range(0, 5).map(n => ({
    id: n + 1,
    date: t.startDate,
    t1,
    t2,
    p1: +team1.players[n === 1 || n === 4 ? 1 : 0].id,
    p2: +team2.players[n === 0 || n === 4 ? 1 : 0].id,
    p3: n === 2 ? team1.players[1].id : undefined,
    p4: n === 2 ? team2.players[1].id : undefined,
  }))
}

export const toDateOnly = d =>
  is(String, d)
    ? take(10, d).replace(/\//g, '-')
    : moment(d).add(8, 'hours').format('YYYY-MM-DD')

export const nextNWeek = (n, dateString) => toDateOnly(moment(dateString).add(n, 'week').toDate())

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Allow-Methods':
    'GET,OPTIONS,POST,PUT,PATCH,DELETE,COPY,PURGE',
}

export const res = (body, code) => ({
  statusCode: code || 200,
  headers: {
    ...(isDev ? cors : {}),
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
})

export const res401 = () => res({ isAuthenticated: false }, 401)

export const resAuth = token => res({ isAuthenticated: true, token })

export const policy = r => ({
  principalId: process.env.PRINCIPALID,
  policyDocument: {
    Statement: [{ Action: 'execute-api:Invoke', Effect: 'Allow', Resource: r }],
  },
})

export const parseCookie = r =>
  fromPairs((r.multiValueHeaders.cookie || []).map(c => c.split('=')))

export const swap = curry((i1, i2, arr) => {
  const t = arr[i1]
  arr[i1] = arr[i2]
  arr[i2] = t
})

export const shuffle = arr => {
  let i1 = arr.length
  while (i1 !== 0) {
    i1--
    const i2 = Math.floor(Math.random() * i1)
    swap(i1, i2, arr)
  }
  return arr
}

export const sortBy = curry((o, arr) =>
  sortWith(
    is(String, o)
      ? [ascend(prop(o))]
      : Object.entries(o).map(([k, v]) =>
          (v ? descend : ascend)(prop(k))
        ),
    arr
  )
)

export const split2 = isCeil => arr =>
  splitAt((isCeil ? Math.ceil : Math.floor)(arr.length / 2), arr)

export const findByProp = curry((p, val, arr) => find(x => x[p] == val, arr || []))
export const findById = findByProp('id')
export const findByName = findByProp('name')
export const getPropById = curry((p, id) => pipe(findById(id), prop(p)))
export const getNameById = getPropById('name')

export const use =
  (...args) =>
  f =>
    f(...args)
