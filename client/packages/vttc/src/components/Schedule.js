import React from 'react';
import { connect } from '@ln613/state';
import { compose } from 'recompose';
import { pick, isNil } from 'ramda';
import actions from 'utils/actions';
import { tournamentSelector } from 'utils/selectors';
import { getNameById, tap } from '@ln613/util';
import { withLoad, withParams } from '@ln613/compose';
import { Table, withMobile } from '@ln613/ui/semantic';
import TMenu from './TMenu';

const Schedule = ({ tournament, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tournament.isSingle} isMobile={isMobile} page="schedule" />
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tournament.name}</h1>
      <hr/>
      {(tournament.schedules || []).map((s, i) =>
        <div class="pt8">
          <div class="pv8 fs24 darkgreen">{tournament.isSingle ? 'Round ' + (i + 1) : (isNil(s.group) ? s.date : ('Group ' + (+s.group + 1))) }</div>
          <Table name="schedule" data={mapMatches(s.matches || [], tournament, !isNil(s.group))} />
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

const mapMatches = (ms, t, isGroup) => t.isSingle ? ms.map(pick(['id', 'player1', 'result', 'player2'])) :
  ms.filter(m => m && m.id).map(m => ({
    [isGroup ? 'Round' : 'Table']: isGroup ? m.round : m.id,
    'Home': getNameById(m.home)(t.teams),
    'Result': m.result === '0:0' ? '' : m.result,
    'Away': getNameById(m.away)(t.teams)
  }))