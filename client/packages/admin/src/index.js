import React from 'react';
import { render } from 'react-dom';
import { Provider, createStore } from '@ln613/state';
import { BrowserRouter } from 'react-router-dom';
import { actionData } from 'utils/actions';
import App from 'components/App';
import 'semantic-ui/dist/semantic.min.js';
import 'semantic-ui-css/semantic.min.css';
import '@ln613/css';
import 'utils/css/styles.css';

render(
  <Provider store={createStore(actionData)}>
    <BrowserRouter basename="/admin">
      <App />
    </BrowserRouter>  
  </Provider>,
  document.getElementById('root')
);
