import React from 'react';
import { Link } from 'react-router-dom';

const TMenu = ({ id, isSingle, isMobile, page }) =>
  <div class={`ui ${isMobile ? 'four item' : 'vertical'} menu`}>
    <Link class={`item ${page === 'tournament' ? 'active' : ''}`} to={'/tournaments/' + id}>{isSingle ? 'Players' : 'Teams'}</Link>
    <Link class={`item ${page === 'schedule' ? 'active' : ''}`} to={'/schedule/' + id}>Schedule</Link>
    <Link class={`item ${page === 'standing' ? 'active' : ''}`} to={'/standing/' + id}>Standing</Link>
    <Link class={`item ${page === 'stats' ? 'active' : ''}`} to={'/stats/' + id}>Stats</Link>
  </div>

export default TMenu;