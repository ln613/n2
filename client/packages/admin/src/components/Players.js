import React from 'react';
import { compose } from 'recompose';
import { pick } from 'ramda';
import { connect } from 'no-redux';
import actions from 'utils/actions';
import { withLoad, withNewId } from 'utils';
import { playersSelector } from 'utils/selectors';
import { Table } from 'utils/comps';
import { withRouter } from "react-router-dom";
import { Button } from 'semantic-ui-react';

const Players = ({ dsPlayers, history, newId }) =>
  <div>
    <div class="f">
      <h1 class="fg1">Players</h1>
      <Button primary onClick={() => history.push(`/players/${newId}`)}>Add</Button>
    </div>
    <hr/>
    <Table name="players" data={dsPlayers.map(pick(['id', 'name', 'name_ch']))} link />
  </div>

export default compose(
  connect(playersSelector, actions),
  withLoad('players'),
  withNewId('players'),
  withRouter
)(Players)