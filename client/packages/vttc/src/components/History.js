import React from 'react';
import { connect } from 'no-redux';
import { compose, withProps } from 'recompose';
import actions from 'utils/actions';
import { historySelector } from 'utils/selectors';
import { withLoad, findById, withParams } from 'utils';
import { Table } from 'utils/comps';

const History = ({ lookup, history, player }) =>
  <div class="p16 fv">
    <div class="f">
      <h1 class="fg1">History - {player.name} ({player.rating})</h1>
    </div>  
    <div class="ui divider"></div>
    <Table name="history" data={history}>
      <td key="id" hidden />
      <td key="month" hidden />
      <td key="isLastGameInMonth" hidden />
    </Table>
  </div>

export default compose(
  connect(historySelector, actions),
  withParams,
  withLoad('players'),
  withLoad('history', 'id', true),
  withProps(p => ({ player: findById(p.id)(p.players) || {} }))
)(History);
