import React from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { connect } from '@ln613/state';
import actions from 'utils/actions';
import { withSuccess } from 'utils';

const AdminMenu = p =>
  <div class="ui vertical menu">
    <div class="item">
      <Link class="header cp" to="/admin">Home</Link>
    </div>
    <div class="item">
      <Link class="header cp" to="/admin/cats">Categories</Link>
    </div>
    <div class="item">
      <Link class="header cp" to="/admin/products">Products</Link>
    </div>
    <div class="item">
      <Link class="header cp" to="/admin/players">Players</Link>
    </div>
    <div class="item">
      <Link class="header cp" to="/admin/tournaments">Tournaments</Link>
    </div>
    <div class="item">
      <Button primary onClick={() => p.patchUpdateRating()}>Update Ratings</Button>
    </div>
  </div>

export default compose(
  connect(null, actions),
  withSuccess('updaterating', () => alert('Ratings updated'), () => alert('Error happened!'))
)(AdminMenu);