import React from 'react';
import { compose } from 'recompose';
import { connect } from '@ln613/state';
import actions from 'utils/actions';
import { withLoad, withNewId } from '@ln613/compose';
import { productsSelector } from 'utils/selectors';
import { Table } from '@ln613/ui/semantic';
import { withRouter } from "react-router-dom";
import { Button } from 'semantic-ui-react';

const Products = ({ products, history, newId }) =>
  <div>
    <div class="f">
      <h1 class="fg1">Products</h1>
      <Button primary onClick={() => history.push(`/admin/products/${newId}`)}>Add</Button>
    </div>
    <hr/>
    <Table name="products" link={x => `/admin/products/${x.id}`} data={products.map(x => ({ 'id': x.id, 'name': x.name, 'name_ch': x.name_ch, 'cat': x.cat_name, 'cat1': x.cat1_name, 'price': x.price, 'sale': x.sale, 'desc': x.desc }))} />
  </div>

export default compose(
  connect(productsSelector, actions),
  withLoad('cats'),
  withLoad('products'),
  withNewId('products'),
  withRouter
)(Products)