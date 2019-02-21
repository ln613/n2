import React from 'react';
import actions from 'utils/actions';
import { connect } from '@ln613/state';

const Header = ({ postLogout }) =>
  <div class="f jcsb">
    <h1>VTTC Admin</h1>
    <a class="cp" onClick={postLogout}>Log out</a>
  </div>

export default connect(null, actions)(Header)