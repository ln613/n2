import React from 'react';
import { range, is, pick } from 'ramda';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { standingSelector } from 'utils/selectors';
import { cdurl, withLoad, withDetail, withParams, withListener, getNameById, findById, tap } from 'utils';
import { withRouter } from 'react-router-dom';
import { TextBox, Table } from 'utils/comps';
import TMenu from './TMenu';

const Standing = ({ standing, tournament, id }) =>
  <div class="p16 f">
    <TMenu id={id} />
    <div class="p32 fv">
      <h1>Standing - {tournament.name}</h1>
      <hr/>
      <Table name="standing" data={standing}>
      </Table>
    </div>
  </div>

export default compose(
  connect(standingSelector, actions),
  withParams,
  withLoad('tournament', 'id'),
  withListener('click', p => tap(p))
)(Standing);
