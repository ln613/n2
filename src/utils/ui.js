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

export const enlargeCanvas = url => {
  const img = new Image();
  img.onload = () => {
    const w1 = img.width;
    const h1 = img.height;
    const w = 300;
    const h = 100;
    const w2 = (w1 * h) / h1;
    const h2 = h;
    const x2 = (w - w2) / 2;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, x2, 0, w2, h2);
    return canvas.toDataURL();
  }
  img.src = url;
}
