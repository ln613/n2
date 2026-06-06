import React from 'react'
import { Switch, Route } from 'react-router'
import { Link } from 'react-router-dom'
import { Mobile, Desktop, withMobile } from '@ln613/ui/semantic'
import { Menu as SMenu, Sidebar } from 'semantic-ui-react'
import { withState } from '@ln613/compose'
import { compose } from 'recompose'
import { withAuth } from 'utils/ui'

import Header from './Header'
import Home from './Home'
import Checkout from './Checkout'
import Products from './Products'
import Product from './Product'
import Players from './Players'
import Tournaments from './Tournaments'
import Tournament from './Tournament'
import Rating from './Rating'
import History from './History'
import Schedule from './Schedule'
import Standing from './Standing'
import Stats from './Stats'
import Contact from './Contact'
import Intro from './Intro'
import Shop from './Shop'
import Training from './Training'
import LinkPage from './Link'
import Games from './Games'
import Calendar from './Calendar'

import AdminMenu from '../admin/Menu'
import AdminCats from '../admin/Cats'
import AdminCat from '../admin/Cat'
import AdminConvert from '../admin/Convert'
import AdminProducts from '../admin/Products'
import AdminProduct from '../admin/Product'
import AdminTournaments from '../admin/Tournaments'
import AdminTournament from '../admin/Tournament'
import AdminPlayers from '../admin/Players'
import AdminPlayer from '../admin/Player'
import AdminTeams from '../admin/Teams'
import AdminTeam from '../admin/Team'
import AdminSinglePlayers from '../admin/SinglePlayers'
import AdminSchedules from '../admin/Schedules'
import AdminSchedule from '../admin/Schedule'
import AdminGames from '../admin/Games'
import AdminGame from '../admin/Game'
import AdminHeader from '../admin/Header'

const menus = [
  'Home',
  'Intro',
  'Shop',
  'Tournaments',
  'Rating',
  'Calendar',
  'Links',
  'Contact',
]

const LIVE_URL = 'https://vttc-live.netlify.app'

const LiveButton = () => (
  <SMenu.Item
    as="a"
    href={LIVE_URL}
    target="_blank"
    rel="noopener noreferrer"
    style={{ padding: '8px 12px' }}
  >
    <div className="live-btn">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: '6px', verticalAlign: 'middle' }}
      >
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" style={{ display: 'none' }} />
        <circle cx="12" cy="12" r="3" fill="white" />
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
        <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
      </svg>
      <span>LIVE</span>
    </div>
  </SMenu.Item>
)

const menuItems = (ms, setVisible) =>
  ms.map((x, i) => (
    <Link
      to={'/' + (i === 0 ? '' : x)}
      onClick={() => setVisible(false)}
      key={i}
    >
      <SMenu.Item name={x} style={{ fontWeight: 'bold' }} />
    </Link>
  ))

const rightItems = (
  <SMenu.Item
    onClick={() => window.open('https://butterflyonline.com/', '_new')}
  >
    <img src="/images/butterfly-logo.png" title="Butterfly" alt="" />
  </SMenu.Item>
)

const MainMenu1 = ({ children, visible, setVisible }) => (
  <div>
    <Mobile>
      <Sidebar.Pushable>
        <Sidebar
          as={SMenu}
          animation="overlay"
          icon="labeled"
          inverted
          vertical
          visible={visible}
          color="blue"
        >
          {menuItems(menus, setVisible)}
        </Sidebar>
        <Sidebar.Pusher
          dimmed={visible}
          onClick={() => visible && setVisible(false)}
          style={{ minHeight: '100vh' }}
        >
          <SMenu inverted color="blue" style={{ margin: 0 }}>
            <SMenu.Item
              onClick={() => setVisible(!visible)}
              icon="sidebar"
            />
            <LiveButton />
            <SMenu.Menu position="right">{rightItems}</SMenu.Menu>
          </SMenu>
          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Mobile>
    <Desktop>
      <SMenu inverted color="blue" style={{ margin: 0 }}>
        <LiveButton />
        {menuItems(menus, setVisible)}
        <SMenu.Menu position="right">{rightItems}</SMenu.Menu>
      </SMenu>
      {children}
    </Desktop>
  </div>
)

const MainMenu = compose(withState('visible'))(MainMenu1)

const Content = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/contact" component={Contact} />
    <Route path="/intro" component={Intro} />
    <Route path="/shop" component={Shop} />
    <Route path="/training" component={Training} />
    <Route path="/links" component={LinkPage} />
    <Route path="/calendar" component={Calendar} />
    <Route exact path="/checkout" component={Checkout} />
    <Route exact path="/products" component={Products} />
    <Route path="/products/:id" component={Product} />
    <Route exact path="/players" component={Players} />
    <Route exact path="/tournaments" component={Tournaments} />
    <Route path="/tournaments/:id" component={Tournament} />
    <Route exact path="/rating" component={Rating} />
    <Route path="/rating/:id" component={History} />
    <Route path="/schedule/:id" component={Schedule} />
    <Route path="/standing/:id" component={Standing} />
    <Route path="/stats/:id" component={Stats} />
    <Route path="/games/:T/:S/:M" component={Games} />
  </Switch>
)

const Footer = () => (
  <div>
    <div className="ui divider"></div>
    <div className="ph16 pb16">© 2018 vttc.ca. All Rights Reserved.</div>
  </div>
)

const AdminContent = () => (
  <Switch>
    <Route exact path="/admin" component={AdminTournaments} />
    <Route exact path="/admin/convert" component={AdminConvert} />
    <Route exact path="/admin/cats" component={AdminCats} />
    <Route path="/admin/cats/:id" component={AdminCat} />
    <Route exact path="/admin/products" component={AdminProducts} />
    <Route path="/admin/products/:id" component={AdminProduct} />
    <Route exact path="/admin/tournaments" component={AdminTournaments} />
    <Route path="/admin/tournaments/:id" component={AdminTournament} />
    <Route exact path="/admin/players" component={AdminPlayers} />
    <Route path="/admin/players/:id" component={AdminPlayer} />
    <Route path="/admin/teams/:id" component={AdminTeams} />
    <Route path="/admin/team/:id1/:id" component={AdminTeam} />
    <Route path="/admin/singleplayers/:id" component={AdminSinglePlayers} />
    <Route path="/admin/schedules/:id" component={AdminSchedules} />
    <Route path="/admin/schedule/:id1/:id" component={AdminSchedule} />
    <Route path="/admin/games/:T/:S?/:M?" component={AdminGames} />
    <Route path="/admin/game/:T/:S/:M/:id" component={AdminGame} />
  </Switch>
)

const AdminMainMenu = withMobile(({ isMobile }) => (
  <div className={isMobile ? 'fv' : 'f'}>
    <AdminMenu />
    {isMobile ? <hr /> : null}
    <div className={isMobile ? '' : 'ph16'}>
      <AdminContent />
    </div>
  </div>
))

const Vttc = () => (
  <div className="ui">
    <Header />
    <MainMenu>
      <Content />
      <Footer />
    </MainMenu>
  </div>
)

const Admin = () => (
  <div className="p16">
    <AdminHeader />
    <hr />
    <AdminMainMenu />
  </div>
)

const App = () => (
  <Switch>
    <Route path="/admin" component={withAuth(Admin)} />
    <Route component={Vttc} />
  </Switch>
)

export default App
