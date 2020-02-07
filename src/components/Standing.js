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

const table = (n, d, isMobile, isGroup) =>
  <Table name={(isGroup ? 'g' : '') + 'standing' + n} data={d} isMobile={isMobile}>
    <td key="group" hidden />
    <td key="id" hidden />
    <td key="team" title={isGroup ? `Player${d && d[0].team.indexOf('/') > -1 ? 's' : ''}` : 'Team'}/>
    <td key="mw" title="MW"/>
    <td key="ml" title="ML"/>
    <td key="gw" title="GW"/>
    <td key="gl" title="GL"/>
  </Table>

const Standing = ({ standing, tournament, players, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tournament.isSingle} isMobile={isMobile} page="standing" />
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tournament.name}</h1>
      <hr/>
      {tournament.has2half ?
        <Ready on={[players, tournament]}>
          <div class="fs18 fw6 pt8">Upper Division</div>
          {table(1, standing[0], isMobile)}
          <div class="fs18 fw6">Lower Division</div>
          {table(2, standing[1], isMobile)}
          <hr />
          <div>Note: The results from first round will carry over to the second round.</div>
        </Ready> :
        <Ready on={[players, tournament]}>
          {tournament.groups
            ? standing.map((s, i) =>
              <div class="pt8" key={i}>
                <div class="pv8 fs24 darkgreen">Group {s && s.length > 0 && s[0].group}</div>
                {table(i + 1, s, isMobile, true)}
              </div>
            )
            : table('', standing, isMobile)
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
