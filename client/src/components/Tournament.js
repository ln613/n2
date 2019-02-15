import React from 'react';
import { connect } from '@ln613/state';
import { compose } from 'recompose';
import { pipe, take } from 'ramda';
import actions from 'utils/actions';
import { tournamentSelector } from 'utils/selectors';
import { withLoad, withLoadForce, withParams } from '@ln613/compose';
import { Table, withMobile } from '@ln613/ui/semantic';
import { tap } from '@ln613/util';
import TMenu from './TMenu';

const mapPlayer = p => ({ id: p.id, 'Name': p.firstName + ' ' + p.lastName, gender: p.sex, 'Tournament Rating': p.tRating, 'Latest Rating': p.rating, 'Is Sub': p.isSub ? '&#10004' : '' });
const mapTeam = t => !t.players || t.players.length < 2 ? {} :
  pipe(take(2), x => ({
    id: t.id,
    name: x[0].name + ' / ' + x[1].name,
    'Combined Rating': (+x[0].tRating || +x[0].rating) + (+x[1].tRating || +x[1].rating)
  }))(t.players);

const single = players =>
  <Table name="players" data={(players || []).map(mapPlayer)}>
    <td key="id" hidden />  
    <td key="Is Sub" hidden />  
  </Table>

const teams = ts =>
  (ts || []).map(t =>
    <div class="pt8" key={t.id}>
      <div class="pv8 fs24 darkgreen">{t.name}</div>
      <Table name="team" data={(t.players || []).map(mapPlayer)}>
        <td key="id" hidden />  
      </Table>
    </div>
  )

const groups = gs =>
  (gs || []).map(g =>
    <div class="pt8" key={g[0]}>
      <div class="pv8 fs24 darkgreen">Group {g[0]}</div>
      <Table name="team" data={(g[1] || []).map(mapTeam)}>
        <td key="id" hidden />  
      </Table>
    </div>
  )

const Tournament = ({ lookup, tournament, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tap(tournament).isSingle} isGroup={tournament.groups} isMobile={isMobile} page="tournament" />
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tournament.name}</h1>
      <hr/>
      {tournament.isSingle ? single(tournament.players) : (tournament.groups ? groups(tournament.groups) : teams(tournament.teams))}
    </div>
  </div>  

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament'),
  withMobile
)(Tournament);

