import React from 'react';
import { Link } from 'react-router-dom';

export default () =>
  <div class="ui vertical menu">
    <div class="item">
      <Link class="header cp" to="/">Home</Link>
    </div>
    <div class="item">
      <Link class="header cp" to="/cats">Categories</Link>
    </div>
    <div class="item">
      <Link class="header cp" to="/products">Products</Link>
    </div>
    <div class="item">
      <Link class="header cp" to="/players">Players</Link>
    </div>
    <div class="item">
      <Link class="header cp" to="/tournaments">Tournaments</Link>
    </div>
  </div>
