import React from 'react';
import { connect } from '@ln613/state';
import { compose } from 'recompose';
import { isNil } from 'ramda';
import { successSelector, authSelector } from './selectors';
import actions from './actions';
import { withNewValue, withMount } from '@ln613/compose';
import { TextBox, Password } from '@ln613/ui';
import { Button } from 'semantic-ui-react';
import { tap } from '@ln613/util';

export const withAuth = compose(
  connect(authSelector, actions),
  withMount(p => {
    if (isNil(p.auth.isAuthenticated))
      p.patchAuth();
  }),
  Comp => p => p.auth.isAuthenticated ? <Comp {...p} /> : <Login />
);

const Login = connect(authSelector, actions)(({ login, postAuth }) =>
  <div class="p16">
    Username: <TextBox name="login.username" />
    Password: <Password name="login.password" />
    <hr />
    <Button primary onClick={() => postAuth(login)}>Login</Button>
  </div>
);

export const withSuccess = (a, f1, f2) => compose(
  connect(successSelector(a)),
  withNewValue('success', true, f1),
  withNewValue('success', false, f2),
);
