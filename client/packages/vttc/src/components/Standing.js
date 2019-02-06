import React from 'react';
import { connect } from '@ln613/state';
import { compose, lifecycle } from 'recompose';
import { isNil, omit } from 'ramda';
import actions from 'utils/actions';
import { standingSelector } from 'utils/selectors';
import { withLoad, withParams } from '@ln613/compose';
import { Table, withMobile, Ready } from '@ln613/ui/semantic';
import TMenu from './TMenu';
import { tap } from '@ln613/util';

const Standing = ({ standing, tournament, players, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tournament.isSingle} isMobile={isMobile} page="standing" />
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tournament.name}</h1>
      <hr/>
      {tournament.has2half ?
        <Ready on={[players, tournament]}>
          <div class="fs18 fw6 pt8">Upper Division</div>
          <Table name="standing1" data={standing[0]} />
          <div class="fs18 fw6">Lower Division</div>
          <Table name="standing2" data={standing[1]}><td key="id" hidden /></Table>
          <hr />
          <div>Note: The results from first round will carry over to the second round.</div>
        </Ready> :
        <Ready on={[players, tournament]}>
          {tournament.groups
            ? standing.map((s, i) =>
              <div class="pt8" key={i}>
                <div class="pv8 fs24 darkgreen">Group {s && s.length > 0 && s[0].group}</div>
                <Table name={'standing' + i} data={s}>
                  <td key="group" hidden />
                  <td key="id" hidden />
                </Table>
              </div>
            )
            : <Table name="standing" data={standing}><td key="id" hidden /></Table>
          }
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
