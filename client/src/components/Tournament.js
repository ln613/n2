import React from 'react';
import { connect } from '@ln613/state';
import { compose, withProps } from 'recompose';
import { pipe, take, pick } from 'ramda';
import actions from 'utils/actions';
import { tournamentSelector } from 'utils/selectors';
import { withLoad, withLoadForce, withParams, withMount } from '@ln613/compose';
import { Table, withMobile, Ready } from '@ln613/ui/semantic';
import { tap } from '@ln613/util';
import TMenu from './TMenu';
import { highlightWinner } from 'utils';

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

const games = gs =>
  <Table name="games" data={(gs || []).map(highlightWinner).map(pick(['player1', 'result', 'player2' ]))}>
  </Table>

const Tournament = ({ lookup, tournament, id, isOldTournament, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    {isOldTournament ? null : <TMenu id={id} isSingle={tournament.isSingle} isGroup={tournament.groups} isMobile={isMobile} page="tournament" />}
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tournament.name}</h1>
      <hr />
      <Ready on={[tournament]}>
        {isOldTournament
          ? games(tournament.games)
          : (tournament.isSingle
            ? single(tournament.players)
            : (tournament.groups
              ? groups(tournament.groups)
              : teams(tournament.teams)
            )
          )
        }
      </Ready>
    </div>
  </div>  

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament'),
  withProps(({ tournament }) => ({ isOldTournament: (tournament.teams || []).length === 0 && (tournament.schedules || []).length === 0 })),
  withMount(p => p.setTournament()),
  withMobile
)(Tournament);

