import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { standingSelector } from 'utils/selectors';
import { withLoad, withParams } from 'utils';
import { Table } from 'utils/comps';
import TMenu from './TMenu';

const Standing = ({ standing, tournament, id }) =>
  <div class="p16 f">
    <TMenu id={id} isSingle={tournament.isSingle} />
    <div class="ph32 fv">
      <h1>Standing - {tournament.name}</h1>
      <hr/>
      <Table name="standing" data={standing}>
      </Table>
    </div>
  </div>

export default compose(
  connect(standingSelector, actions),
  withParams,
  withLoad('tournament', 'id')
)(Standing);
