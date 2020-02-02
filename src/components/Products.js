import React from 'react';
import { cdurl } from 'utils';
import CatMenu from './CatMenu';
import { compose, withEffect } from 'hookompose';
//import 'products.bundle';

const Products = ({ lookup, n, d, history }) =>
  <div class="p16 f">
    {/* <CatMenu /> */}
    <div class="ui vertical menu" name="categories">
      <div>
      <div class="item">
      <a class="header cp" name="name">Cat</a>
      <div class="menu" name="sub_categories">
        <div>
        <a class="item" name="name">SubCat</a>
        </div>
      </div>
      </div>
      </div>
    </div>
    <div class="pl32 w90">
      <h1>Products</h1>
      <div class="f mrc8">
        <div>Sort:</div>
        <a href="#" name="sort_price_up">Price low to high</a>
        <a href="#" name="sort_price_down">Price high to low</a>
        <a href="#" name="sort_name_up">Name A-Z</a>
        <a href="#" name="sort_name_down">Name Z-A</a>
      </div>
      <div class="ui divider"></div>
      <div class="fw w100" name="products">
        <div class="f w20 p8">  
          <div class="card fv cp">
            <img class="w100" alt="" name="image"/>
            <hr />
            <div class="p8 fg1">
              <h3 name="name">Tenergy 5</h3>
              <div name="description">abc</div>
            </div>
            <hr class="w100" />
            <div class="f p8">
              <div class="fs24 blue" name="price">$100</div>
              <div class="fs24 red pl8" name="sale">$80</div>
            </div>  
          </div>
        </div>  
      </div>
    </div>
  </div>

export default compose(
  withEffect(() => console.log('m - p'))
)(Products)