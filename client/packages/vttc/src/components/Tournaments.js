import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { tournamentsSelector } from 'utils/selectors';
import { withLoad } from 'utils';
import { Table } from 'utils/comps';

const Tournaments = ({ lookup, tournaments }) =>
  <div class="p16 fv">
    <h1>Tournaments</h1>
    <hr/>
    <Table name="tournaments" data={tournaments} link>
      <td key="id" hidden/>   
    </Table>
  </div>

export default compose(
  connect(tournamentsSelector, actions),
  withLoad('tournaments')
)(Tournaments);
