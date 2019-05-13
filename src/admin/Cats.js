import React from 'react';
import { compose } from 'recompose';
import { pick } from 'ramda';
import { connect } from '@ln613/state';
import actions from 'utils/actions';
import { withLoad } from '@ln613/compose';
import { catsSelector } from 'utils/selectors';
import { Table } from '@ln613/ui/semantic';
import { Button } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";

const Cats = ({ cats, history }) =>
  <div>
    <div class="f">
      <h1 class="fg1">Categories</h1>
      <Button primary onClick={() => history.push('/admin/cats/0')}>Add</Button>
    </div>
    <hr/>
    <Table name="cats" link={x => `/admin/cats/${x.id}`} data={(cats || []).map(pick(['id', 'name', 'name_ch']))} />

    <form name="f1" method="POST" netlify>
      <input name="n1"/>
      <button type="submit">Send</button>
    </form>
  </div>

export default compose(
  connect(catsSelector, actions),
  withLoad('cats'),
  withRouter
)(Cats)