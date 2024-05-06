import React from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { pick, sortWith, ascend, descend, prop, find } from 'ramda'
import { connect } from '@ln613/state'
import actions from 'utils/actions'
import { withLoad, withLoadForce, withParams, withMount } from '@ln613/compose'
import { tournamentSelector } from 'utils/selectors'
import { Table } from '@ln613/ui/semantic'
import { withRouter } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import { toGame, resultOptions, findById, toAbsDate, tap } from 'utils'
import { withSuccess } from 'utils/ui'

const Games = p => (
  <div>
    <div className="fv">
      <h1 className="fg1">
        Matches - {p.tournament.name} - {p.schedule.date}
      </h1>
      <h3 className="fg1 mt4">
        {p.Match.team1} vs {p.Match.team2}
      </h3>
      {p.tournament.groups ? null : (
        <Button
          primary
          onClick={() =>
            p.history.push(
              `/admin/game/${p.T}/${p.S}/${p.M}/+${p.newGameId + 1}`
            )
          }
        >
          Add
        </Button>
      )}
    </div>
    <hr />
    <Table
      name="games"
      link={
        p.tournament.groups
          ? null
          : x => `/admin/game/${p.T}/${p.S}/${p.M}/${x.id}`
      }
      data={(p.games || []).map(pick(['id', 'player1', 'result', 'player2']))}
    >
      {p.tournament.groups ? (
        <td
          key="result"
          path="match.games[{i}].result"
          select
          options={resultOptions}
          className="result-select"
        />
      ) : null}
    </Table>
    <hr />
    <Button primary onClick={p.history.goBack}>
      Back
    </Button>
    {!p.tournament.groups ? null : (
      <Button primary onClick={() => save(p)} disabled={p.isLoading}>
        Save
      </Button>
    )}
  </div>
)

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament', 'id', 'T'),
  withProps(p => ({ schedule: findById(p.S)(p.tournament.schedules) || {} })),
  withProps(p => ({
    Match: fixResult(findById(p.M)((p.schedule || {}).matches) || {}),
  })),
  withProps(p => ({
    games: sortWith(
      [tap(p).tournament.groups ? ascend(prop('id')) : descend(prop('id'))],
      p.tournament.groups
        ? p.Match.games
        : (p.tournament.games || []).filter(
            x =>
              (x.schedule === p.S ||
                toAbsDate(x.date) === toAbsDate(p.schedule.date)) &&
              (x.match === p.M ||
                (x.t1 === p.Match.home && x.t2 === p.Match.away) ||
                (x.t2 === p.Match.home && x.t1 === p.Match.away))
          )
    ),
  })),
  //withNewId('tournament.games'),
  //withMount(p => window.$('.ui.selection.dropdown').dropdown('clear')),
  withMount(p => p.getNewGameId()),
  withMount(
    p =>
      p.tournament.groups &&
      p.setForm(
        fixResult(
          find(
            x => x.id == p.M,
            find(x => x.id == p.S, p.tournament.schedules).matches
          )
        ),
        { path: 'match' }
      )
  ),
  withRouter,
  withSuccess(
    'groupmatch',
    p => {
      alert('Saved')
      p.getTournament({ id: p.tournament.id })
      p.history.goBack()
    },
    () => alert('Error happened!')
  ),
  lifecycle({
    componentWillUnmount: function () {
      this.props.setForm(null, { path: 'match' })
    },
  })
)(Games)

const save = p => {
  const gs = p.formMatch.games.filter(g => g.result)
  // const wins = gs.filter(g => +g.result[0] > +g.result[2]).length
  // const loses = gs.filter(g => +g.result[0] < +g.result[2]).length
  // if (p.formMatch.games.length === 5 && wins < 2 && loses < 2)
  //   alert('not valid!');
  // else
  p.putGroupMatch(
    { ...p.formMatch, games: gs.map(g => toGame(g, p.schedule, p.formMatch)) },
    { id: p.T, group: p.S }
  )
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

const fixResult = m => {
  m.home = +m.home
  m.away = +m.away
  if (m.games && m.games.length === 1 && !m.games[0].result)
    m.games = [{ ...m.games[0], result: '' }]
  return m
}
