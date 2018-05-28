import React from 'react';
import { compose } from 'recompose';
import { pick } from 'ramda';
import { connect } from 'no-redux';
import actions from 'utils/actions';
import { withLoad, tap } from 'utils';
import { productsSelector } from 'utils/selectors';
import { Table } from 'utils/comps';
import { withRouter } from "react-router-dom";
import { Button } from 'semantic-ui-react';

const Products = ({ products, history }) =>
  <div>
    <div class="f">
      <h1 class="fg1">Products</h1>
      <Button primary onClick={() => history.push('/products/0')}>Add</Button>
    </div>
    <hr/>
    <Table name="products" link data={products.map(x => ({ 'id': x.id, 'name': x.name, 'name_ch': x.name_ch, 'cat': x.cat_name, 'cat1': x.cat1_name, 'price': x.price, 'sale': x.sale, 'desc': x.desc }))} />
  </div>

export default compose(
  connect(productsSelector, actions),
  withLoad('cats'),
  withLoad('products'),
  withRouter
)(Products)