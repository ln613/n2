import React from 'react'
import { connect } from '@ln613/state'
import { withState, lifecycle, compose } from 'recompose'
import { cdurl } from 'utils'
import { range, isNil } from 'ramda'
import actions from 'utils/actions'
import { lookupSelector } from 'utils/selectors'

const sl = n => 'slider' + (isNil(n) ? '' : '-' + n)

const ImageList = ({ n, f, name, index, lookup, filter, fitHeight }) => (
  <div className="pr">
    <a
      href={cdurl(lookup, sl(f), index + 1, filter)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={cdurl(lookup, sl(f), 1, filter)}
        className={`op0 ${fitHeight ? 'fitHeight' : 'w100'}`}
        alt=""
      />
      {range(0, n).map((x, i) => (
        <img
          key={i}
          src={cdurl(lookup, sl(f), i + 1, filter)}
          className={`fade ${index === i ? 'show' : ''} ${
            fitHeight ? 'fitHeight' : 'w100'
          }`}
          alt=""
        />
      ))}
    </a>
  </div>
)

const setIndex = p =>
  setTimeout(
    () => p.setIndex(p.index === p.n - 1 ? 0 : p.index + 1),
    Math.random() * (p.t || 2) * 1000 + (p.t || 2) * 1000
  )

export default compose(
  withState('index', 'setIndex', 0),
  lifecycle({
    componentDidMount() {
      setIndex(this.props)
    },

    UNSAFE_componentWillReceiveProps(p) {
      setIndex(p)
    },
  }),
  connect(lookupSelector, actions)
)(ImageList)
