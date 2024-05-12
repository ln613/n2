import React from 'react'
import { compose, lifecycle } from 'recompose'
import { range, pick, find } from 'ramda'
import { connect } from '@ln613/state'
import { Button } from 'semantic-ui-react'
import actions from 'utils/actions'
import { scheduleSelector } from 'utils/selectors'
import { TextBox, Table } from '@ln613/ui/semantic'
import { Select } from '@ln613/ui'
import { withLoad, withParams, withMount } from '@ln613/compose'
import { withRouter } from 'react-router-dom'
import { resultOptions } from 'utils'
import { withSuccess } from 'utils/ui'
import { kos, tap } from 'utils'
import { toGame, findById } from '../utils'

const single = (ms, ko) => (
  <Table
    name="schedule"
    data={(ms || []).map(
      pick(['id', ko ? 'team1' : 'player1', 'result', ko ? 'team2' : 'player2'])
    )}
  >
    <td
      key="result"
      path={'schedule.matches[{i}].' + (ko ? 'games[0].result' : 'result')}
      select
      options={resultOptions}
      className="result-select"
    />
  </Table>
)

const updown = ms => (
  <Table
    name="schedule"
    data={(ms || []).map(
      pick(['upDownGroup', 'round', 'player1', 'result', 'player2'])
    )}
  >
    <td
      key="result"
      path={'schedule.matches[{i}].result'}
      select
      options={resultOptions}
      className="result-select"
    />
    <td key="upDownGroup" title="Group" />
  </Table>
)

const teams = (tournament, schedule, history) =>
  range(0, 8).map(n => (
    <div className="f aic">
      <div className="pr8">Table {n + 1}: </div>
      <Select
        name={`schedule.matches[${n}].home`}
        options={tournament.teams}
        placeholder=""
      />
      <div className="ph8">VS</div>
      <Select
        name={`schedule.matches[${n}].away`}
        options={tournament.teams}
        placeholder=""
      />
      <div className="ph8"></div>
      <Button
        primary
        disabled={
          !schedule.matches || !schedule.matches[n] || !schedule.matches[n].home
        }
        onClick={() =>
          history.push(`/admin/games/${tournament.id}/${schedule.id}/${n + 1}`)
        }
      >
        Matches
      </Button>
    </div>
  ))

const groups = (ms, tid, sid) => (
  <Table
    name="groups"
    link={x => `/admin/games/${tid}/${sid}/${x.id}`}
    data={(ms || [])
      .map(fixResult)
      .map(pick(['id', 'round', 'team1', 'result', 'team2']))}
  >
    <td key="id" hidden />
  </Table>
)

const isSingleGroup = t => t.teams.length > 0 && t.teams[0].players.length === 1

const Schedule = ({
  tournament,
  schedule,
  history,
  putSchedule,
  postSchedule,
  putGroupMatch,
  putUpDownGames,
  id,
  newGameId,
  players,
  isLoading,
}) => (
  <div>
    <h1>
      Schedule - {tournament.name} -{' '}
      {tournament.isSingle ? 'Round ' + schedule.id : schedule.date}
    </h1>
    <hr />
    <div className="pv8 fs24 darkgreen">
      {schedule.ko
        ? kos[Math.log2(schedule.ko)]
        : schedule.group
        ? 'Group ' + schedule.group
        : 'Id ' + schedule.id}
    </div>
    <TextBox name="schedule.date" />
    {tournament.isSingle
      ? single(tap(schedule).matches)
      : tournament.isUpDown
      ? updown(tap(schedule).matches)
      : tournament.groups
      ? isSingleGroup(tournament)
        ? single(tap(schedule).matches, true)
        : groups(
            find(x => x.id == id, tournament.schedules).matches,
            tournament.id,
            id
          )
      : teams(tournament, schedule, history)}
    <hr />
    <Button primary onClick={history.goBack}>
      Back
    </Button>
    {tournament.groups && !isSingleGroup(tournament) ? null : (
      <Button
        primary
        onClick={() =>
          tournament.isUpDown
            ? saveUpDown(
                tournament,
                schedule,
                newGameId,
                putUpDownGames,
                players
              )
            : isSingleGroup(tournament)
            ? putGroupMatch(
                {
                  games: schedule.matches.map(x => ({
                    ...x.games[0],
                    group: schedule.group,
                    ko: schedule.ko,
                  })),
                },
                { id: tournament.id, group: schedule.group }
              )
            : id[0] === '+'
            ? postSchedule(schedule, { id1: tournament.id })
            : putSchedule(schedule, { id1: tournament.id, id: schedule.id })
        }
        disabled={isLoading}
      >
        Save
      </Button>
    )}
  </div>
)

export default compose(
  connect(scheduleSelector, actions),
  withParams,
  withLoad('tournament', ['id', 'id1'], true),
  withMount(p =>
    p.setForm(
      { matches: [], ...find(x => x.id == p.id, p.tournament.schedules) },
      { path: 'schedule' }
    )
  ),
  withMount(p => p.getNewGameId()),
  withSuccess(
    'schedule',
    () => alert('Saved'),
    () => alert('Error happened!')
  ),
  withSuccess(
    'groupmatch',
    () => alert('Saved'),
    () => alert('Error happened!')
  ),
  withSuccess(
    'updowngames',
    () => alert('Saved'),
    () => alert('Error happened!')
  ),
  lifecycle({
    componentWillUnmount: function () {
      this.props.setForm(null, { path: 'schedule' })
    },
  }),
  withRouter
)(Schedule)

const fixResult = m => ({
  ...m,
  result: m.games.length === 1 ? m.games[0].result : m.result,
})

const saveUpDown = (
  tournament,
  schedule,
  newGameId,
  putUpDownGames,
  players
) => {
  const gp = id => findById(+id)(tournament.teams).players[0].id
  const gr = id => findById(gp(id))(players).rating
  let id = newGameId
  putUpDownGames(
    {
      games: schedule.matches
        .map(x => ({
          id: x.gid || ++id,
          result: x.result,
          group: schedule.group,
          round: x.round,
          match: x,
          p1: gp(x.home),
          p2: gp(x.away),
          p1Rating: gr(x.home),
          p2Rating: gr(x.away),
        }))
        .map(x => toGame(x, schedule, x.match)),
    },
    { id: tournament.id }
  )
}
