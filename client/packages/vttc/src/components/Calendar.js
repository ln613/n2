import React from 'react';
import { range, is, pick, splitEvery, fromPairs } from 'ramda';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import ImageSlider from './ImageSlider';
import actions from 'utils/actions';
import { lookupSelector } from 'utils/selectors';
import { cdurl, withLoad, withLang, getNameById, findById, tap } from 'utils';
import { withRouter } from "react-router-dom";
import { TextBox, Table } from 'utils/comps';
import moment from 'moment';

const Sunday = [[0, '12', '7'], [2, '7:15', '9:30'], [0, '9:30', '11']];
const Monday = [[0, '12', '6']];
const Tuesday = [[0, '12', '6']];
const Wednesday = [[0, '12', '11']];
const Thursday = [[0, '12', '6']];
const Friday = [[0, '12', '7'], [2, '7:15', '9:30'], [0, '9:30', '11']];
const Saturday = [[0, '12', '6:30'], [1, '6:30', '9:30'], [0, '9:30', '11']];

const getDates = () => {
  const s1 = moment().startOf('month');
  const e1 = moment().endOf('month');
  const s2 = moment(s1).startOf('week');
  const e2 = moment(e1).endOf('week');
  const dates = range(0, tap(e2.diff(s2, 'days')) + 1).map(x => moment(s2).add(x, 'days'));
  return splitEvery(7, tap(dates)).map(x => fromPairs(x.map(d => [d.format('dddd'), d.date()])));
}

const Calendar = ({ lookup }) =>
  <div class="p16 fv">
    <h1>Calendar - {moment().format('YYYY MMMM')}</h1>
    <hr/>
    <Table name="calendar" data={getDates()} link>
      <td key="id" hidden/>   
    </Table>
  </div>

export default compose(
  connect(lookupSelector)
)(Calendar);
