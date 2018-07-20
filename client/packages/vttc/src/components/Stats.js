import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { statsSelector } from 'utils/selectors';
import { withLoad, withParams } from 'utils';
import { Table, withMobile } from 'utils/comps';
import TMenu from './TMenu';

const Stats = ({ stats, tournament, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tournament.isSingle} isMobile={isMobile} page="stats" />
    <div class={`${isMobile ? '' : 'ph32'} fv`} style={{minWidth: '420px', overflowX: 'scroll'}}>
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
