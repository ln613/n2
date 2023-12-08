const jwt = require('jsonwebtoken')
const R = require('ramda')
const axios = require('axios')
const moment = require('moment')

const e = {}

e.isDev = process.env.NODE_ENV === 'development'

e.tap = x => R.tap(console.log, R.isNil(x) ? 'null' : x)

e.serial = (arr, func) =>
  arr.reduce(
    (promise, next) =>
      promise.then(r => func(next).then(r1 => R.append(r1, r))),
    Promise.resolve([])
  )

e.sort = R.sort((a, b) => a - b)

e.sortDesc = R.sort((a, b) => b - a)

e.isOdd = n => n % 2 === 1

e.trynull = f => {
  try {
    return f()
  } catch (e) {
    return null
  }
}

e.httpGet = url => axios.get(url).then(r => r.data)

e.authorize = async headers => {
  try {
    await jwt.verify(headers.token || headers['x-nf-geo'], process.env.JWT_SECRET)
    return true
  } catch (e) {
    return `${e.toString()} - ${JSON.stringify(headers)}`
  }
}

const rrCycle = (x, r, l) => (x < r ? x - r + l : x - r + 1)

e.rrSchedule = (x, sorted, continuousId) => {
  const l = sorted ? x : R.sortWith([R.descend(R.prop('rating'))], x)
  if (e.isOdd(l.length)) l.push({ id: null })
  const t1 = R.range(1, l.length)
  const t2 = R.range(0, l.length / 2)
  return t1.map((r, i) => {
    const l1 = t1.map(n => l[rrCycle(n, r, l.length)])
    const l2 = R.insert(0, l[0], l1)
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

e.getTeamRating = (t, p3) =>
  t.players
    ? t.players.length > 1
      ? R.pipe(
          R.map(x => +(x.isSub ? 0 : x.tRating || x.rating)),
          e.sort,
          R.takeLast(p3 ? 3 : 2),
          R.sum
        )(t.players)
      : t.players.length === 1
      ? t.players[0].rating
      : 0
    : 0

const changeTable = (i, j, n, sids) => {
  const j1 = sids[i % n]
  return j === 0 ? j1 : j === j1 ? 0 : j
}

e.rrScheduleTeam = (teams, startDate, ids) => {
  if (!ids) ids = R.range(1, Math.min(Math.floor(teams.length / 2) + 1, 7))
  const sids = e.shuffle(R.range(0, ids.length))

  return R.compose(
    rs =>
      rs.map((w, i) => ({
        id: i + 1,
        matches: w.map((m, j) => {
          m.round = i + 1
          m.id = ids[changeTable(i, j, ids.length, sids)]
          return m
        }),
        date: e.toDateOnly(moment(startDate).add(i, 'week').toDate()),
      })),
    R.splitEvery(ids.length),
    R.unnest,
    e.rrSchedule,
    R.map(t => ({ ...t, rating: e.getTeamRating(t) }))
  )(teams)
}

e.json2js = x =>
  JSON.parse(x, (k, v) =>
    R.takeLast(4, k).toLowerCase() === 'date' ? new Date(v) : v
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
  return n === -1 ? R.last(rdiff) : rdiff[n]
}

e.adjustRating = (g, im = true) => {
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

e.newRating = (r, d) => Math.max(r + d, 100)

e.sortTeam = (team, p3) =>
  R.pipe(
    R.map(t => [e.getTeamRating(t, p3), t]),
    R.sortWith([R.descend(R.nth(0))]),
    R.map(R.nth(1))
  )(team)

e.numOfGroups = n => Math.pow(2, Math.floor(Math.log10(n / 3) / Math.log10(2)))

e.group = (ts, nog) => {
  const n = ts.length
  const g = nog || e.numOfGroups(n)
  return ts.map((t, i) => {
    const l = Math.floor(i / g)
    const c = i % g
    const group = e.isOdd(l) ? g - c : c + 1
    return { ...t, group }
  })
}

e.gengames = (t, t1, t2) => {
  const team1 = e.findById(t1)(t.teams)
  const team2 = e.findById(t2)(t.teams)
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
    const gs1 = R.xprod(pm(ps1), pm(ps2)).map((x, n) => ({
      id: n + 1,
      date: t.startDate,
      t1,
      t2,
      p1: x[0][0],
      p2: x[1][0],
      p3: x[0][1],
      p4: x[1][1],
    }))
    const gs2 = R.xprod(ps1, ps2).map((x, n) => ({
      id: n + 10,
      date: t.startDate,
      t1,
      t2,
      p1: x[0],
      p2: x[1],
    }))
    return gs1.concat(gs2)
  }

  return R.range(0, 5).map(n => ({
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

e.toDateOnly = d =>
  R.is(String, d)
    ? R.take(10, d).replace(/\//g, '-')
    : moment(d).add(8, 'hours').format('YYYY-MM-DD')

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Allow-Methods':
    'GET,OPTIONS,POST,PUT,PATCH,DELETE,COPY,PURGE',
}

e.res = (body, code) => ({
  statusCode: code || 200,
  headers: {
    ...(e.isDev ? cors : {}),
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
})

e.res401 = () => e.res({ isAuthenticated: false }, 401)

e.resAuth = token => e.res({ isAuthenticated: true, token })

e.policy = r => ({
  principalId: process.env.PRINCIPALID,
  policyDocument: {
    Statement: [{ Action: 'execute-api:Invoke', Effect: 'Allow', Resource: r }],
  },
})

e.parseCookie = r =>
  R.fromPairs((r.multiValueHeaders.cookie || []).map(c => c.split('=')))

e.swap = R.curry((i1, i2, arr) => {
  const t = arr[i1]
  arr[i1] = arr[i2]
  arr[i2] = t
})

e.shuffle = arr => {
  let i1 = arr.length
  while (i1 !== 0) {
    i1--
    const i2 = Math.floor(Math.random() * i1)
    e.swap(i1, i2, arr)
  }
  return arr
}

e.sortBy = R.curry((o, arr) =>
  R.sortWith(
    R.is(String, o)
      ? [R.ascend(R.prop(o))]
      : Object.entries(o).map(([k, v]) =>
          (v ? R.descend : R.ascend)(R.prop(k))
        ),
    arr
  )
)

e.split2 = isCeil => arr =>
  R.splitAt((isCeil ? Math.ceil : Math.floor)(arr.length / 2), arr)

e.findByProp = R.curry((p, val, arr) => R.find(x => x[p] == val, arr || []))
e.findById = e.findByProp('id')
e.findByName = e.findByProp('name')
e.getPropById = R.curry((p, id) => R.pipe(e.findById(id), R.prop(p)))
e.getNameById = e.getPropById('name')

e.use =
  (...args) =>
  f =>
    f(...args)

module.exports = e
