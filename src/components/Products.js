import React from 'react'
import { compose } from 'hookompose'
//import { compose } from 'recompose';
//import 'products.bundle';
//import { read, withRules } from 'fiona';

const Products = p => (
  <div className="p16 f">
    {/* <CatMenu /> */}
    <div className="ui vertical menu" name="categories">
      <div>
        <div className="item">
          <a className="header cp" name="name" href>
            Cat
          </a>
          <div className="menu" name="sub_categories">
            <div>
              <a className="item" name="name" href>
                SubCat
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="fv pl32 w90">
      <div name="Products">
        <div className="f">
          <div className="fv fg1">
            <h1>Products - {p.state.tournaments.length}</h1>
            <div className="f mrc8">
              <div>Sort:</div>
              <a href name="sort_price_up">
                Price low to high
              </a>
              <a href name="sort_price_down">
                Price high to low
              </a>
              <a href name="sort_name_up">
                Name A-Z
              </a>
              <a href name="sort_name_down">
                Name Z-A
              </a>
            </div>
          </div>
          <div className="pr">
            <i
              aria-hidden="true"
              className="darkgreen cart link big icon pt8"
              name="view_cart"
            ></i>
            <div
              className="floating ui red label"
              style={{ borderRadius: '50%', top: '-8px' }}
            >
              <span className="fs15" name="cart_count">
                0
              </span>
            </div>
          </div>
        </div>
        <div className="ui divider"></div>
        <div className="fw w100" name="products">
          <div className="f w20 p8">
            <div className="card fv">
              <img className="w100" alt="" name="image" />
              <hr />
              <div className="p8 fg1">
                <h3 name="name">Tenergy 5</h3>
                <div name="description">abc</div>
              </div>
              <hr className="w100" />
              <div className="f p8">
                <div className="fs24 blue" name="price">
                  $100
                </div>
                {/* <div className="fs24 red pl8" name="sale">$80</div> */}
                <div className="fg1"></div>
                <div className="pr cp" name="add_to_cart">
                  <i aria-hidden="true" className="cart link large icon"></i>
                  <div
                    className="floating ui green label"
                    style={{
                      borderRadius: '50%',
                      top: '-10px',
                      padding: '1px 5px 3px 5px',
                    }}
                  >
                    <span className="fs15">+</span>
                  </div>
                </div>
                <div
                  className="pr cp"
                  name="remove_from_cart"
                  style={{ display: 'none' }}
                >
                  <i aria-hidden="true" className="cart link large icon"></i>
                  <div
                    className="floating ui red label"
                    style={{
                      borderRadius: '50%',
                      top: '-10px',
                      padding: '1px 7px 3.5px 7px',
                    }}
                  >
                    <span className="fs15">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div name="Cart" style={{ display: 'none' }}>
        <div className="f">
          <h1 className="fg1">Cart</h1>
          <i
            aria-hidden="true"
            className="darkgreen grid layout link big icon"
            name="view_products"
          ></i>
        </div>
        <div className="f w100">
          <div className="fv mbc16" name="cart">
            <div className="card f" name="product">
              <img className="w10" alt="" name="image" />
              <div className="w40 p8 fv">
                <h3 name="name">Tenergy 5</h3>
                <div name="description">abc</div>
              </div>
              <div className="f p8">
                <div className="fs24 blue" name="price">
                  $100
                </div>
                {/* <div className="fs24 red pl8" name="sale">$80</div> */}
              </div>
              <div>
                <button className="ui button red" name="remove_from_cart">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="pl32">
      <div className="fv ui menu p16">
        <h4 name="name">
          Total: <span name="sub_total">$1</span>
        </h4>
        <button className="ui button orange">Proceed to Checkout</button>
      </div>
    </div>
  </div>
)

export default compose()(Products)
//withEffect(() => console.log(read())),
//withRules([], { isLoading: null })
