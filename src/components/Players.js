import React from 'react'
import { connect } from '@ln613/state'
import { compose } from 'recompose'
import actions from 'utils/actions'
import { playersSelector } from 'utils/selectors'
import { cdurl } from 'utils'
import { withLoad, withLang } from '@ln613/compose'
import { TextBox } from '@ln613/ui/semantic'

const s1 = s => ({
  width: '130px',
  height: '130px',
  marginRight: '16px',
  //borderRadius: '500rem',
  background: `url(/images/${
    s === 'M' ? 'male' : 'female'
  }.png) no-repeat scroll 0 0`,
})

const Players = ({ lookup, players }) => (
  <div className="p16 fv">
    <div className="ph16">
      <div className="f">
        <h1 className="fg1">Players</h1>
        <TextBox name="player" placeholder="Search player..." />
      </div>
      <div className="ui divider"></div>
    </div>
    <div className="fw w100">
      {players.map((x, i) => (
        <div className="f w50 p16">
          <div className="card w100 f p16">
            <img
              src={cdurl(lookup, 'players', x.id)}
              style={s1(x.sex)}
              alt=""
            />
            <div className="fv">
              <div className="fw8">
                {x.firstName} {x.lastName}
              </div>
              <div>Rating: {x.rating}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default compose(
  connect(playersSelector, actions),
  withLoad('players'),
  withLang
)(Players)
