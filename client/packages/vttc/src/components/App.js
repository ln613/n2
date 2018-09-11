import React from 'react';
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
import Calendar from './Calendar';
import { Switch, Route } from 'react-router';
import { Menu } from '@ln613/ui/semantic';

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
  </Switch>

const Footer = () =>
  <div>
    <div class="ui divider"></div>
    <div class="ph16 pb16">© 2018 vttc.ca. All Rights Reserved.</div>
  </div>

const App = p =>
  <div class="ui">
    <Header/>
    <Menu menus={menus} color="blue">
      <Content/>
      <Footer/>
    </Menu>
  </div>

export default App;