import React, { Fragment } from 'react';
import { connect } from '@ln613/state';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { statsSelector } from 'utils/selectors';
import { withLoad, withLoadForce, withParams } from '@ln613/compose';
import { Table, withMobile } from '@ln613/ui/semantic';
import TMenu from './TMenu';

const table = (data, isMobile) =>
  <Table name="stats" data={data} isMobile={isMobile} >
    <td key="mp" title="MP"/>
    <td key="gw" title="GW"/>
    <td key="gl" title="GL"/>
    <td key="dw" title="DW" hidden/>
    <td key="dl" title="DL" hidden/>
  </Table>

const Stats = ({ stats, tournament, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tournament.isSingle} isMobile={isMobile} page="stats" />
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tournament.name}</h1>
      <hr/>
      {tournament.has2half ?
        <Fragment>
          <div class="fs18 fw6 pt8">Upper Division</div>
          {table(stats[0], isMobile)}
          <div class="fs18 fw6">Lower Division</div>
          {table(stats[1], isMobile)}
        </Fragment> :
        table(stats, isMobile)
      }
    </div>
  </div>

export default compose(
  connect(statsSelector, actions),
  withParams,
  withLoadForce('players'),
  withLoad('tournament'),
  withMobile
)(Stats);
