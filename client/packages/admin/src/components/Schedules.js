import React from 'react';
import { compose } from 'recompose';
import { connect } from '@ln613/state';
import actions from 'utils/actions';
import { withLoad, withLoadForce, withParams, withNewId } from '@ln613/compose';
import { tournamentSelector } from 'utils/selectors';
import { Table } from '@ln613/ui/semantic';
import { withRouter } from "react-router-dom";
import { Button } from 'semantic-ui-react';

const Schedules = ({ tournament, history, id, newId }) =>
  <div>
    <div class="f">
      <h1 class="fg1">Schedules - {tournament.name}</h1>
      <Button primary onClick={() => history.push(`/schedule/${id}/+${newId}`)}>Add</Button>
    </div>
    <hr/>
    <Table name="schedules" link={x => `/schedule/${id}/${x}`} data={(tournament.schedules || []).map(x => ({ 'id': x.id, [tournament.isSingle ? 'round' : 'date']: tournament.isSingle ? ('Round ' + x.id) : x.date }))} />
  </div>

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament'),
  withNewId('tournament.schedules'),
  withRouter
)(Schedules)