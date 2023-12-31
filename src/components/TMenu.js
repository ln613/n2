import React from 'react'
import { Link } from 'react-router-dom'

const TMenu = ({ id, isSingle, isGroup, isMobile, page }) => (
  <div className={`ui ${isMobile ? 'four item' : 'vertical'} menu`}>
    <Link
      className={`item ${page === 'tournament' ? 'active' : ''}`}
      to={'/tournaments/' + id}
    >
      {isSingle ? 'Players' : isGroup ? 'Groups' : 'Teams'}
    </Link>
    <Link
      className={`item ${page === 'schedule' ? 'active' : ''}`}
      to={'/schedule/' + id}
    >
      Schedule
    </Link>
    <Link
      className={`item ${page === 'standing' ? 'active' : ''}`}
      to={'/standing/' + id}
    >
      Standing
    </Link>
    <Link
      className={`item ${page === 'stats' ? 'active' : ''}`}
      to={'/stats/' + id}
    >
      Stats
    </Link>
  </div>
)

export default TMenu
