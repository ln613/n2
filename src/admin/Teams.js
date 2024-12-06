import React from 'react'
import { compose } from 'recompose'
import { connect } from '@ln613/state'
import actions from 'utils/actions'
import { withLoad, withLoadForce, withParams, withNewId } from '@ln613/compose'
import { tournamentSelector } from 'utils/selectors'
import { Table } from '@ln613/ui/semantic'
import { withRouter } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import { sum } from 'ramda'

const teamTable = (teams, id) => (
  <Table
    name="teams"
    link={x => `/admin/team/${id}/${x.id}`}
    data={sortWith(
      [descend(x => x['Combined Rating'])], (teams || []).map(x => ({
      id: x.id,
      name:
        x.name ||
        x.players[0].firstName +
          ' ' +
          x.players[0].lastName +
          ' / ' +
          (x.players[1].firstName + ' ' + x.players[1].lastName),
      'Combined Rating': sum(x.players.map(y => +y.tRating || +y.rating)),
    })))}
  />
)

const Teams = ({ tournament, history, id, newId }) => (
  <div>
    <div className="fv">
      <h1 className="fg1">Teams - {tournament.name}</h1>
      <Button
        primary
        onClick={() => history.push(`/admin/team/${id}/+${newId}`)}
      >
        Add
      </Button>
    </div>
    <hr />
    {tournament.groups
      ? tournament.groups.map(g => (
          <div className="pt8" key={g[0]}>
            <div className="pv8 fs24 darkgreen">Group {g[0]}</div>
            {teamTable(g[1], id)}
          </div>
        ))
      : teamTable(tournament.teams, id)}
    <hr />
    <Button primary onClick={history.goBack}>
      Back
    </Button>
  </div>
)

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament'),
  withNewId('tournament.teams'),
  withRouter
)(Teams)
