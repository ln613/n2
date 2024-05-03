import {
  descend,
  ascend,
  prop,
  sum,
  pipe,
  groupBy,
  map,
  sortWith,
  dropLast,
} from 'ramda'
import { addIndex, getNameById, tap } from '../utils'

const dp = s => descend(prop(s ? 'gw' : 'points'))
const at = ascend(prop('total'))
const dw = descend(prop('w'))
const dl = descend(prop('gw'))
const al = ascend(prop('gl'))
const dm = descend(prop('mw'))
const am = ascend(prop('ml'))
const da = descend(x => (x.total > 0 ? 1 : 0)) // absent rank last
// 2-way tie in group, whoever wins rank higher
const de = stg =>
  descend(x => {
    const stg1 = stg[x.group][x.w] || []
    return stg1.length === 2
      ? x.losers.indexOf(stg1[0].id === x.id ? stg1[1].id : stg1[0].id) > -1
        ? 2
        : 1
      : 0
  })

export const homeResult = r => +r.split(':')[0]

export const awayResult = r => +r.split(':')[1]

export const selfResult = (r, isHome) => (isHome ? homeResult : awayResult)(r)

export const oppoResult = (r, isHome) => (isHome ? awayResult : homeResult)(r)

export const homeWin = r => {
  const rs = r.split(':')
  return +rs[0] > +rs[1]
}

export const awayWin = r => {
  const rs = r.split(':')
  return +rs[0] < +rs[1]
}

const getUniqProp = (a, p) => (a && a.length > 0 ? a[0][p] : null)

// tournament, team or player, matches
export const teamRank = (t, tp, ms) => {
  const fms = ms.filter(x => x.result !== '0:0')
  const total = fms.length
  const ws = fms.filter(
    m =>
      (m.home === tp.id && homeWin(m.result)) ||
      (m.away === tp.id && awayWin(m.result))
  )
  const wn = ws.length
  const ln = fms.length - wn
  const d = wn - ln
  const wpc = ((total && wn / total) * 100).toFixed(1) + '%'
  const ps = sum(fms.map(m => selfResult(m.result, m.home == tp.id)))
  const ps1 = sum(fms.map(m => oppoResult(m.result, m.home == tp.id)))
  const s = {
    [t.isSingle ? 'player' : 'team']: tp.name,
    id: tp.id,
    total,
    w: wn,
    l: ln,
    '+/-': d > 0 ? '+' + d : d,
    'win %': wpc,
    [t.isSingle ? 'gw' : t.groups ? 'mw' : 'points']: ps,
    ml: ps1,
    rank: tp.rank,
    group: t.isUpDown ? getUniqProp(ms, 'group') : tp.group,
    date: t.isUpDown ? getUniqProp(ms, 'date') : null,
  }
  if (t.isSingle) s.gl = ps1
  s.losers = ws.map(m => (m.home === tp.id ? m.away : m.home))
  if (t.groups) {
    s.ml = ps1
    s.gw = sum(
      ms.map(m =>
        sum(
          m.games
            .filter(g => g.result)
            .map(g => selfResult(g.result, m.home == tp.id))
        )
      )
    )
    s.gl = sum(
      ms.map(m =>
        sum(
          m.games
            .filter(g => g.result)
            .map(g => oppoResult(g.result, m.home == tp.id))
        )
      )
    )
  }
  return s
}

const stg = pipe(groupBy(prop('group')), map(groupBy(prop('w'))))

// tournament, teamRanks
export const sortByRank = t => ranks =>
  pipe(
    sortWith(
      t.isSingle
        ? [dw, at, dp(1), al]
        : t.isGolden
        ? [dw, at, dp(0), al]
        : t.groups
        ? [da, dw, at, de(stg(ranks)), dm, am, dl, al]
        : t.isBestOfN
        ? [
            descend(x => +x['+/-']),
            descend(x => +dropLast(1, x['win %'])),
            dp(0),
            am,
          ]
        : [dp(0), at, dw, am]
    ),
    addIndex('rank')
  )(ranks)

export const getUpDownMatchWithResult = (t, s, m, ps) => {
  const gs = (t.games || []).filter(
    g =>
      g.date == s.date && g.group == s.group && g.t1 == m.home && g.t2 == m.away
  )
  return {
    ...m,
    player1: ps ? getNameById(m.home)(ps) : m.home,
    player2: ps ? getNameById(m.away)(ps) : m.away,
    result: gs.length > 0 ? gs[0].result : '',
  }
}
