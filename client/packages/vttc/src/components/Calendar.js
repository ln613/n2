import React from 'react';
import { range, is, pick, splitEvery, fromPairs, mergeDeepLeft } from 'ramda';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import ImageSlider from './ImageSlider';
import actions from 'utils/actions';
import { lookupSelector } from 'utils/selectors';
import { cdurl, withLoad, withLang, getNameById, findById, tap } from 'utils';
import { withRouter } from "react-router-dom";
import { TextBox, Table } from 'utils/comps';
import moment from 'moment';

const names = ['Drop In', 'Training', 'League'];
const bg = ['Green', 'Orange', 'Purple'];
const tt = {
  Sunday: { schedules: [[0, '12', '7'], [2, '7:15', '9:30'], [0, '9:30', '11']] },
  Monday: { schedules: [[0, '12', '6']] },
  Tuesday: { schedules: [[0, '12', '6']] },
  Wednesday: { schedules: [[0, '12', '11']] },
  Thursday: { schedules: [[0, '12', '6']] },
  Friday: { schedules: [[0, '12', '7'], [2, '7:15', '9:30'], [0, '9:30', '11']] },
  Saturday: { schedules: [[0, '12', '6:30'], [1, '6:30', '9:30'], [0, '9:30', '11']] }
}

const getDates = () => {
  const s1 = moment().startOf('month');
  const e1 = moment().endOf('month');
  const s2 = moment(s1).startOf('week');
  const e2 = moment(e1).endOf('week');
  const dates = range(0, e2.diff(s2, 'days') + 1).map(x => moment(s2).add(x, 'days'));
  return mergeDeepLeft(splitEvery(7, dates).map(x => fromPairs(x.map(d => [d.format('dddd'), { date: d.date() }]))), tt);
}

const Calendar = ({ lookup }) =>
  <div class="p16 fv">
    <h1>Calendar - {moment().format('YYYY MMMM')}</h1>
    <hr/>
    <Table name="calendar" data={getDates()} link>
      <td>{x =>
        <div>
          <div>{x.date}</div>
          {x.schedules.map(s =>
            <div class={`white ${bg[s[0]]}`}>{`${s[1]}pm - ${s[1]}pm`}</div>
          )}
        </div>
      }</td>   
    </Table>
  </div>

export default compose(
  connect(lookupSelector)
)(Calendar);
