import React from 'react'
import { connect } from '@ln613/state'
import { compose } from 'recompose'
import actions from 'utils/actions'
import { productsSelector } from 'utils/selectors'
import { cdurl, findById } from 'utils'
import { withLoad, withLang } from '@ln613/compose'
import CatMenu from './CatMenu'
import { withRouter } from 'react-router-dom'

const Products = ({ products, productFilter, lookup, n, d, history }) => (
  <div className="p16 f">
    <CatMenu />
    <div className="pl32 w90">
      <h1>{header(lookup.cats, productFilter, n)}</h1>
      <div className="ui divider"></div>
      <div className="fw w100">
        {products.map((x, i) => (
          <div className="f w20 p8">
            <div
              className="card fv cp"
              onClick={() => history.push('/products/' + x.id)}
            >
              <img
                className="w100"
                src={cdurl(lookup, 'products', x.id)}
                alt=""
              />
              <hr />
              <div className="p8 fg1">
                <h3>{n(x)}</h3>
                <div>{d(x)}</div>
              </div>
              <hr className="w100" />
              <div className="f p8">
                <div className={`fs24 blue ${x.sale ? 'tdlt' : ''}`}>
                  ${x.price}
                </div>
                <div className="fs24 red pl8">{x.sale && '$' + x.sale}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default compose(
  connect(productsSelector, actions),
  withLoad('products'),
  withLang,
  withRouter
)(Products)

const header = (l, f, n) => {
  if (!f.cat) return l && l.length > 0 ? n(l[0]) : ''
  const c = findById(f.cat)(l)
  const c1 = findById(f.cat1)(c.subs)
  return n(c) + (c1 ? ' - ' + n(c1) : '')
}
