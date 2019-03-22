import React from 'react';
import { connect } from '@ln613/state';
import { compose } from 'recompose';
import { withRouter } from "react-router-dom";
import actions from 'utils/actions';
import { ratingSelector } from 'utils/selectors';
import { withLoad } from '@ln613/compose';
import { TextBox, Table } from '@ln613/ui/semantic';
import { FixedSizeList as List } from 'react-window';
import { tap } from '@ln613/util';

const Row = (ps, history) => ({ index, style }) =>
  <div class="four column row tbody cp" onClick={() => history.push('/rating/' + ps[index].id)}>
    {['firstName', 'lastName', 'sex', 'rating'].map((x, j) => <div class={`${j < 2 ? 'five' : 'three'} wide column`}>{ps[index][x]}</div>)}
  </div>

const Rating = ({ lookup, players, history }) =>
  <div class="p16 fv">
    <div class="f">
      <h1 class="fg1">Rating</h1>
      <TextBox name="player" placeholder='Search player...' />
    </div>  
    <div class="ui divider"></div>
    <List class="ui padded striped grid" height={300} width={300} itemCount={players.length} itemSize={50} >
      {Row(players, history)}
    </List>
  </div>

export default compose(
  connect(ratingSelector, actions),
  withLoad('players'),
  withRouter
)(Rating);

{/* <Table name="rating" data={players} link>
<td key="id" hidden />
<td key="name" hidden />
<td key="firstName" title="First Name"/>
<td key="lastName" title="Last Name"/>
<td key="sex" title="Gender"/>
<td key="text" hidden />
<td key="value" hidden />
</Table> */}


{/* <div class="four column row thead">
{['First Name', 'Last Name', 'Gender', 'Rating'].map((x, i) => <div class={`${i < 2 ? 'five' : 'three'} wide column`}>{x}</div>)}
</div> */}
