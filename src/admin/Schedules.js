import React from 'react'
import { isNil } from 'ramda'
import { compose } from 'recompose'
import { connect } from '@ln613/state'
import actions from 'utils/actions'
import { withLoad, withLoadForce, withParams, withNewId } from '@ln613/compose'
import { tournamentSelector } from 'utils/selectors'
import { kos } from 'utils'
import { Table } from '@ln613/ui/semantic'
import { withRouter } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const Schedules = ({ tournament, history, id, newId }) => (
  <div>
    <div className="f">
      <h1 className="fg1">Schedules - {tournament.name}</h1>
      {/* <Button primary onClick={() => history.push(`/schedule/${id}/+${newId}`)}>Add</Button> */}
    </div>
    <hr />
    <Table
      name="schedules"
      link={x => `/admin/schedule/${id}/${x.id}`}
      data={(tournament.schedules || []).map(x => {
        if (tournament.isUpDown)
          return {
            id: x.id,
            date: x.date,
            group: x.group,
          }
        return {
          id: x.id || (isNil(x.group) ? '' : +x.group),
          [tournament.isSingle
            ? 'round'
            : !isNil(x.group) || x.ko
            ? 'group'
            : 'date']: tournament.isSingle
            ? 'Round ' + x.id
            : !isNil(x.group)
            ? 'Group ' + x.group
            : x.ko
            ? kos[Math.log2(x.ko)]
            : x.date,
        }
      })}
    />
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
  withNewId('tournament.schedules'),
  withRouter
)(Schedules)
