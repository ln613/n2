import {
  last,
  isNil,
  pipe,
  filter,
  map,
  fromPairs,
  isEmpty as _isEmpty,
  either,
  is,
  take,
  curry,
  prop,
  dissoc,
  ascend,
  descend,
  differenceWith,
  anyPass,
  set as _set,
  view,
  sort as _sort,
  sortWith,
  find,
  splitAt,
  lensPath,
  reduce,
  groupBy,
  toPairs,
} from 'ramda'
import moment from 'moment'

const rePropName =
  /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g // from lodash/fp
const reEscapeChar = /\\(\\)?/g // from lodash/fp

export const tap = (x, title = '', f = t => t, pred = true) => {
  ;(is(Function, pred) ? pred(x) : pred) &&
    console.log(title ? `${title} - ` : '', f(x))
  return x
}

export const isDev = process.env.NODE_ENV === 'development'

export const isEmpty = either(isNil, _isEmpty)

export const toSingleArray = x => (is(Array, x) ? x : [x])

export const cdurl = (l, c, n, f) =>
  l.cdVersion
    ? `http://res.cloudinary.com/vttc/image/upload/${f ? f + '/' : ''}v${
        l.cdVersion
      }/${c}/${n}.png`
    : ''

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

export const winner = x =>
  x && x.result && x.result !== '0:0'
    ? +x.result[0] > +x.result[2]
      ? 1
      : 2
    : 0

export const adjustRating = g => {
  if (g.isDouble) {
    return g
  } else {
    const p1Win = +g.result[0] > +g.result[2]
    const d = p1Win
      ? rateDiff(g.p1Rating, g.p2Rating)
      : rateDiff(g.p2Rating, g.p1Rating)
    return { ...g, p1Diff: p1Win ? d[0] : d[1], p2Diff: p1Win ? d[1] : d[0] }
  }
}

export const toGame = (g, s, m) => {
  const g0 = {
    id: g.id,
    date: s.date,
    t1: +m.home,
    t2: +m.away,
    result: g.result,
  }

  if (g.isGolden) {
    return { ...g0, isGolden: g.isGolden }
  } else {
    const g1 = adjustRating({
      ...g0,
      isDouble: g.isDouble,
      p1: +g.p1,
      p2: +g.p2,
      p1Rating: g.p1Rating,
      p2Rating: g.p2Rating,
    })
    if (g.isDouble) {
      g1.p3 = +g.p3
      g1.p4 = +g.p4
    }
    if (!isNil(s.group)) g1.group = s.group
    if (s.ko) g1.ko = s.ko
    return g1
  }
}

export const newRating = (r, d) => Math.max(r + d, 100)

export const resultOptions = [
  '',
  '3:0',
  '3:1',
  '3:2',
  '2:3',
  '1:3',
  '0:3',
  '2:0',
  '2:1',
  '1:2',
  '0:2',
]

export const goldenResultOptions = ['', '5:0', '0:5']

export const kos = [
  'Final',
  'Semifinals',
  'Quarterfinals',
  'Round of 16',
  'Round of 32',
]

export const highlightWinner = g => {
  const w = winner(g)
  return !w
    ? g
    : pipe(
        filter(k => g[k]),
        map(k => [k, `<b>${g[k]}</b>`]),
        fromPairs,
        o => ({ ...g, ...o })
      )(['player' + w, 'team' + w, w === 1 ? 'home' : 'away'])
}

export const highlightSub = (n, isSub) => n + (isSub ? ' (Sub)' : '')

export const toDateOnly = d =>
  (is(String, d) ? moment(take(10, d)) : moment(d).add(8, 'hours')).format(
    'M/D/YYYY'
  )

export const use =
  (...args) =>
  f =>
    f(...args)

export const toLensPath = p => lensPath(is(String, p) ? stringToPath(p) : p)

// array

export const findByProp = curry((p, val, arr) =>
  find(x => x[p] == val, arr || [])
)
export const findById = findByProp('id')
export const findByName = findByProp('name')
export const getPropById = curry((p, id) => pipe(findById(id), prop(p)))
export const getNameById = getPropById('name')
export const getPropByName = curry((p, name) => pipe(findByName(name), prop(p)))
export const getPropByProp = (p1, p2, val) =>
  pipe(findByProp(p2)(val), prop(p1))

export const sort = _sort((a, b) => a - b)
export const sortDesc = _sort((a, b) => b - a)
export const sortBy = curry((o, arr) =>
  sortWith(
    is(String, o)
      ? [ascend(prop(o))]
      : Object.entries(o).map(([k, v]) => (v ? descend : ascend)(prop(k))),
    arr
  )
)

export const isIn = arr => val => arr.some(item => val === item)
export const split2 = isCeil => arr =>
  splitAt((isCeil ? Math.ceil : Math.floor)(arr.length / 2), arr)
export const addIndex = p => arr =>
  arr.map((x, i) => ({ [p || 'id']: i + 1, ...dissoc([p || 'id'], x) }))

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
export const groupMap = (key, fn) =>
  pipe(
    groupBy(key),
    toPairs,
    map(x => x[1]),
    map(fn)
  )

// string

export const toTitleCase = s =>
  s.replace(
    /\w\S*/g,
    t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
  )
export const toLowerDash = s => s.toLowerCase().replace(/ /g, '-')
export const escapeRegex = s => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
export const isStringNumber = s => !isNaN(+s)
export const padStart = curry((s1, n, s) => s.toString().padStart(n, s1))
export const pad0s = padStart('0')
export const padEnd = curry((s1, n, s) => s.toString().padEnd(n, s1))
export const pad0e = padEnd('0')

export const replace = (s, params) =>
  params && is(Object, params)
    ? reduce(
        (p, c) => p.replace(new RegExp(`{${c}}`, 'g'), params[c]),
        s,
        Object.keys(params)
      )
    : s

export const stringToPath = s => {
  // from lodash/fp
  const result = []
  s.replace(rePropName, (match, number, quote, subString) => {
    const v = quote ? subString.replace(reEscapeChar, '$1') : number || match
    result.push(isStringNumber(v) ? +v : v)
  })
  return result
}

// date

export const toDate = s =>
  use(new Date(s))(d => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`)
export const toMonth = s =>
  use(new Date(s))(d => `${d.getFullYear()}/${d.getMonth() + 1}`)
export const toAbsDate = d => new Date(d).toISOString().slice(0, 10)
export const currentDate = () =>
  use(new Date())(
    d =>
      `${d.getFullYear()}-${pad0s(2, d.getMonth() + 1)}-${pad0s(
        2,
        d.getDate()
      )}`
  )
export const currentTime = () =>
  use(new Date())(
    d =>
      `${pad0s(2, d.getHours())}:${pad0s(2, d.getMinutes())}:${pad0s(
        2,
        d.getSeconds()
      )}`
  )

// object

export const get = pipe(toLensPath, view)
export const set = pipe(toLensPath, _set)
export const isPrimitiveType = anyPass([is(Number), is(String), is(Boolean)])
export const diff = p =>
  differenceWith((a, b) =>
    isPrimitiveType(a) ? a === b : a[p || 'id'] === b[p || 'id']
  )
