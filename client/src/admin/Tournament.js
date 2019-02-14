import React from 'react';
import { compose, withProps } from 'recompose';
import { find, is } from 'ramda';
import { connect } from '@ln613/state';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { tourSelector } from 'utils/selectors';
import { TextBox, CheckBox, withMobile } from '@ln613/ui/semantic';
import { withMount, withParams, withLoad, withLoadForce } from '@ln613/compose';
import { tap } from '@ln613/util';
import { withRouter } from "react-router-dom";
import { withSuccess } from 'utils';

const Tournament = ({ tournament, standing, ko, isGroup, history, postTour, patchTour, postGenrr, postGengroup, id, isMobile }) =>
  <div>
    <h1>Tournament - {+tournament.id ? tournament.name : 'Add New'}</h1>
    <hr />
    {+tournament.id ?
      <div>
        {tournament.isSingle
          ? <Button primary onClick={() => history.push(`/admin/singleplayers/${tournament.id}`)}>Players</Button>
          : <Button primary onClick={() => history.push(`/admin/teams/${tournament.id}`)}>Teams</Button>
        }
        <Button primary onClick={() => history.push(`/admin/schedules/${tournament.id}`)}>Schedules</Button>
        <Button primary onClick={() => history.push(`/admin/games/${tournament.id}`)}>Games</Button>
        <Button primary onClick={() => postGengroup({ id })}>Generate Groups</Button>
        <Button primary onClick={() => postGenrr({ id })}>Generate Schedule</Button>
        {tournament.isSingle || tournament.has2half ? null :
          <Button primary onClick={() => postGenrr({ id, standing, koStanding: ko })}>Generate {isGroup ? 'KO' : 'Schedule 2'}</Button>
        }
      </div>  
    : null}  
    <TextBox name="tournament.id" disabled />
    <TextBox name="tournament.name" fluid />
    <CheckBox name="tournament.isSingle" label="Is Single?" />
    <TextBox name="tournament.startDate" />
    <TextBox name="tournament.startDate2" />
    <TextBox name="tournament.ratingDate" />
    <hr />
    <Button primary onClick={() => id[0] !== '+' ? patchTour(tournament) : postTour(tournament)}>Save</Button>
  </div>;

export default compose(
  connect(tourSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament'),
  withMount(p => p.setForm(find(x => x.id == +p.id, (p.tournaments || [])) || { id: +p.id, name: '',  startDate: '', startDate2: '', isSingle: false, ratingDate: '' }, { path: 'tournament' })),
  withProps(({ standing }) => ({ isGroup: is(Array, standing) && standing.length > 2 })),
  withSuccess('tour', () => alert('Saved'), () => alert('Error happened!')),
  withRouter,
  withMobile
)(Tournament);
