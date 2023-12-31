import React from 'react'
import actions from 'utils/actions'
import { connect } from '@ln613/state'

const Header = ({ postLogout }) => (
  <div className="f jcsb">
    <h1>VTTC Admin</h1>
    <a className="cp" onClick={postLogout} href>
      Log out
    </a>
  </div>
)

export default connect(null, actions)(Header)
