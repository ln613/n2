import React from 'react';
import { connect } from '@ln613/state';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { statsSelector } from 'utils/selectors';
import { withLoad, withParams } from '@ln613/compose';
import { Table, withMobile } from '@ln613/ui/semantic';
import TMenu from './TMenu';

const Stats = ({ stats, tournament, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tournament.isSingle} isMobile={isMobile} page="stats" />
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tournament.name}</h1>
      <hr/>
      <Table name="stats" data={stats}>
        <td key="mp" title="MP"/>
        <td key="gw" title="GW"/>
        <td key="gl" title="GL"/>
        <td key="dw" title="DW" hidden/>
        <td key="dl" title="DL" hidden/>
      </Table>
    </div>
  </div>

export default compose(
  connect(statsSelector, actions),
  withParams,
  withLoad('tournament'),
  withMobile
)(Stats);
