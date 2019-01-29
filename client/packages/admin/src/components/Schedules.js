import React from 'react';
import { isNil } from 'ramda';
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
      {/* <Button primary onClick={() => history.push(`/schedule/${id}/+${newId}`)}>Add</Button> */}
    </div>
    <hr/>
    <Table name="schedules" link={x => `/schedule/${id}/${x}`} data={(tournament.schedules || []).map(x => ({
      'id': x.id || (+x.group + 1),
      [tournament.isSingle ? 'round' : (isNil(x.group) ? 'date' : 'group')]: tournament.isSingle ? ('Round ' + x.id) : (isNil(x.group) ? x.date : ('Group ' + (+x.group + 1))) })
    )} />
  </div>

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament'),
  withNewId('tournament.schedules'),
  withRouter
)(Schedules)