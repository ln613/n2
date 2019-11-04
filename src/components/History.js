import React, { Fragment } from 'react';
import { connect } from '@ln613/state';
import { compose, withProps, lifecycle } from 'recompose';
import actions from 'utils/actions';
import { historySelector } from 'utils/selectors';
import { findById } from '@ln613/util';
import { withLoad, withParams, withLoadForce } from '@ln613/compose';
import { Table, withMobile, Select } from '@ln613/ui/semantic';
import { tap } from '../utils';

const History = ({ lookup, history, player, oppoList, tourList, isMobile }) =>
  <div class="p16 fv">
    <div class="f">
      <h1 class="fg1">History - {player.name} ({player.rating})</h1>
      {!isMobile &&
        <div class="f">
          <Select fluid name="oppo" options={oppoList} placeholder="All players" clearable></Select>
          <div class="pr16"/>
          <Select fluid name="tour" options={tourList} placeholder="All tournaments" clearable></Select>
        </div>
      }
    </div>
    <div class="ui divider"></div>
    {isMobile &&
      <Fragment>
        <div class="f fg1 fixdd">
          <Select fluid name="oppo" options={oppoList} placeholder="All players" clearable></Select>
        </div>  
        <div class="f fg1 fixdd">
          <Select fluid name="tour" options={tourList} placeholder="All tournaments" clearable></Select>
        </div>
      </Fragment>
    }
    <Table name="history" data={history} isMobile={isMobile}>
      <td key="id" hidden />
      <td key="month" hidden />
      <td key="isLastGameInMonth" hidden />
      <td key="group" hidden />
      <td key="ko" hidden />
      <td key="round" hidden />
      <td key="p1" hidden />
      <td key="p2" hidden />
    </Table>
  </div>

export default compose(
  connect(historySelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('history'),
  withProps(p => ({ player: findById(p.id)(p.players) || {} })),
  withMobile,
  lifecycle({
    componentWillUnmount: function() {
      this.props.setForm(null, { path: 'oppo' })
      this.props.setForm(null, { path: 'tour' })
    }
  })
)(History);
