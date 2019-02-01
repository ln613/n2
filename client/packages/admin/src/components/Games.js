import React from 'react';
import { compose, withProps } from 'recompose';
import { pick, sortWith, ascend, descend, prop } from 'ramda';
import { connect } from '@ln613/state';
import actions from 'utils/actions';
import { withLoad, withLoadForce, withParams, withNewId, withEdit } from '@ln613/compose';
import { findById, findByProp, toAbsDate, tap } from '@ln613/util';
import { tournamentSelector } from 'utils/selectors';
import { Table } from '@ln613/ui/semantic';
import { withRouter } from "react-router-dom";
import { Button } from 'semantic-ui-react';
import { resultOptions } from 'utils';

const Games = ({ tournament, games, schedule, match, history, T, S, M, newId }) =>
  <div>
    <div class="f">
      <h1 class="fg1">Matches - {tournament.name} - {schedule.date}</h1>
      {tournament.groups ? null : <Button primary onClick={() => history.push(`/game/${T}/${S}/${M}/+${newId}`)}>Add</Button>}
    </div>
    <hr/>
    <Table name="games" link={x => `/game/${T}/${S}/${M}/${x}`} data={(games || []).map(pick(['id', 'date', 'team1', 'player1', 'result', 'player2', 'team2' ]))}>
      <td key="result" path="match.games[{i}].result" select options={resultOptions}/>
    </Table>
    <hr />
    {!tournament.groups ? null : <Button primary onClick={() => save()}>Save</Button>}
  </div>

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament', 'id', 'T'),
  withProps(p => ({ schedule: (p.tournament.groups ? findByProp('group') : findById)(p.S)(p.tournament.schedules) || {} })),
  withProps(p => ({ match: findById(p.M)((p.schedule || {}).matches) || {} })),
  withProps(p => ({ games: sortWith([p.tournament.groups ? ascend(prop('id')) : descend(prop('id'))],
    p.tournament.groups ? p.match.games :
    (p.tournament.games || []).filter(x => (x.schedule === p.S || toAbsDate(x.date) === toAbsDate(p.schedule.date)) && (x.match === p.M || (x.t1 === p.match.home && x.t2 === p.match.away) || (x.t2 === p.match.home && x.t1 === p.match.away) ))
  )})),
  withNewId('tournament.games'),
  withEdit('match', 'schedule.matches', { id: 'M', games: [] }),
  withRouter
)(Games)

const save = p => {
  const isAdd = p.id[0] === '+';
  const g = toGame(p.game, p.schedule, p.match);

  if (isAdd) {
    p.postGame(g, { id1: p.tournament.id });
    if (!g.isDouble) {
      const p1 = findById(g.p1)(p.players);
      p.putPlayer({...p1, rating: newRating(g.p1Rating, g.p1Diff)});
      const p2 = findById(g.p2)(p.players);
      p.putPlayer({...p2, rating: newRating(g.p2Rating, g.p2Diff)});
    }
  }
  else {
    g.isDouble ? p.putGame(g, { id1: p.tournament.id }) : p.patchResult(g);
    //p.putGame(g, { id1: p.tournament.id });
  }
}