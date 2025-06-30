import React from 'react'
import { connect } from '@ln613/state'
import { compose } from 'recompose'
import actions from 'utils/actions'
import { ratingSelector } from 'utils/selectors'
import { withLoad } from '@ln613/compose'
import { TextBox, Table } from '@ln613/ui/semantic'

const Rating = ({ lookup, players }) => (
  <div className="p16 fv">
    <div className="f">
      <h1 className="fg1">Rating</h1>
      <TextBox name="player" placeholder="Search player..." />
    </div>
    <div className="ui divider"></div>
    <div className="">
      For players who are inactive or haven't played any VTTC rating events over 6 months, VTTC reserves the right to adjust their ratings based on their actual levels.
    </div>
    <Table name="rating" data={players} link>
      <td key="id" hidden />
      <td key="name" hidden />
      <td key="firstName" title="First Name" />
      <td key="lastName" title="Last Name" />
      <td key="sex" title="Gender" />
      <td key="text" hidden />
      <td key="value" hidden />
    </Table>
  </div>
)

export default compose(
  connect(ratingSelector, actions),
  withLoad('players')
)(Rating)
