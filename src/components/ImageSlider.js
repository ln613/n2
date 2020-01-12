import React from 'react';
import { connect } from '@ln613/state';
import { withState, lifecycle, compose } from 'recompose';
import { cdurl } from 'utils';
import { range, isNil } from 'ramda';
import actions from 'utils/actions';
import { lookupSelector } from 'utils/selectors';

const sl = n => 'slider' + (isNil(n) ? '' : ('-' + n));

const ImageList = ({ n, f, name, index, lookup, filter, fitHeight }) =>
  <div class="pr">
    <img src={cdurl(lookup, sl(f), 1, filter)} class={`op0 ${fitHeight ? 'fitHeight' : 'w100'}`} alt="" />
    {range(0, n).map((x, i) =>
      <img src={cdurl(lookup, sl(f), i + 1, filter)} class={`fade ${index === i ? 'show' : ''} ${fitHeight ? 'fitHeight' : 'w100'}`} alt="" />
    )}
  </div>

const setIndex = p => setTimeout(() => p.setIndex(p.index === p.n - 1 ? 0 : p.index + 1), Math.random() * (p.t || 2) * 1000 + (p.t || 2) * 1000);

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
