import React from 'react';
import { compose, withProps } from 'recompose';
import { pick, sortWith, ascend, descend, prop, find } from 'ramda';
import { connect } from '@ln613/state';
import actions from 'utils/actions';
import { withLoad, withLoadForce, withParams, withNewId, withEdit, withMount } from '@ln613/compose';
import { findById, findByProp, toAbsDate, tap } from '@ln613/util';
import { tournamentSelector } from 'utils/selectors';
import { Table } from '@ln613/ui/semantic';
import { withRouter } from "react-router-dom";
import { Button } from 'semantic-ui-react';
import { toGame, resultOptions, withSuccess } from 'utils';

const Games = p =>
  <div>
    <div class="f">
      <h1 class="fg1">{p.tournament.name} - {p.schedule.date}</h1>
    </div>
    <hr/>
    <Table name="games" data={(tap(p.games) || []).map(pick(['team1', 'player1', 'result', 'player2', 'team2' ]))}>
      <td key="result" path="match.games[{i}].result" />
    </Table>
  </div>

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament', 'id', 'T'),
  withProps(p => ({ schedule: findById(p.S)(p.tournament.schedules) || {} })),
  withProps(p => ({ match: findById(p.M)((p.schedule || {}).matches) || {} })),
  withProps(p => ({ games: sortWith([p.tournament.groups ? ascend(prop('id')) : descend(prop('id'))],
    p.tournament.groups ? p.match.games :
    (p.tournament.games || []).filter(x => (x.schedule === p.S || toAbsDate(x.date) === toAbsDate(p.schedule.date)) && (x.match === p.M || (x.t1 === p.match.home && x.t2 === p.match.away) || (x.t2 === p.match.home && x.t1 === p.match.away) ))
  )}))
)(Games)
