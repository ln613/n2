import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { tournamentSelector } from 'utils/selectors';
import { withLoad, withParams } from 'utils';
import { Table, withMobile } from 'utils/comps';
import TMenu from './TMenu';

const Tournament = ({ lookup, tournament, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tournament.isSingle} />
    <div class="ph32 fv">
      <h1>{tournament.name}</h1>
      <hr/>
      {!tournament.isSingle && tournament.teams ?
      (tournament.teams || []).map(t =>
        <div class="pt8" key={t.id}>
          <div class="pt16 fs24 darkgreen">{t.name}</div>
          <Table name="team" data={(t.players || []).map(mapPlayer)}>
            <td key="id" hidden />  
          </Table>
        </div>
      ) :
      <Table name="players" data={(tournament.players || []).map(mapPlayer)}>
        <td key="id" hidden />  
        <td key="Is Substitute" hidden />  
      </Table>
    }
    </div>
  </div>  

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoad('tournament', 'id', true),
  withMobile
)(Tournament);

const mapPlayer = p => ({ id: p.id, 'First Name': p.firstName, 'Last Name': p.lastName, gender: p.sex, 'Tournament Rating': p.tRating, 'Latest Rating': p.rating, 'Is Substitute': p.isSub ? 'Yes' : '' });