import React from 'react';
import { connect } from '@ln613/state';
import { compose } from 'recompose';
import { isNil } from 'ramda';
import actions from 'utils/actions';
import { tournamentSelector } from 'utils/selectors';
import { withLoad, withLoadForce, withParams } from '@ln613/compose';
import { Table, withMobile } from '@ln613/ui/semantic';
import { get } from '@ln613/util';
import TMenu from './TMenu';

const Tournament = ({ lookup, tournament, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tournament.isSingle} isGroup={!isNil(get('teams[0].group')(tournament))} isMobile={isMobile} page="tournament" />
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tournament.name}</h1>
      <hr/>
      {!tournament.isSingle && tournament.teams ?
      (tournament.teams || []).map(t =>
        <div class="pt8" key={t.id}>
          <div class="pv8 fs24 darkgreen">{t.name}</div>
          <Table name="team" data={(t.players || []).map(mapPlayer)}>
            <td key="id" hidden />  
          </Table>
        </div>
      ) :
      <Table name="players" data={(tournament.players || []).map(mapPlayer)}>
        <td key="id" hidden />  
        <td key="Is Sub" hidden />  
      </Table>
    }
    </div>
  </div>  

export default compose(
  connect(tournamentSelector, actions),
  withParams,
  withLoad('players'),
  withLoadForce('tournament'),
  withMobile
)(Tournament);

const mapPlayer = p => ({ id: p.id, 'Name': p.firstName + ' ' + p.lastName, gender: p.sex, 'Tournament Rating': p.tRating, 'Latest Rating': p.rating, 'Is Sub': p.isSub ? '&#10004' : '' });