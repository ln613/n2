import React from 'react';
import { compose, withProps } from 'recompose';
import { pick } from 'ramda';
import { connect } from '@ln613/state';
import actions from 'utils/actions';
import { withLoad, withParams, withNewId } from '@ln613/compose';
import { findById, toAbsDate } from '@ln613/util';
import { tournamentSelector } from 'utils/selectors';
import { Table } from 'utils/comps';
import { withRouter } from "react-router-dom";
import { Button } from 'semantic-ui-react';

const Games = ({ tournament, games, schedule, match, history, T, S, M, newId }) =>
  <div>
    <div class="f">
      <h1 class="fg1">Matches - {tournament.name} - {schedule.date}</h1>
      <Button primary onClick={() => history.push(`/game/${T}/${S}/${M}/+${newId}`)}>Add</Button>
    </div>
    <hr/>
    <Table name="games" link={x => `/game/${T}/${S}/${M}/${x}`} data={(games || []).map(pick(['id', 'date', 'team1', 'player1', 'result', 'player2', 'team2' ]))} />
  </div>

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoad('tournament', ['id', 'T'], true),
  withProps(p => ({ schedule: findById(p.S)(p.tournament.schedules) || {} })),
  withProps(p => ({ match: findById(p.M)((p.schedule || {}).matches) || {} })),
  withProps(p => ({ games: (p.tournament.games || []).filter(x => (x.schedule === p.S || toAbsDate(x.date) === toAbsDate(p.schedule.date)) && (x.match === p.M || (x.t1 === p.match.home && x.t2 === p.match.away) || (x.t2 === p.match.home && x.t1 === p.match.away) )) })),
  withNewId('tournament.games'),
  withRouter
)(Games)

