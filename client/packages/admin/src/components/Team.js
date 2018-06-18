import React from 'react';
import { compose } from 'recompose';
import { connect } from 'no-redux';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { teamSelector } from 'utils/selectors';
import { TextBox, Select, CheckBox } from 'utils/comps';
import { withLoad, withEdit, withSuccess, withParams } from 'utils';

const Team = ({ tournament, team, players, putTeam, postTeam, id }) =>
  <div>
    <h1>Team - {team.name}</h1>
    <hr />
    <TextBox name="team.id" disabled />
    <TextBox name="team.name" />
    <br/>
    Players:
    {(team.players || []).map((p, i) =>
      <div class="f aic">
        <Select name={`team.players[${i}].id`} index={i} options={players} />
        <CheckBox name={`team.players[${i}].isSub`} index={i} label="Is Substitute?" />
      </div>
    )}
    {/* <DoubleSelect name="team.players" options={players} buttonStyle="ui button" /> */}
    <hr />
    <Button primary onClick={() => id[0] != '+' ? putTeam(team, { id1: tournament.id, id: team.id }) : postTeam(team, { id1: tournament.id })}>Save</Button>
  </div>

export default compose(
  connect(teamSelector, actions),
  withParams,
  withLoad('players'),
  withLoad('tournament', 'id1'),
  withEdit('team', 'tournament.teams', {players:[]}),
  withSuccess('team', () => alert('Saved'), () => alert('Error happened!'))
)(Team)

// const toTeam = (t, ps) => ({
//   id: t.id,
//   name: t.name,
//   players: (t.players || []).map((p, i) => is(Object, p) ? p : {id: +p, rating: getPropById('rating')(+p)(ps) })
// })