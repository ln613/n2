import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { productsSelector } from 'utils/selectors';
import { cdurl, withLoad, findById } from 'utils';
import { withMobile } from 'utils/comps';
import CatMenu from './CatMenu';

const brands = ['729', 'addidas', 'andro', 'asics', 'avalox', 'butterfly', 'cornilleau', 'darker', 'dawei', 'dhs', 'donic', 'Dr.Neubauer', 'gewo', 'haifu', 'joola', 'kokutaku', 'ktl', 'li-ning', 'Mizuno', 'nittaku', 'palio', 'stiga', 'sword', 'tibhar', 'tsp', 'victas', 'xiom', 'yasaka', 'yinhe'];

const Shop = ({ isMobile }) =>
  <div class="p16 fv">
    <h1>Shop - Coming Soon</h1>
    <hr />
    <h2>We are the official dealer of Butterfly and Joola, and we carry the following brands.</h2>
    <h2>我们是 Butterfly 和 Joola 加拿大总代理。我们也代理以下品牌.</h2>
    {isMobile ? <div class="tac pv8">{brands.map(c1)}</div> : <div class={`fw pb16 ${isMobile ? '' : 'ph8'}`}>{brands.map(b => <div class="f w20 p8">{c1(b)}</div>)}</div>}
  </div>

export default withMobile(Shop);

const c1 = b => <div><img src={'/images/brands/' + b + '.jpg'} /></div>;