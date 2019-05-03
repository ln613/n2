import React from 'react';
import { compose, withProps } from 'recompose';
import { pick, sortWith, ascend, descend, prop, find, pipe, filter, map } from 'ramda';
import { connect } from '@ln613/state';
import actions from 'utils/actions';
import { highlightWinner } from 'utils';
import { withLoad, withLoadForce, withParams } from '@ln613/compose';
import { findById, tap } from '@ln613/util';
import { tournamentSelector } from 'utils/selectors';
import { Table } from '@ln613/ui/semantic';
import { withRouter } from "react-router-dom";
import { Button } from 'semantic-ui-react';

const Games = p =>
  <div class="p16">
    <div class="fv">
      <h1 class="fg1">{p.tournament.name} - {p.schedule.date}</h1>
      <h3 class="fg1 mt4">{p.Match.team1} vs {p.Match.team2}</h3>
    </div>
    <hr/>
    <Table name="games" data={(p.games || []).map(pick(['player1', 'result', 'player2' ]))}>
      <td key="result" path="match.games[{i}].result" />
    </Table>
    <hr/>
    <Button primary onClick={p.history.goBack}>Back</Button>
  </div>

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament', 'id', 'T'),
  withProps(p => ({ schedule: findById(p.S)(p.tournament.schedules) || {} })),
  withProps(p => ({ Match: find(m => (p.tournament.groups ? (m.round || m.table || m.id) : m.id) == p.M, ((p.schedule || {}).matches || [])) || {} })),
  withProps(p => ({
    games: pipe(
      sortWith([p.tournament.groups ? ascend(prop('id')) : descend(prop('id'))]),
      filter(g => g.result),
      map(highlightWinner)
    )(p.tournament.groups ? p.Match.games :
      (p.tournament.games || []).filter(x => (x.schedule === p.S || x.date === p.schedule.date) && (x.match === p.M || (x.t1 === p.Match.home && x.t2 === p.Match.away) || (x.t2 === p.Match.home && x.t1 === p.Match.away) ))
    )
  })),
  withRouter
)(Games)
