import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { tournamentSelector } from 'utils/selectors';
import { withLoad, withParams } from 'utils';
import { Table } from 'utils/comps';
import TMenu from './TMenu';

const Tournament = ({ lookup, tournament, id }) =>
  <div class="p16 f">
    <TMenu id={id} />
    <div class="p32 fv">
      <h1>{tournament.name}</h1>
      <hr/>
      {(tournament.teams || []).map(t =>
        <div class="pt8" key={t.id}>
          <div class="pt8 fs24 darkgreen">{t.name}</div>
          <Table name="team" data={(t.players || []).map(p => ({ id: p.id, 'First Name': p.firstName, 'Last Name': p.lastName, gender: p.sex, rating: p.rating }))}>
            <td key="id" hidden />  
            <td key="sex" title="Gender" />  
          </Table>
        </div>  
      )}
    </div>
  </div>  

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoad('tournament', 'id')
)(Tournament);
