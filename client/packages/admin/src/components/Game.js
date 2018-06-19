import React from 'react';
import { compose, withProps } from 'recompose';
import { range } from 'ramda';
import { connect } from 'no-redux';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { gameSelector } from 'utils/selectors';
import { TextBox, Select, CheckBox } from 'utils/comps';
import { withLoad, withEdit, withSuccess, withParams, getPropById, findById, getNameById } from 'utils';

const Game = ({ tournament, game, games, schedule, match, players, putGame, postGame, id }) =>
  <div>
    <h1>Match - {tournament.name} - {schedule.date}</h1>
    <hr />
    <TextBox name="game.id" disabled class="mr16"/>
    <CheckBox name="game.isDouble" label="Is Double?"/>
    <div class="f aic">
      <div>  
        <div class="pr8 pb32">{getNameById(match.home)(tournament.teams)}</div>
        <div class="pr8">{getNameById(match.away)(tournament.teams)}</div>
      </div>  
      <div>  
        <Select name={`game.p1`} options={getPropById('players')(match.home)(tournament.teams)} />
        <Select name={`game.p2`} options={getPropById('players')(match.away)(tournament.teams)} />
      </div>  
      {game.isDouble ?
      <div>
        <Select name={`game.p3`} options={getPropById('players')(match.home)(tournament.teams)} />
        <Select name={`game.p4`} options={getPropById('players')(match.away)(tournament.teams)} />
      </div>
      : null}
      <div>  
        <div class="f aic">{range(0, 5).map(n => <TextBox name={`game.g1[${n}]`} noLabel style={{width: '50px'}}/>)}</div>
        <div class="f aic">{range(0, 5).map(n => <TextBox name={`game.g2[${n}]`} noLabel style={{width: '50px'}}/>)}</div>
      </div>  
      <div>  
        <div class="pl8 pb32">{range(0, 5).filter(x => gg(game.g1, x) > gg(game.g2, x)).length}</div>
        <div class="pl8">{range(0, 5).filter(x => gg(game.g1, x) < gg(game.g2, x)).length}</div>
      </div>  
    </div>
    <hr />
    <Button primary onClick={() => id[0] === '+' ? postGame(toGame(game, schedule, match), { id1: tournament.id }) : putGame(game, { id1: tournament.id, id: game.id })}>Save</Button>
  </div>

export default compose(
  connect(gameSelector, actions),
  withParams,
  withLoad('players'),
  withLoad('tournament', 'T', true),
  withEdit('game', 'tournament.games', { g1: [], g2: []}),
  withProps(p => ({ schedule: findById(p.S)(p.tournament.schedules) || {} })),
  withProps(p => ({ match: findById(p.M)((p.schedule || {}).matches) || {} })),
  withSuccess('game', () => alert('Saved'), () => alert('Error happened!'))
)(Game)

const gg = (g, x) => +((g && g[x]) || 0);

const toGame = (g, s, m) => ({ ...g, date: s.date, t1: m.home, t2: m.away });