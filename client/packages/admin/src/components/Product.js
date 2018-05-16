import React from 'react';
import { compose, withProps } from 'recompose';
import { pick, find } from 'ramda';
import { connect } from 'no-redux';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { productsSelector } from 'utils/selectors';
import { Table, TextBox, Select } from 'utils/comps';
import { tap, withLoad, withEdit, cdurl, getPropById } from 'utils';

const Product = ({ product, putProduct, postNewProduct, lookup, cats }) =>
  <div>
    <h1>Product - {product.name}</h1>
    <hr />
    <TextBox name="product.id" disabled />
    <TextBox name="product.name" fluid />
    <TextBox name="product.name_ch" fluid />
    <Select name="product.cat" options={cats} placeholder='Select Category'/>
    <Select name="product.cat1" options={getPropById('subs')(product.cat)(cats)} placeholder='Select Sub Category'/>
    <TextBox name="product.price" />
    <TextBox name="product.sale" />
    <TextBox name="product.desc" fluid />
    <TextBox name="product.desc_ch" fluid />
    <img src={cdurl(lookup, 'products', product.id)} />  
    <hr />
    <Button primary onClick={() => +product.id ? putProduct(product) : postNewProduct(product)}>Save</Button>
  </div>

export default compose(
  connect(productsSelector, actions),
  withLoad('lookup'),
  withEdit('product')
)(Product)