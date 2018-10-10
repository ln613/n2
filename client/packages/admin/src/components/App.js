import React from 'react';
import { Switch, Route } from 'react-router';
import Menu from './Menu';
import Home from './Home';
import Cats from './Cats';
import Cat from './Cat';
import Products from './Products';
import Product from './Product';
import Tournaments from './Tournaments';
import Tournament from './Tournament';
import Players from './Players';
import Player from './Player';
import Teams from './Teams';
import Team from './Team';
import SinglePlayers from './SinglePlayers';
import Schedules from './Schedules';
import Schedule from './Schedule';
import Games from './Games';
import Game from './Game';
import Header from './Header';

const App = () =>
  <div class="p16">
    <Header/>  
    <hr/>
    <div class="f">
      <Menu />
      <div class="ph16 fg1">
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/cats' component={Cats} />
          <Route path='/cats/:id' component={Cat} />
          <Route exact path='/products' component={Products} />
          <Route path='/products/:id' component={Product} />
          <Route exact path='/tournaments' component={Tournaments} />
          <Route path='/tournaments/:id' component={Tournament} />
          <Route exact path='/players' component={Players} />
          <Route path='/players/:id' component={Player} />
          <Route path='/teams/:id' component={Teams} />
          <Route path='/team/:id1/:id' component={Team} />
          <Route path='/singleplayers/:id' component={SinglePlayers} />
          <Route path='/schedules/:id' component={Schedules} />
          <Route path='/schedule/:id1/:id' component={Schedule} />
          <Route path='/games/:T/:S?/:M?' component={Games} />
          <Route path='/game/:T/:S/:M/:id' component={Game} />
        </Switch>
      </div>
    </div>
  </div>

export default App;
