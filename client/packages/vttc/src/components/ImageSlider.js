import React from 'react';
import { connect } from '@ln613/state';
import { withState, lifecycle, compose } from 'recompose';
import { cdurl } from 'utils';
import { range, isNil } from 'ramda';
import actions from 'utils/actions';
import { lookupSelector } from 'utils/selectors';

const sl = n => 'slider' + (isNil(n) ? '' : ('-' + n));

const ImageList = ({ n, f, name, index, lookup }) =>
  <div class="pr">
    <img src={cdurl(lookup, sl(f), 1)} class="op0 w100" alt="" />
    {range(0, n).map((x, i) =>
      <img src={cdurl(lookup, sl(f), i + 1)} class={`fade ${index === i ? 'show' : ''}`} alt="" />
    )}
  </div>

const setIndex = p => setTimeout(() => p.setIndex(p.index === p.n - 1 ? 0 : p.index + 1), Math.random() * 2000 + 2000);

export default compose(
  withState('index', 'setIndex', 0),
  lifecycle({
    componentDidMount() {
      setIndex(this.props);
    },
  
    componentWillReceiveProps(p) {
      setIndex(p);
    }
  }),
  connect(lookupSelector, actions)
)(ImageList);
