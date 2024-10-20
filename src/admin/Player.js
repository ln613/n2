import React from 'react'
import { compose } from 'recompose'
import { find } from 'ramda'
import { connect } from '@ln613/state'
import { Button } from 'semantic-ui-react'
import actions from 'utils/actions'
import { playersSelector } from 'utils/selectors'
import { TextBox } from '@ln613/ui/semantic'
import { withLoad, withParams, withMount } from '@ln613/compose'
import { withSuccess } from 'utils/ui'
import { withRouter } from 'react-router-dom'

const Player = ({ player, putPlayer, postPlayer, id, history, isLoading }) => (
  <div>
    <h1>Player - {+player.id ? player.name : 'Add New'}</h1>
    <hr />
    <TextBox name="player.id" disabled />
    <TextBox name="player.firstName" />
    <TextBox name="player.firstName_ch" />
    <TextBox name="player.lastName" />
    <TextBox name="player.lastName_ch" />
    <TextBox name="player.sex" />
    <TextBox name="player.rating" />
    <hr />
    <Button primary onClick={history.goBack}>
      Back
    </Button>
    <Button
      primary
      onClick={() =>
        id[0] === '+'
          ? postPlayer(toPlayer(player))
          : putPlayer(toPlayer(player))
      }
      disabled={isLoading}
    >
      Save
    </Button>
  </div>
)

export default compose(
  connect(playersSelector, actions),
  withParams,
  withLoad('players'),
  withMount(p =>
    p.setForm(
      find(x => x.id == +p.id, p.players || []) || {
        id: +p.id,
        firstName: '',
        lastName: '',
        sex: '',
        rating: '',
      },
      { path: 'player' }
    )
  ),
  withSuccess(
    'player',
    () => alert('Saved'),
    () => alert('Error happened!')
  ),
  withRouter
)(Player)

const toPlayer = p => ({ ...p, id: +p.id, rating: p.rating ? +p.rating : 100 })
