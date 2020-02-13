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
    <div class="fv pl32 w90">
      <div name="Products">
        <div class="f">
          <div class="fv fg1">
            <h1>Products</h1>
            <div class="f mrc8">
              <div>Sort:</div>
              <a href="#" name="sort_price_up">Price low to high</a>
              <a href="#" name="sort_price_down">Price high to low</a>
              <a href="#" name="sort_name_up">Name A-Z</a>
              <a href="#" name="sort_name_down">Name Z-A</a>
            </div>
          </div>
          <div class="pr">
            <i aria-hidden="true" class="darkgreen cart link big icon pt8" name="view_cart"></i>
            <div class="floating ui red label" style={{ borderRadius: '50%', top: '-8px' }}>
              <span class="fs15" name="cart_count">0</span>
            </div>
          </div>
        </div>
        <div class="ui divider"></div>
        <div class="fw w100" name="products">
          <div class="f w20 p8">  
            <div class="card fv">
              <img class="w100" alt="" name="image"/>
              <hr />
              <div class="p8 fg1">
                <h3 name="name">Tenergy 5</h3>
                <div name="description">abc</div>
              </div>
              <hr class="w100" />
              <div class="f p8">
                <div class="fs24 blue" name="price">$100</div>
                {/* <div class="fs24 red pl8" name="sale">$80</div> */}
                <div class="fg1"></div>
                <div class="pr cp" name="add_to_cart">
                  <i aria-hidden="true" class="cart link large icon"></i>
                  <div class="floating ui green label" style={{ borderRadius: '50%', top: '-10px', padding: '1px 5px 3px 5px' }}>
                    <span class="fs15">+</span>
                  </div>
                </div>
                <div class="pr cp" name="remove_from_cart" style={{display: 'none'}}>
                  <i aria-hidden="true" class="cart link large icon"></i>
                  <div class="floating ui red label" style={{ borderRadius: '50%', top: '-10px', padding: '1px 7px 3.5px 7px' }}>
                    <span class="fs15">-</span>
                  </div>
                </div>
              </div>  
            </div>
          </div>  
        </div>
      </div>
      <div name="Cart" style={{display: 'none'}}>
        <div class="f">
          <h1 class="fg1">Cart</h1>
          <i aria-hidden="true" class="darkgreen grid layout link big icon" name="view_products"></i>
        </div>
        <div class="f w100">
          <div class="fv mbc16" name="cart">
            <div class="card f" name="product">
              <img class="w10" alt="" name="image"/>
              <div class="w40 p8 fv">
                <h3 name="name">Tenergy 5</h3>
                <div name="description">abc</div>
              </div>
              <div class="f p8">
                <div class="fs24 blue" name="price">$100</div>
                {/* <div class="fs24 red pl8" name="sale">$80</div> */}
              </div>  
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pl32">
      <div class="fv ui menu p16">
        <h4 name="name">Total: <span name="sub_total">$1</span></h4>
        <button class="ui button orange">Proceed to Checkout</button>
      </div>
    </div>
  </div>

export default compose(
  withEffect(() => console.log('m - p'))
)(Products)