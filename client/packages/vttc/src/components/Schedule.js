import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { tournamentSelector } from 'utils/selectors';
import { withLoad, withParams, getNameById } from 'utils';
import { Table } from 'utils/comps';
import TMenu from './TMenu';

const Schedule = ({ tournament, id }) =>
  <div class="p16 f">
    <TMenu id={id} />
    <div class="p32 fv">
      <h1>Schedule - {tournament.name}</h1>
      <hr/>
      {(tournament.schedules || []).map(s =>
        <div class="pt8">
          <div class="pt8 fs24 darkgreen">{s.date}</div>
          <Table name="schedule" data={(s.matches || []).filter(m => m && m.id).map(m => ({ 'Table': m.id, 'Home': getNameById(m.home)(tournament.teams), 'Result': m.result === '0:0' ? '' : m.result, 'Away': getNameById(m.away)(tournament.teams) }))} />
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
  withLoad('tournament')
)(Schedule);
