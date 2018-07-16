import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { statsSelector } from 'utils/selectors';
import { withLoad, withParams } from 'utils';
import { Table } from 'utils/comps';
import TMenu from './TMenu';

const Stats = ({ stats, tournament, id }) =>
  <div class="p16 f">
    <TMenu id={id} isSingle={tournament.isSingle} />
    <div class="ph32 fv">
      <h1>Stats - {tournament.name}</h1>
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
  withLoad('tournament')
)(Stats);
