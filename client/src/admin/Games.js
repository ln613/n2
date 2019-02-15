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
      <h1 class="fg1">Matches - {p.tournament.name} - {p.schedule.date}</h1>
      {p.tournament.groups ? null : <Button primary onClick={() => p.history.push(`/admin/game/${p.T}/${p.S}/${p.M}/+${p.newId}`)}>Add</Button>}
    </div>
    <hr/>
    <Table name="games" link={p.tournament.groups ? null : x => `/admin/game/${p.T}/${p.S}/${p.M}/${x.id}`} data={(tap(p.games) || []).map(pick(['id', 'date', 'team1', 'player1', 'result', 'player2', 'team2' ]))}>
      {p.tournament.groups ? <td key="result" path="match.games[{i}].result" select options={resultOptions} /> : null}
    </Table>
    <hr />
    {!p.tournament.groups ? null : <Button primary onClick={() => save(p)}>Save</Button>}
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
  )})),
  withNewId('tournament.games'),
  withMount(p => p.tournament.groups && p.setForm(find(x => x.id == p.M, find(x => x.id == p.S, p.tournament.schedules).matches), { path: 'match' })),
  withSuccess('groupmatch', p => { alert('Saved'); p.history.goBack(); }, () => alert('Error happened!'))
)(Games)

const save = p => {
  const gs = p.formMatch.games.filter(g => g.result);
  const wins = gs.filter(g => +g.result[0] > +g.result[2]).length;
  const loses = gs.filter(g => +g.result[0] < +g.result[2]).length;
  if (wins < 3 && loses < 3)
    alert('not valid!');
  else
    p.putGroupMatch({ ...p.formMatch, games: gs.map(g => toGame(g, p.schedule, p.formMatch)) }, { id: p.T, group: p.S })
//   const isAdd = p.id[0] === '+';
//   const g = toGame(p.game, p.schedule, p.match);

//   if (isAdd) {
//     p.postGame(g, { id1: p.tournament.id });
//     if (!g.isDouble) {
//       const p1 = findById(g.p1)(p.players);
//       p.putPlayer({...p1, rating: newRating(g.p1Rating, g.p1Diff)});
//       const p2 = findById(g.p2)(p.players);
//       p.putPlayer({...p2, rating: newRating(g.p2Rating, g.p2Diff)});
//     }
//   }
//   else {
//     g.isDouble ? p.putGame(g, { id1: p.tournament.id }) : p.patchResult(g);
//     //p.putGame(g, { id1: p.tournament.id });
//   }
}