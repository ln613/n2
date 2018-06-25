import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { cdurl, withLoad } from 'utils';
import actions from 'utils/actions';
import { lookupSelector } from 'utils/selectors';
import { range } from 'ramda';

const s = { position: 'absolute', height: '150px', width: '10%' };
const s1 = { ...s, left: 0, background: 'linear-gradient(to left, rgba(42, 27, 112,0) 20%, rgba(42, 27, 112,1) 100%)' };
const s2 = { ...s, right: 0, background: 'linear-gradient(to right, rgba(42, 27, 112, 0) 20%, rgba(42, 27, 112, 1) 100%)' };
const n = 9;
const r1 = range(1, n + 1);
const r2 = r1.concat(r1);

const Header = ({ lookup }) =>
  <div class="bgb f">  
    <img src="images/banner.jpg" alt="" />
    <div class="fg1 ph8 f marquee">
      <div class="f aic m1">
        {r2.map(x =>
          <Link to="/">
            <img width="130" height="130" src={cdurl(lookup, 'header', x)} alt="" />  
          </Link>
        )}
      </div>
      <div style={s1}></div>
      <div style={s2}></div>
    </div>  
  </div>  

export default compose(
  connect(lookupSelector, actions),
  withLoad('lookup')
)(Header);