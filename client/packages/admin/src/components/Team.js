import React from 'react';
import { compose } from 'recompose';
import { connect } from 'no-redux';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { teamSelector } from 'utils/selectors';
import { TextBox, Select, CheckBox } from 'utils/comps';
import { withLoad, withEdit, withSuccess, withParams } from 'utils';

const Team = ({ tournament, team, players, monthRatings, putTeam, postTeam, id, setFormTeamPlayers }) =>
  <div>
    <h1>Team - {team.name}</h1>
    <hr />
    <TextBox name="team.id" disabled />
    <TextBox name="team.name" />
    <br/>
    Players:
    {(team.players || []).map((p, i) =>
      <div class="f aic mrc8" key={`players${i}`}>
        <Select name={`team.players[${i}].id`} index={i} options={players} onChange={x => alert('h')} />
        <CheckBox name={`team.players[${i}].isSub`} index={i} label="Is Substitute?" />
        <div>Tournament Rating: {p.rating}</div>
        <Select name={`team.players[${i}].rating`} index={i} options={monthRatings} />
      </div>
    )}
    <Button secondary onClick={() => setFormTeamPlayers({})}>Add Player</Button>
    <hr />
    <Button primary onClick={() => id[0] !== '+' ? putTeam(team, { id1: tournament.id, id: team.id }) : postTeam(team, { id1: tournament.id })}>Save</Button>
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