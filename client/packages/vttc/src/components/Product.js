import React from 'react';
import { connect } from '@ln613/state';
import { compose } from 'recompose';
import actions from 'utils/actions';
import { productsSelector } from 'utils/selectors';
import { cdurl } from 'utils';
import { withLang, withEdit } from '@ln613/compose';
import CatMenu from './CatMenu';

const Product = ({ product, lookup, n, d }) =>
  <div class="p16 f">
    <CatMenu />
    <div class="pl32 w90">
      <h1>{n(product)}</h1>
      <div class="ui divider"></div>
      <div class="f w100">
        <img src={cdurl(lookup, 'products', product.id)} alt="" />
        <div class="fv">
          <div>{d(product)}</div>
          <br/>
          <div class={`fs24 blue ${product.sale ? 'tdlt' : ''}`}>${product.price}</div>
          <br/>
          <div class="fs24 red">{product.sale && '$' + product.sale}</div>
        </div>
      </div>
    </div>
  </div>

export default compose(
  connect(productsSelector, actions),
  withEdit('product'),
  withLang
)(Product);
