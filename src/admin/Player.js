import React from 'react'
import { compose } from 'recompose'
import { find } from 'ramda'
import { connect } from '@ln613/state'
import { Button } from 'semantic-ui-react'
import actions from 'utils/actions'
import { isValidEmail, isValidCanadianPhone } from 'utils'
import { playersSelector } from 'utils/selectors'
import { TextBox } from '@ln613/ui/semantic'
import { withLoad, withParams, withMount } from '@ln613/compose'
import { withSuccess } from 'utils/ui'
import { withRouter } from 'react-router-dom'

const validatePlayer = (player) => {
  const errors = []
  if (player.email && !isValidEmail(player.email))
    errors.push('Invalid email address')
  if (player.phone && !isValidCanadianPhone(player.phone))
    errors.push('Invalid Canadian phone number')
  return errors
}

const savePlayer = (player, id, postPlayer, putPlayer) => {
  const errors = validatePlayer(player)
  if (errors.length > 0) {
    alert(errors.join('\n'))
    return
  }
  id[0] === '+'
    ? postPlayer(toPlayer(player))
    : putPlayer(toPlayer(player))
}

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
    <TextBox name="player.email" />
    <TextBox name="player.phone" />
    <hr />
    <Button primary onClick={history.goBack}>
      Back
    </Button>
    <Button
      primary
      onClick={() => savePlayer(player, id, postPlayer, putPlayer)}
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
        email: '',
        phone: '',
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
