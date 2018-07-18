import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { cdurl, withLoad, tap } from 'utils';
import actions from 'utils/actions';
import { lookupSelector } from 'utils/selectors';
import { range } from 'ramda';

const s = m => ({ position: 'absolute', height: m ? '100px' : '150px', width: '10%' });
const s1 = m => ({ ...s(m), left: 0, background: 'linear-gradient(to left, rgba(42, 27, 112,0) 20%, rgba(42, 27, 112,1) 100%)' });
const s2 = m => ({ ...s(m), right: 0, background: 'linear-gradient(to right, rgba(42, 27, 112, 0) 20%, rgba(42, 27, 112, 1) 100%)' });
const n = 11;
const r1 = range(1, n + 1);
const r2 = r1.concat(r1);

const Mq = ({ lookup, isMobile }) =>
  <div class="fg1 ph8 f marquee">
    <div class="f aic m1">
      {r2.map(x =>
        <Link to="/">
          <img width={isMobile ? '85' : '130'} height={isMobile ? '85' : '130'} src={cdurl(lookup, 'header', x)} alt="" />  
        </Link>
      )}
    </div>
    <div style={s1(isMobile)}></div>
    <div style={s2(isMobile)}></div>
  </div>  
const Banner = () => <img src="images/banner.jpg" alt="" id="banner" />;

const Header = ({ lookup, isMobile }) =>
  <div class={`bgb ${isMobile ? 'fv' : 'f'}`}>
    <Banner/>
    <Mq lookup={lookup} isMobile={isMobile}/>
  </div>

export default compose(
  connect(lookupSelector, actions),
  withLoad('lookup')
)(Header);