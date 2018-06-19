import React from 'react';
import { compose } from 'recompose';
import { connect } from 'no-redux';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { playersSelector } from 'utils/selectors';
import { TextBox } from 'utils/comps';
import { withEdit, withSuccess, withLoad } from 'utils';

const Player = ({ player, putPlayer, postPlayer }) =>
  <div>
    <h1>Player - {+player.id ? player.name : 'Add New'}</h1>
    <hr />
    <TextBox name="player.id" disabled />
    <TextBox name="player.firstName" />
    <TextBox name="player.firstName_ch" />
    <TextBox name="player.lastName" />
    <TextBox name="player.lastName_ch" />
    <hr />
    <Button primary onClick={() => +player.id ? putPlayer(player) : postPlayer(player)}>Save</Button>
  </div>

export default compose(
  connect(playersSelector, actions),
  withLoad('players'),
  withEdit('player'),
  withSuccess('player', () => alert('Saved'), () => alert('Error happened!'))
)(Player)