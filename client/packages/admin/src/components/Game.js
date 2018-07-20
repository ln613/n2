import React from 'react';
import { compose, withProps } from 'recompose';
import { range } from 'ramda';
import { connect } from 'no-redux';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { gameSelector } from 'utils/selectors';
import { TextBox, Select, CheckBox } from 'utils/comps';
import { withLoad, withEdit, withSuccess, withParams, getPropById, findById, getNameById, tap, adjustRating } from 'utils';

const Game = p =>
  <div>
    <h1>Match - {p.tournament.name} - {p.schedule.date}</h1>
    <hr />
    <TextBox name="game.id" disabled class="mr16"/>
    <CheckBox name="game.isDouble" label="Is Double?"/>
    <div class="f ais">
      <div class="fv jcsa">  
        <div class="pr8 pb32">{getNameById(p.match.home)(p.tournament.teams)}</div>
        <div class="pr8">{getNameById(p.match.away)(p.tournament.teams)}</div>
      </div>  
      <div class="fv jcsa">  
        <Select name={`game.p1`} options={getPropById('players')(p.match.home)(p.tournament.teams)} onChange={v => p.setFormGame(getPropById('rating')(+v)(p.players), { prop: 'p1Rating' })}/>
        <Select name={`game.p2`} options={getPropById('players')(p.match.away)(p.tournament.teams)} onChange={v => p.setFormGame(getPropById('rating')(+v)(p.players), { prop: 'p2Rating' })}/>
      </div>  
      {p.game.isDouble ?
      <div class="fv jcsa">
        <Select name={`game.p3`} options={getPropById('players')(p.match.home)(p.tournament.teams)} />
        <Select name={`game.p4`} options={getPropById('players')(p.match.away)(p.tournament.teams)} />
      </div>
      : null}
      <div class="fv jcsa">  
        <div class="f aic">{range(0, 5).map(n => <TextBox name={`game.g1[${n}]`} noLabel style={{width: '50px'}}/>)}</div>
        <div class="f aic">{range(0, 5).map(n => <TextBox name={`game.g2[${n}]`} noLabel style={{width: '50px'}}/>)}</div>
      </div>  
      <div class="fv jcsa">  
        <div class="pl8 pb32">{range(0, 5).filter(x => gg(p.game.g1, x) > gg(p.game.g2, x)).length}</div>
        <div class="pl8">{range(0, 5).filter(x => gg(p.game.g1, x) < gg(p.game.g2, x)).length}</div>
      </div>  
    </div>
    <TextBox name={`game.result`} label="Result"/>
    <hr />
    <Button primary onClick={() => save(p)}>Save</Button>
  </div>

export default compose(
  connect(gameSelector, actions),
  withParams,
  withLoad('players'),
  withLoad('tournament', ['id', 'T'], true),
  withEdit('game', 'tournament.games', { g1: [], g2: []}),
  withProps(p => ({ schedule: findById(p.S)(p.tournament.schedules) || {} })),
  withProps(p => ({ match: findById(p.M)((p.schedule || {}).matches) || {} })),
  withSuccess('game', () => alert('Saved'), () => alert('Error happened!'))
)(Game)

const gg = (g, x) => +((g && g[x]) || 0);

const toGame = (g, s, m) => ({ ...adjustRating(g), date: s.date, t1: m.home, t2: m.away });

const save = p => {
  const isAdd = p.id[0] === '+';
  const g = isAdd ? toGame(p.game, p.schedule, p.match) : p.game;

  if (isAdd) {
    p.postGame(g, { id1: p.tournament.id });
    if (!g.isDouble) {
      const p1 = findById(g.p1)(p.players);
      p.putPlayer({...p1, rating: Math.max(g.p1Rating + g.p1Diff, 100)});
      const p2 = findById(g.p2)(p.players);
      p.putPlayer({...p2, rating: Math.max(g.p2Rating + g.p2Diff, 100)});
    }
  }
  else {
    p.putGame(g, { id1: p.tournament.id, id: p.game.id });
  }
}