import React from 'react';
import actions from 'utils/actions';
import { connect } from '@ln613/state';
import { compose } from 'recompose';
import { withLoad } from '@ln613/compose';
import { lookupSelector } from 'utils/selectors';

const Home = () =>
  <div>
  </div>

export default compose(
  connect(lookupSelector, actions),
  withLoad('getLookup')
)(Home)