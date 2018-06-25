import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { playersSelector } from 'utils/selectors';
import { cdurl, withLoad, withLang } from 'utils';
import { TextBox } from 'utils/comps';

const s1 = s => ({
  width: '130px',
  height: '130px',
  marginRight: '16px',
  //borderRadius: '500rem',
  background: `url(/images/${s === 'M' ? 'male' : 'female'}.png) no-repeat scroll 0 0`
});

const Players = ({ lookup, players }) =>
  <div class="p16 fv">
    <div class="ph16">
      <div class="f">
        <h1 class="fg1">Players</h1>
        <TextBox name="player" placeholder='Search player...' />
      </div>  
      <div class="ui divider"></div>
    </div>
    <div class="fw w100">
      {players.map((x, i) =>
        <div class="f w50 p16">  
          <div class="card w100 f p16">
            <img src={cdurl(lookup, 'players', x.id)} style={s1(x.sex)} alt="" />
            <div class="fv">
              <div class="fw8">{x.firstName} {x.lastName}</div>
              <div>Rating: {x.rating}</div>
            </div>
          </div>
        </div>
      )}  
    </div>
  </div>

export default compose(
  connect(playersSelector, actions),
  withLoad('players'),
  withLang
)(Players);
