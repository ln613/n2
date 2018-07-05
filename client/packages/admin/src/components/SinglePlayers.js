import React from 'react';
import { compose } from 'recompose';
import { connect } from 'no-redux';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { teamSelector } from 'utils/selectors';
import { TextBox, Select, CheckBox } from 'utils/comps';
import { withLoad, withEditList, withSuccess, withParams } from 'utils';

const SinglePlayers = ({ tournament, players, putTeam, postTeam, setFormTournamentPlayers, id }) =>
  <div>
    <h1>Players - {tournament.name}</h1>
    <hr />
    {(tournament.players || []).map((p, i) =>
      <div class="f aic mrc8" key={`players${i}`}>
        <Select name={`players[${i}].id`} index={i} options={players} />
        <CheckBox name={`players[${i}].isSub`} index={i} label="Is Substitute?" />
        <TextBox name={`players[${i}].rating`} index={i} label="Rating" />
      </div>
    )}
    <Button secondary onClick={() => setFormTournamentPlayers({})}>Add Player</Button>
    <hr />
    <Button primary onClick={() => id[0] != '+' ? putTeam(tournament, { id: tournament.id }) : postTeam(tournament, { id: tournament.id })}>Save</Button>
  </div>

export default compose(
  connect(teamSelector, actions),
  withParams,
  withLoad('players'),
  withLoad('tournament'),
  withEditList('tournament.players'),
  withSuccess('team', () => alert('Saved'), () => alert('Error happened!'))
)(SinglePlayers)
