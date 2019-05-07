import React from 'react';
import { compose } from 'recompose';
import { connect } from '@ln613/state';
import { Button } from 'semantic-ui-react';
import actions from 'utils/actions';
import { catsSelector } from 'utils/selectors';
import { TextBox } from '@ln613/ui/semantic';
import { withEdit } from '@ln613/compose';
import { withSuccess } from 'utils/ui';

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