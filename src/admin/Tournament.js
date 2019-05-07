import React, { Fragment } from 'react';
import { compose, withProps } from 'recompose';
import { find, is } from 'ramda';
import { connect } from '@ln613/state';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { tourSelector } from 'utils/selectors';
import { TextBox, CheckBox, withMobile } from '@ln613/ui/semantic';
import { withMount, withParams, withLoad, withLoadForce } from '@ln613/compose';
import { tap } from '@ln613/util';
import { withRouter, Link } from "react-router-dom";
import { withSuccess } from 'utils/ui';

const b1 = tournament =>
  <Fragment>
    {tournament.isSingle
      ? <Link class="item" to={`/admin/singleplayers/${tournament.id}`}>Players</Link>
      : <Link class="item" to={`/admin/teams/${tournament.id}`}>Teams</Link>
    }
    <Link class="item" to={`/admin/schedules/${tournament.id}`}>Schedules</Link>
    <Link class="item" to={`/admin/games/${tournament.id}`}>Games</Link>
  </Fragment>;

const b2 = p =>
  <Fragment>
    <Link class="item" onClick={() => p.postGengroup({ id: p.id })} to="#">Generate Groups</Link>
    <Link class="item" onClick={() => p.postGenrr({ id: p.id })} to="#">Generate Schedule</Link>
    <Link class="item" onClick={() => p.postGenrr({ id: p.id, standing: p.standing, koStanding: p.ko })} to="#">Generate {p.isGroup ? 'KO' : 'Schedule 2'}</Link>
  </Fragment>;

const Tournament = p =>
  <div>
    <h1>Tournament - {+p.tournament.id ? p.tournament.name : 'Add New'}</h1>
    <hr />
    {+p.tournament.id ? (p.isMobile ?
      <Fragment>
        <div class={`ui top attached three item menu`}>
          {b1(p.tournament)}
        </div>
        <div class={`ui bottom attached three item menu`}>
          {b2(p)}
        </div>
      </Fragment> :
      <div class={`ui six item menu`}>
        {b1(p.tournament)}
        {b2(p)}
      </div>
    ) : null}  
    <TextBox name="tournament.id" disabled />
    <TextBox name="tournament.name" fluid />
    <CheckBox name="tournament.isSingle" label="Is Single?" />
    <TextBox name="tournament.startDate" />
    <TextBox name="tournament.startDate2" />
    {/* <TextBox name="tournament.ratingDate" /> */}
    <hr />
    <Button primary onClick={p.history.goBack}>Back</Button>
    <Button primary onClick={() => p.id[0] !== '+' ? p.patchTour(p.tournament) : p.postTour(p.tournament)}>Save</Button>
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
