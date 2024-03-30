import React from 'react'
import { range, splitEvery, fromPairs, mergeDeepLeft, drop } from 'ramda'
import { connect } from '@ln613/state'
import { compose } from 'recompose'
import { lookupSelector } from 'utils/selectors'
import { Table, withMobile } from '@ln613/ui/semantic'
import moment from 'moment'

const names = ['Drop In', 'Training', 'League']
const bg = ['Green', 'Orange', 'Cornflowerblue']
const tt = {
  Sun: {
    schedules: [
      [0, '12:30pm', '12am'],
      [1, '1:30pm', '6:30pm'],
    ],
  },
  Mon: {
    schedules: [
      [0, '11am', '12am'],
      [2, '7pm', '9:30pm'],
    ],
  },
  Tue: { schedules: [[0, '11am', '6:30pm']] },
  Wed: { schedules: [[0, '11am', '12am']] },
  Thu: { schedules: [[0, '11am', '6:30pm']] },
  Fri: {
    schedules: [
      [0, '11am', '12am'],
      [2, '7:30pm', '9:30pm'],
    ],
  },
  Sat: {
    schedules: [
      [0, '11am', '12am'],
      [1, '6:45pm', '9:45pm'],
    ],
  },
}
// const sm13 = [[0, '1:00', '6']]
const ssun3 = [[0, '2pm', '12am']]

const getDates = () => {
  const s1 = moment().startOf('month')
  const e1 = moment().endOf('month')
  const s2 = moment(s1).startOf('week')
  const e2 = moment(e1).endOf('week')
  const m1 = moment(s2).add(1, 'days')
  if (m1.month() !== s1.month()) m1.add(1, 'weeks')
  const m3 = moment(m1).add(2, 'weeks')
  const sun3 = moment(s2).add(s1.month() === s2.month() ? 2 : 3, 'weeks')
  const dates = range(0, e2.diff(s2, 'days') + 1).map(x =>
    moment(s2).add(x, 'days')
  )
  const rs = splitEvery(7, dates)
    .map(x => fromPairs(x.map(d => [d.format('ddd'), { date: d.date(), d }])))
    .map(x => mergeDeepLeft(x, tt))
  rs.forEach(r => {
    // Object.keys(r)
    //   .filter(k => r[k].d.isSame(m1) || r[k].d.isSame(m3))
    //   .forEach(k => (r[k].schedules = sm13))
    Object.keys(r)
      .filter(k => r[k].d.isSame(sun3))
      .forEach(k => (r[k].schedules = ssun3.concat(drop(2, tt.Sun.schedules))))
  })
  return rs
}

const thisMonth = d => {
  const s1 = moment().startOf('month')
  const e1 = moment().endOf('month')
  return d >= s1 && d <= e1
}

const Calendar = ({ lookup, isMobile }) => (
  <div className="p16 fv">
    <h1>Calendar - {moment().format('YYYY MMMM')}</h1>
    <hr />
    <div className="f">
      {names.map((x, i) => (
        <div className={`br4 m4 white p4 ${bg[i]}`}>{x}</div>
      ))}
    </div>
    <Table name="calendar" data={getDates()} isMobile={isMobile}>
      <td className="vat">
        {(_, x) => (
          <div className={`fv ${thisMonth(x.d) ? '' : 'op30'}`}>
            <div>{x.date}</div>
            {x.schedules.map(s => (
              <div
                className={`br4 mv4 white p4 ${bg[s[0]]}`}
              >{`${s[1]} - ${s[2]}`}</div>
            ))}
          </div>
        )}
      </td>
    </Table>
  </div>
)

export default compose(connect(lookupSelector), withMobile)(Calendar)
