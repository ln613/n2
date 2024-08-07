import React from 'react'
import { connect } from '@ln613/state'
import { compose } from 'recompose'
import { lookupSelector } from 'utils/selectors'
import { cdurl } from 'utils'
import { withMobile } from '@ln613/ui/semantic'

const brands = [
  '729',
  'addidas',
  'andro',
  'asics',
  'avalox',
  'butterfly',
  'cornilleau',
  'darker',
  'dawei',
  'dhs',
  'donic',
  'Dr.Neubauer',
  'gewo',
  'haifu',
  'joola',
  'kokutaku',
  'ktl',
  'li-ning',
  'Mizuno',
  'nittaku',
  'palio',
  'stiga',
  'sword',
  'tibhar',
  'tsp',
  'victas',
  'xiom',
  'yasaka',
  'yinhe',
]
const imgs = [2, 3, 4]

const Shop = ({ isMobile, lookup }) => (
  <div className="p16 fv">
    <h1>Shop</h1>
    <hr />
    <h2>
      We are the official dealer of Butterfly and Joola, and we carry the
      following brands.
    </h2>
    <h2>我们是 Butterfly 和 Joola 加拿大总代理。我们也代理以下品牌.</h2>
    {isMobile ? (
      <div className="tac pv8">{brands.map(c1)}</div>
    ) : (
      <div className={`fw pb16 ${isMobile ? '' : 'ph8'}`}>
        {brands.map(b => (
          <div className="f w20 p8">{c1(b)}</div>
        ))}
      </div>
    )}
    <hr />
    <h2>本月特价 On Sale</h2>
    {isMobile ? (
      <div className="tac pv8">{imgs.map(n => c2(lookup, n))}</div>
    ) : (
      <div className={`fw pb16 ${isMobile ? '' : 'ph8'}`}>
        {imgs.map(n => (
          <div className="f w20 p8">{c2(lookup, n)}</div>
        ))}
      </div>
    )}
    <hr />
    <h2>Online shopping coming soon</h2>
  </div>
)

export default compose(connect(lookupSelector), withMobile)(Shop)

const c1 = b => (
  <div>
    <img src={'/images/brands/' + b + '.jpg'} alt="" />
  </div>
)
const c2 = (l, n) => (
  <div>
    <img className="w100" src={cdurl(l, 'slider-5', n)} alt="" />
  </div>
)
