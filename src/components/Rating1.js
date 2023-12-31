import React from 'react'
import { connect } from '@ln613/state'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import actions from 'utils/actions'
import { ratingSelector } from 'utils/selectors'
import { withLoad } from '@ln613/compose'
import { TextBox, Table } from '@ln613/ui/semantic'
import { FixedSizeList as List } from 'react-window'

const Row =
  (ps, history) =>
  ({ index, style }) =>
    (
      <div
        className="four column row tbody cp"
        onClick={() => history.push('/rating/' + ps[index].id)}
      >
        {['firstName', 'lastName', 'sex', 'rating'].map((x, j) => (
          <div className={`${j < 2 ? 'five' : 'three'} wide column`}>
            {ps[index][x]}
          </div>
        ))}
      </div>
    )

const Rating = ({ lookup, players, history }) => (
  <div className="p16 fv">
    <div className="f">
      <h1 className="fg1">Rating</h1>
      <TextBox name="player" placeholder="Search player..." />
    </div>
    <div className="ui divider"></div>
    <List
      className="ui padded striped grid"
      height={300}
      width={300}
      itemCount={players.length}
      itemSize={50}
    >
      {Row(players, history)}
    </List>
  </div>
)

export default compose(
  connect(ratingSelector, actions),
  withLoad('players'),
  withRouter
)(Rating)

{
  /* <Table name="rating" data={players} link>
<td key="id" hidden />
<td key="name" hidden />
<td key="firstName" title="First Name"/>
<td key="lastName" title="Last Name"/>
<td key="sex" title="Gender"/>
<td key="text" hidden />
<td key="value" hidden />
</Table> */
}

{
  /* <div className="four column row thead">
{['First Name', 'Last Name', 'Gender', 'Rating'].map((x, i) => <div className={`${i < 2 ? 'five' : 'three'} wide column`}>{x}</div>)}
</div> */
}
