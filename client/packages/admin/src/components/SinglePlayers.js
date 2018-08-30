import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'no-redux';
import moment from 'moment';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { tourSelector } from 'utils/selectors';
import { TextBox, Select, CheckBox } from 'utils/comps';
import { withLoad, withEditList, withSuccess, withParams } from 'utils';
import AddPlayer from './AddPlayer';

const SinglePlayers = ({ tournament, date, players, patchTour, setFormTournamentPlayers, getPlayerRating, id }) =>
  <div>
    <h1>Players - {tournament.name}</h1>
    <hr />
    <AddPlayer players={tournament.players} allPlayers={players} formPath='tournament' date={date} setFormPlayers={setFormTournamentPlayers} getPlayerRating={getPlayerRating} />
    <hr />
    <Button primary onClick={() => patchTour(toTour(tournament), { id })}>Save</Button>
  </div>

export default compose(
  connect(tourSelector, actions),
  withParams,
  withProps(p => ({ date: moment(p.tournament.ratingDate).format('YYYY-MM-DD') })),
  withLoad('players'),
  withLoad('tournament'),
  withEditList('tournament.players'),
  withSuccess('tour', () => alert('Saved'), () => alert('Error happened!'))
)(SinglePlayers)

const toTour = t => ({id: t.id, players: (t.players || []).map(p => ({id: +(p.id || 0), rating: +p.rating})) })