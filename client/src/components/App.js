import React from 'react';
import { Switch, Route } from 'react-router';
import { Menu, withMobile } from '@ln613/ui/semantic';
import { Menu as _Menu } from 'semantic-ui-react';
import { withAuth } from 'utils';

import Header from './Header';
import Home from './Home';
import Products from './Products';
import Product from './Product';
import Players from './Players';
import Tournaments from './Tournaments';
import Tournament from './Tournament';
import Rating from './Rating';
import History from './History';
import Schedule from './Schedule';
import Standing from './Standing';
import Stats from './Stats';
import Contact from './Contact';
import Intro from './Intro';
import Shop from './Shop';
import Training from './Training';
import Link from './Link';
import Games from './Games';
import Calendar from './Calendar';

import AdminMenu from '../admin/Menu';
import AdminHome from '../admin/Home';
import AdminCats from '../admin/Cats';
import AdminCat from '../admin/Cat';
import AdminProducts from '../admin/Products';
import AdminProduct from '../admin/Product';
import AdminTournaments from '../admin/Tournaments';
import AdminTournament from '../admin/Tournament';
import AdminPlayers from '../admin/Players';
import AdminPlayer from '../admin/Player';
import AdminTeams from '../admin/Teams';
import AdminTeam from '../admin/Team';
import AdminSinglePlayers from '../admin/SinglePlayers';
import AdminSchedules from '../admin/Schedules';
import AdminSchedule from '../admin/Schedule';
import AdminGames from '../admin/Games';
import AdminGame from '../admin/Game';
import AdminHeader from '../admin/Header';


const menus = ['Home', 'Intro', 'Shop', 'Tournaments', 'Rating', 'Calendar', 'Links', 'Contact'];

const Content = () =>
  <Switch>
    <Route exact path='/' component={Home} />
    <Route path='/contact' component={Contact} />
    <Route path='/intro' component={Intro} />
    <Route path='/shop' component={Shop} />
    <Route path='/training' component={Training} />
    <Route path='/links' component={Link} />
    <Route path='/calendar' component={Calendar} />
    <Route exact path='/products' component={Products} />
    <Route path='/products/:id' component={Product} />
    <Route exact path='/players' component={Players} />
    <Route exact path='/tournaments' component={Tournaments} />
    <Route path='/tournaments/:id' component={Tournament} />
    <Route exact path='/rating' component={Rating} />
    <Route path='/rating/:id' component={History} />
    <Route path='/schedule/:id' component={Schedule} />
    <Route path='/standing/:id' component={Standing} />
    <Route path='/stats/:id' component={Stats} />
    <Route path='/games/:T/:S/:M' component={Games} />
  </Switch>

const Footer = () =>
  <div>
    <div class="ui divider"></div>
    <div class="ph16 pb16">© 2018 vttc.ca. All Rights Reserved.</div>
  </div>

const MainMenu = () =>
  <Menu menus={menus} color="blue" rightItems={<_Menu.Item onClick={()=> window.open('https://butterflyonline.com/', "_new")}><img src="images/butterfly-logo.png" /></_Menu.Item>}>
    <Content/>
    <Footer/>
  </Menu>

const AdminContent = () =>
  <Switch>
    <Route exact path='/admin' component={AdminTournaments} />
    <Route exact path='/admin/cats' component={AdminCats} />
    <Route path='/admin/cats/:id' component={AdminCat} />
    <Route exact path='/admin/products' component={AdminProducts} />
    <Route path='/admin/products/:id' component={AdminProduct} />
    <Route exact path='/admin/tournaments' component={AdminTournaments} />
    <Route path='/admin/tournaments/:id' component={AdminTournament} />
    <Route exact path='/admin/players' component={AdminPlayers} />
    <Route path='/admin/players/:id' component={AdminPlayer} />
    <Route path='/admin/teams/:id' component={AdminTeams} />
    <Route path='/admin/team/:id1/:id' component={AdminTeam} />
    <Route path='/admin/singleplayers/:id' component={AdminSinglePlayers} />
    <Route path='/admin/schedules/:id' component={AdminSchedules} />
    <Route path='/admin/schedule/:id1/:id' component={AdminSchedule} />
    <Route path='/admin/games/:T/:S?/:M?' component={AdminGames} />
    <Route path='/admin/game/:T/:S/:M/:id' component={AdminGame} />
  </Switch>

const AdminMainMenu = withMobile(({ isMobile }) =>
  <div class={isMobile ? 'fv' : 'f'}>
    <AdminMenu />
    {isMobile ? <hr /> : null}
    <div class={isMobile ? '' : 'ph16'}>
      <AdminContent />
    </div>
  </div>
);

const Vttc = () =>
  <div class="ui">
    <Header />
    <MainMenu />
  </div>

const Admin = () =>
  <div class="p16">
    <AdminHeader />
    <hr/>
    <AdminMainMenu />
  </div>

const App = () =>
  <Switch>
    <Route path='/admin' component={withAuth(Admin)} />
    <Route component={Vttc} />
  </Switch>

export default App;