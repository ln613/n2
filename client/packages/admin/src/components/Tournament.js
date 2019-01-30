import React from 'react';
import { compose } from 'recompose';
import { connect } from '@ln613/state';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { tourSelector } from 'utils/selectors';
import { TextBox, CheckBox, withMobile } from '@ln613/ui/semantic';
import { withEdit, withParams, withLoad, withLoadForce } from '@ln613/compose';
import { tap } from '@ln613/util';
import { withRouter } from "react-router-dom";
import { withSuccess } from 'utils';

const Tournament = ({ tournament, standing, history, postTour, patchTour, postGenrr, postGengroup, id, isMobile }) =>
  <div>
    <h1>Tournament - {+tournament.id ? tournament.name : 'Add New'}</h1>
    <hr />
    {+tournament.id ?
    <div>  
      {tournament.isSingle
        ? <Button primary onClick={() => history.push(`/singleplayers/${tournament.id}`)}>Players</Button>
        : <Button primary onClick={() => history.push(`/teams/${tournament.id}`)}>Teams</Button>
      }
      <Button primary onClick={() => history.push(`/schedules/${tournament.id}`)}>Schedules</Button>
      <Button primary onClick={() => history.push(`/games/${tournament.id}`)}>Games</Button>
      <Button primary onClick={() => postGengroup({ id })}>Generate Groups</Button>
      <Button primary onClick={() => postGenrr({ id })}>Generate Schedule</Button>
      {tournament.isSingle || tournament.has2half ? null :
        <Button primary onClick={() => postGenrr({ id, standing })}>Generate Schedule 2</Button>
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
  </div>

export default compose(
  connect(tourSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament'),
  withEdit('tournament'),
  withSuccess('tour', () => alert('Saved'), () => alert('Error happened!')),
  withRouter,
  withMobile
)(Tournament)