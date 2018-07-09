import React from 'react';
import { compose } from 'recompose';
import { connect } from 'no-redux';
import actions from 'utils/actions';
import { withLoad, withParams, withNewId } from 'utils';
import { tournamentSelector } from 'utils/selectors';
import { Table } from 'utils/comps';
import { withRouter } from "react-router-dom";
import { Button } from 'semantic-ui-react';

const Teams = ({ tournament, history, id, newId }) =>
  <div>
    <div class="f">
      <h1 class="fg1">Teams - {tournament.name}</h1>
      <Button primary onClick={() => history.push(`/team/${id}/+${newId}`)}>Add</Button>
    </div>
    <hr/>
    <Table name="teams" link={x => `/team/${id}/${x}`} data={(tournament.teams || []).map(x => ({ 'id': x.id, 'name': x.name }))} />
  </div>

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoad('tournament'),
  withNewId('tournament.teams'),
  withRouter
)(Teams)