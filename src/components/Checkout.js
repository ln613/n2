
import React from 'react';
import { cdurl } from 'utils';
import CatMenu from './CatMenu';
import { compose, withEffect } from 'hookompose';
//import 'products.bundle';

const Checkout = ({ lookup, n, d, history }) =>
  <div class="p16 f">
    <div class="fv pl32 w90">
      <h1>Checkout</h1>
    </div>
  </div>

export default compose(
)(Checkout)