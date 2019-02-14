import React from 'react';
import { compose } from 'recompose';
import { sortWith, descend, prop } from 'ramda';
import { connect } from '@ln613/state';
import actions from 'utils/actions';
import { withLoad, withNewId } from '@ln613/compose';
import { tournamentsSelector } from 'utils/selectors';
import { Table } from '@ln613/ui/semantic';
import { withRouter } from "react-router-dom";
import { Button } from 'semantic-ui-react';

const Tournaments = ({ tournaments, history, newId }) =>
  <div>
    <div class="f">
      <h1 class="fg1">Tournaments</h1>
      <Button primary onClick={() => history.push(`/admin/tournaments/+${newId}`)}>Add</Button>
    </div>
    <hr/>
    <Table name="tournaments" data={sortWith([descend(prop('id'))], tournaments.map(x => ({ 'id': x.id, 'name': x.name })))} link={x => `/admin/tournaments/${x.id}`} />
  </div>

export default compose(
  connect(tournamentsSelector, actions),
  withLoad('tournaments'),
  withNewId('tournaments'),
  withRouter
)(Tournaments)