import React from 'react'
import { connect } from '@ln613/state'
import { compose, withProps } from 'recompose'
import { pick } from 'ramda'
import actions from 'utils/actions'
import { tournamentsSelector } from 'utils/selectors'
import { withLoad } from '@ln613/compose'
import { Table } from '@ln613/ui/semantic'

const Tournaments = ({ lookup, tournaments }) => (
  <div className="p16 fv">
    <h1>Tournaments</h1>
    <hr />
    <Table
      name="tournaments"
      data={tournaments.map(pick(['id', 'year', 'name']))}
      link
    >
      <td key="id" hidden />
      <td key="year" title="Y / M" className="wsn" />
    </Table>
  </div>
)

export default compose(
  connect(tournamentsSelector, actions),
  withLoad('tournaments'),
  withProps(p => ({
    tournaments: (p.tournaments || []).filter(x => !x.isHidden),
  }))
)(Tournaments)
