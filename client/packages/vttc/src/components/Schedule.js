import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import { pick } from 'ramda';
import actions from 'utils/actions';
import { tournamentSelector } from 'utils/selectors';
import { withLoad, withParams, getNameById, tap } from 'utils';
import { Table, withMobile } from 'utils/comps';
import TMenu from './TMenu';

const Schedule = ({ tournament, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tournament.isSingle} isMobile={isMobile} page="schedule" />
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tournament.name}</h1>
      <hr/>
      {(tournament.schedules || []).map((s, i) =>
        <div class="pt8">
          <div class="pv8 fs24 darkgreen">{tournament.isSingle ? 'Round ' + (i + 1) : s.date }</div>
          <Table name="schedule" data={mapMatches(s.matches || [], tournament)} />
          {/* <Table name="week" data={w.matches} equalWidth>
            <td key="team1Points" hidden />  
            <td key="team2Points" hidden />  
            <td key="winner" hidden />  
            <td key="loser" hidden />  
            <td key="result" center />  
          </Table> */}
        </div>  
      )}
    </div>
  </div>

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoad('tournament'),
  withMobile
)(Schedule);

const mapMatches = (ms, t) => t.isSingle ? ms.map(pick(['id', 'player1', 'result', 'player2'])) :
  ms.filter(m => m && m.id).map(m => ({
    'Table': m.id,
    'Home': getNameById(m.home)(t.teams),
    'Result': m.result === '0:0' ? '' : m.result,
    'Away': getNameById(m.away)(t.teams)
  }))