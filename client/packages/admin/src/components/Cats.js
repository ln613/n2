import React from 'react';
import { compose } from 'recompose';
import { pick } from 'ramda';
import { connect } from 'no-redux';
import actions from 'utils/actions';
import { withLoad } from 'utils';
import { catsSelector } from 'utils/selectors';
import { Table } from 'utils/comps';
import { Button } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";

const Cats = ({ cats, history }) =>
  <div>
    <div class="f">
      <h1 class="fg1">Categories</h1>
      <Button primary onClick={() => history.push('/cats/0')}>Add</Button>
    </div>
    <hr/>
    <Table name="cats" isLink data={(cats || []).map(pick(['id', 'name', 'name_ch']))} />
  </div>

export default compose(
  connect(catsSelector, actions),
  withLoad('cats'),
  withRouter
)(Cats)