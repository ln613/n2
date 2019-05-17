import React from 'react';
import { isDev } from 'util';

export default () =>
  <form action={isDev ? 'http://localhost:3000' : 'https://4mlzcqfe60.execute-api.us-west-2.amazonaws.com/dev/'} method="post" enctype="multipart/form-data">
    <input type="file" name="f1" />
    <button type="submit">submit</button>
  </form>