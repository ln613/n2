import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { standingSelector } from 'utils/selectors';
import { withLoad, withParams } from 'utils';
import { Table, withMobile } from 'utils/comps';
import TMenu from './TMenu';

const Standing = ({ standing, tournament, id, isMobile }) =>
  <div class={`p16 ${isMobile ? 'fv' : 'f'}`}>
    <TMenu id={id} isSingle={tournament.isSingle} isMobile={isMobile} page="standing" />
    <div class={`${isMobile ? '' : 'ph32'} fv`}>
      <h1>{tournament.name}</h1>
      <hr/>
      <Table name="standing" data={standing}>
      </Table>
    </div>
  </div>

export default compose(
  connect(standingSelector, actions),
  withParams,
  withLoad('tournament', 'id'),
  withMobile
)(Standing);
