import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { productsSelector } from 'utils/selectors';
import { cdurl, withLoad, withLang, findById } from 'utils';
import CatMenu from './CatMenu';
import { withRouter } from "react-router-dom";

const Products = ({ products, productFilter, lookup, n, d, history }) =>
  <div class="p16 f">
    <CatMenu />
    <div class="pl32 w90">
      <h1>{header(lookup.cats, productFilter, n)}</h1>
      <div class="ui divider"></div>
      <div class="fw w100">
        {products.map((x, i) =>
          <div class="f w20 p8">  
            <div class="card fv cp" onClick={() => history.push('/products/' + x.id)}>
              <img class="w100" src={cdurl(lookup, 'products', x.id)} alt="" />
              <hr />
              <div class="p8 fg1">
                <h3>{n(x)}</h3>
                <div>{d(x)}</div>
              </div>
              <hr class="w100" />
              <div class="f p8">
                <div class={`fs24 blue ${x.sale ? 'tdlt' : ''}`}>${x.price}</div>
                <div class="fs24 red pl8">{x.sale && '$' + x.sale}</div>
              </div>  
            </div>
          </div>  
        )}  
      </div>
    </div>
  </div>

export default compose(
  connect(productsSelector, actions),
  withLoad('products'),
  withLang,
  withRouter
)(Products);

const header = (l, f, n) => {
    if (!f.cat) return l && l.length > 0 ? n(l[0]) : '';
    const c = findById(f.cat)(l);
    const c1 = findById(f.cat1)(c.subs);
    return n(c) + (c1 ? ' - ' + n(c1) : '');
}