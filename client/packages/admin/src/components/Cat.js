import React from 'react';
import { compose } from 'recompose';
import { connect } from 'no-redux';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { catsSelector } from 'utils/selectors';
import { TextBox } from 'utils/comps';
import { withEdit, withSuccess } from 'utils';

const Cat = ({ cat, putCat, postCat }) =>
  <div>
    <h1>Category - {+cat.id ? cat.name : 'Add New'}</h1>
    <hr />
    <TextBox name="cat.id" disabled />
    <TextBox name="cat.name" />
    <TextBox name="cat.name_ch" />
    <hr />
    <Button primary onClick={() => +cat.id ? putCat(cat) : postCat(cat)}>Save</Button>
  </div>

export default compose(
  connect(catsSelector, actions),
  withEdit('cat'),
  withSuccess('cat', () => alert('Saved'), () => alert('Error happened!'))
)(Cat)