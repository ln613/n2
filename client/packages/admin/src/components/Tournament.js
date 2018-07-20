import React from 'react';
import { compose } from 'recompose';
import { connect } from 'no-redux';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { tourSelector } from 'utils/selectors';
import { TextBox, CheckBox, withMobile } from 'utils/comps';
import { withEdit, withSuccess, withParams, tap } from 'utils';
import { withRouter } from "react-router-dom";

const Tournament = ({ tournament, history, postTour, patchTour, getGenrr, id, isMobile }) =>
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
      {tournament.isSingle
        ? <Button primary onClick={() => getGenrr({ id })}>Generate Schedule</Button>
        : null
      }
    </div>  
    : null}  
    <TextBox name="tournament.id" disabled />
    <TextBox name="tournament.name" fluid />
    <CheckBox name="tournament.isSingle" label="Is Single?" />
    <TextBox name="tournament.startDate" />
    <TextBox name="tournament.ratingDate" />
    <hr />
    <Button primary onClick={() => id[0] !== '+' ? patchTour(tournament) : postTour(tournament)}>Save</Button>
  </div>

export default compose(
  connect(tourSelector, actions),
  withParams,
  withEdit('tournament'),
  withSuccess('tour', () => alert('Saved'), () => alert('Error happened!')),
  withRouter,
  withMobile
)(Tournament)