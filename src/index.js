import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider, createStore } from '@ln613/state';
import { actionData } from 'utils/actions';
import 'semantic-ui-css/semantic.min.js';
import 'semantic-ui-css/semantic.min.css';
import '@ln613/css';
import 'css/styles.css';
import App from './components/App';
//import { init } from 'fiona';

const store = createStore(actionData);

//init({ store });

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
