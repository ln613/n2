import React from 'react';
import { compose } from 'recompose';
import { find } from 'ramda';
import { connect } from '@ln613/state';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { teamSelector } from 'utils/selectors';
import { TextBox } from '@ln613/ui/semantic';
import { withLoad, withEdit, withParams, withMount } from '@ln613/compose';
import AddPlayer from './AddPlayer';
import { withSuccess } from 'utils';
import { withRouter } from "react-router-dom";

const Team = ({ tournament, team, players, monthRatings, putTeam, postTeam, id, setFormTeamPlayers, getPlayerRating, history }) =>
  <div>
    <h1>Team - {team.name}</h1>
    <hr />
    <TextBox name="team.id" disabled />
    <TextBox name="team.name" />
    <TextBox name="team.group" />
    <br/>
    Players:
    <AddPlayer players={team.players} allPlayers={players} formPath='team' setFormPlayers={setFormTeamPlayers} getPlayerRating={getPlayerRating} withSub />
    <hr />
    <Button primary onClick={history.goBack}>Back</Button>
    <Button primary onClick={() => id[0] !== '+' ? putTeam(team, { id1: tournament.id, id: team.id }) : postTeam(team, { id1: tournament.id })}>Save</Button>
  </div>

export default compose(
  connect(teamSelector, actions),
  withParams,
  withLoad('players'),
  withLoad('tournament', ['id', 'id1']),
  withMount(p => p.setForm(find(x => x.id == +p.id, (p.tournament.teams || [])) || { id: +p.id, name: '', group: undefined }, { path: 'team' })),
  withSuccess('team', () => alert('Saved'), () => alert('Error happened!')),
  withRouter
)(Team)

// const toTeam = (t, ps) => ({
//   id: t.id,
//   name: t.name,
//   players: (t.players || []).map((p, i) => is(Object, p) ? p : {id: +p, rating: getPropById('rating')(+p)(ps) })
// })