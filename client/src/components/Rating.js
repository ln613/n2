import React from 'react';
import { connect } from '@ln613/state';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { ratingSelector } from 'utils/selectors';
import { withLoad, withState } from '@ln613/compose';
import { TextBox, Table } from '@ln613/ui/semantic';

const Rating = ({ lookup, players, filter, setFilter }) =>
  <div class="p16 fv">
      <div class="f">
        <h1 class="fg1">Rating</h1>
        <input name="player" placeholder='Search player...' value={filter} onChange={e => setFilter(e.target.value.toLowerCase())} />
      </div>  
      <div class="ui divider"></div>
    <Table name="rating" data={players.filter(p => !filter || p.name.toLowerCase().indexOf(filter) > -1)} link>
      <td key="id" hidden />
      <td key="name" hidden />
      <td key="firstName" title="First Name"/>
      <td key="lastName" title="Last Name"/>
      <td key="sex" title="Gender"/>
      <td key="text" hidden />
      <td key="value" hidden />
    </Table>
  </div>

export default compose(
  connect(ratingSelector, actions),
  withLoad('players'),
  withState('filter')
)(Rating);
