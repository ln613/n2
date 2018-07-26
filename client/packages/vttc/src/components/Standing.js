import React from 'react';
import { connect } from 'no-redux';
import { compose, lifecycle } from 'recompose';
import { isNil } from 'ramda';
import actions from 'utils/actions';
import { standingSelector } from 'utils/selectors';
import { withLoad, withParams, tap } from 'utils';
import { Table, withMobile, Ready } from 'utils/comps';
import TMenu from './TMenu';

const Standing = ({ standing, tournament, players, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tournament.isSingle} isMobile={isMobile} page="standing" />
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tap(tournament).name}</h1>
      <hr/>
      <Ready on={[players, tournament]}><Table name="standing" data={standing}/></Ready>
    </div>
  </div>

export default compose(
  connect(standingSelector, actions),
  lifecycle({
    shouldComponentUpdate(p) {tap(p);
      return p.players.length > 0;
    }
  }),
  withParams,
  withLoad('players'),
  withLoad('tournament', 'id'),
  withMobile
)(Standing);
