import React from 'react';
import { compose } from 'recompose';
import { pick } from 'ramda';
import { connect } from '@ln613/state';
import actions from 'utils/actions';
import { withLoad, withNewId } from '@ln613/compose';
import { playersSelector } from 'utils/selectors';
import { Table } from '@ln613/ui/semantic';
import { withRouter } from "react-router-dom";
import { Button } from 'semantic-ui-react';

const Players = ({ players, history, newId }) =>
  <div>
    <div class="f">
      <h1 class="fg1">Players</h1>
      <Button primary onClick={() => history.push(`/admin/players/+${newId}`)}>Add</Button>
    </div>
    <hr/>
    <Table name="players" data={players.map(pick(['id', 'name', 'name_ch']))} link={x => `/admin/players/${x.id}`} />
  </div>

export default compose(
  connect(playersSelector, actions),
  withLoad('players'),
  withNewId('players'),
  withRouter
)(Players)