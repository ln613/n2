import React from 'react';
import { connect } from '@ln613/state';
import { compose, withProps } from 'recompose';
import actions from 'utils/actions';
import { historySelector } from 'utils/selectors';
import { findById } from '@ln613/util';
import { withLoad, withParams, withLoadForce } from '@ln613/compose';
import { Table, withMobile } from '@ln613/ui/semantic';

const History = ({ lookup, history, player, isMobile }) =>
  <div class="p16 fv">
    <div class="f">
      <h1 class="fg1">History - {player.name} ({player.rating})</h1>
    </div>  
    <div class="ui divider"></div>
    <Table name="history" data={history} isMobile={isMobile}>
      <td key="id" hidden />
      <td key="month" hidden />
      <td key="isLastGameInMonth" hidden />
      <td key="group" hidden />
      <td key="ko" hidden />
      <td key="round" hidden />
    </Table>
  </div>

export default compose(
  connect(historySelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('history'),
  withProps(p => ({ player: findById(p.id)(p.players) || {} })),
  withMobile
)(History);