import React from 'react';
import { connect } from '@ln613/state';
import { compose, lifecycle } from 'recompose';
import { isNil } from 'ramda';
import actions from 'utils/actions';
import { standingSelector } from 'utils/selectors';
import { withLoad, withParams } from '@ln613/compose';
import { Table, withMobile, Ready } from '@ln613/ui/semantic';
import TMenu from './TMenu';

const Standing = ({ standing, tournament, players, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tournament.isSingle} isMobile={isMobile} page="standing" />
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tournament.name}</h1>
      <hr/>
      {tournament.startDate2 ?
        <Ready on={[players, tournament]}>
          <div class="fs18 fw6 pt8">Upper Division</div>
          <Table name="standing1" data={standing[0]} />
          <div class="fs18 fw6">Lower Division</div>
          <Table name="standing2" data={standing[1]} />
          <hr />
          <div>Note: The results from first round will carry over to the second round.</div>
        </Ready> :
        <Ready on={[players, tournament]}>
          <Table name="standing" data={standing} />
        </Ready>
      }
  </div>
  </div>

export default compose(
  connect(standingSelector, actions),
  lifecycle({
    shouldComponentUpdate(p) {
      return p.players.length > 0;
    }
  }),
  withParams,
  withLoad('players'),
  withLoad('tournament'),
  withMobile
)(Standing);
