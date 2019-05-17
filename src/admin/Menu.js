import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { connect } from '@ln613/state';
import actions from 'utils/actions';
import { withSuccess } from 'utils/ui';
import { withMobile } from '@ln613/ui/semantic';

const AdminMenu = p =>
  <Fragment>
    <div class={`ui top attached ${p.isMobile ? 'three item' : 'vertical'} menu`}>
      <Link class="item" to="/admin">Home</Link>
      <Link class="item" to="/admin/convert">Convert</Link>
      <Link class="item" to="/admin/products">Products</Link>
    </div>
    <div class={`ui bottom attached ${p.isMobile ? 'three item' : 'vertical'} menu`}>
      <Link class="item" onClick={() => p.patchUpdateRating()} to="#">Update Ratings</Link>
      <Link class="item" to="/admin/players">Players</Link>
      <Link class="item" to="/admin/tournaments">Tournaments</Link>
    </div>
  </Fragment>

export default compose(
  connect(null, actions),
  withSuccess('updaterating', () => alert('Ratings updated'), () => alert('Error happened!')),
  withMobile
)(AdminMenu);
