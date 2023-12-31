import React from 'react'
import { connect } from '@ln613/state'
import { compose } from 'recompose'
import actions from 'utils/actions'
import { lookupSelector } from 'utils/selectors'
import { withLang } from '@ln613/compose'

const CatMenu = ({ lookup, setFilter, n, d }) => (
  <div className="ui vertical menu">
    {(lookup.cats || []).map(x => (
      <div className="item">
        <a
          href
          className="header cp"
          onClick={() => setFilter({ product: { cat: x.id } })}
        >
          {n(x)}
        </a>
        {x.subs ? (
          <div className="menu">
            {x.subs.map(y => (
              <a
                href
                className="item"
                onClick={() =>
                  setFilter({ product: { cat: x.id, cat1: y.id } })
                }
              >
                {n(y)}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    ))}
  </div>
)

export default compose(connect(lookupSelector, actions), withLang)(CatMenu)
