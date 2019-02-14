import React from 'react';
import { Link } from 'react-router-dom';

export default () =>
  <div class="ui vertical menu">
    <div class="item">
      <Link class="header cp" to="/admin">Home</Link>
    </div>
    <div class="item">
      <Link class="header cp" to="/admin/cats">Categories</Link>
    </div>
    <div class="item">
      <Link class="header cp" to="/admin/products">Products</Link>
    </div>
    <div class="item">
      <Link class="header cp" to="/admin/players">Players</Link>
    </div>
    <div class="item">
      <Link class="header cp" to="/admin/tournaments">Tournaments</Link>
    </div>
  </div>
