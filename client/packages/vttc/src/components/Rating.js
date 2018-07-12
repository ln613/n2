import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { ratingSelector } from 'utils/selectors';
import { withLoad } from 'utils';
import { TextBox, Table } from 'utils/comps';

const Rating = ({ lookup, players }) =>
  <div class="p16 fv">
      <div class="f">
        <h1 class="fg1">Rating</h1>
        <TextBox name="player" placeholder='Search player...' />
      </div>  
      <div class="ui divider"></div>
    <Table name="rating" data={players} link>
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
  withLoad('players')
)(Rating);
