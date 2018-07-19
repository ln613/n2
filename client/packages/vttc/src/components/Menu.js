import React from 'react';
import { connect } from 'no-redux';
import { compose } from 'recompose';
import { is } from 'ramda';
import { Link } from 'react-router-dom';
import { Menu, Input, Dropdown, Popup, Container, Sidebar, Icon } from 'semantic-ui-react';
import actions from 'utils/actions';
import { langSelector } from 'utils/selectors';
import { Mobile, Desktop } from 'utils/comps';
import { withState } from 'utils';

//const menus = ['Home', 'Products', 'News', ['Training', [['Classes', 'university'], ['Coaches', 'user'], ['Players', 'users']]], 'Tournaments', 'League', 'Rating', 'Contact'];
//const menus = ['Home', 'Products', 'News', 'Players', 'Tournaments', 'Rating', 'Calendar', 'Contact'];
const menus = ['Intro', 'Tournaments', 'Rating', 'Calendar', 'Links', 'Contact'];

const items = s => menus.map(x => <Link to={'/' + x} onClick={() => s(false)}><Menu.Item name={x}/></Link>);
const _menu = c => <Menu inverted color="blue" style={{margin: 0}}>{c}</Menu>;

const _Menu = ({ children, visible, setVisible }) =>
  <div>
    <Mobile>
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation="overlay" icon="labeled" inverted vertical visible={visible} color="blue">
          {items(setVisible)}
        </Sidebar>
        <Sidebar.Pusher dimmed={visible} onClick={() => visible && setVisible(false)} style={{ minHeight: "100vh" }}>
          {_menu(
            <Menu.Item onClick={() => setVisible(!visible)}>
              <Icon name="sidebar" />
            </Menu.Item>
          )}
          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Mobile>
    <Desktop>
      {_menu(items(setVisible))}
      {children}
    </Desktop>
  </div>

export default compose(
  connect(langSelector, actions),
  withState('visible')
)(_Menu)
  
// const menu1 = () => <div>
//     <Menu color="blue" inverted id="main-menu" stackable>
//       {menus.map((x, i) => {
//         if (is(Array, x)) {
//           return (
//             <Dropdown item simple text={x[0]} key={x[0]}>
//               <Dropdown.Menu>
//                 {x[1].map(y =>
//                   <Dropdown.Item text={y[0]} icon={y[1]} />
//                 )}
//               </Dropdown.Menu>
//             </Dropdown>
//           );
//         }
//         return <Link to={'/' + (i === 0 ? '' : x)}><Menu.Item name={x} /></Link>;
//       })}
//       <Menu.Menu position='right'>
//         <div class="f aic p4">
//           {popup('English', 'c1', () => setLang())}
//           {popup('中文', 'c2', () => setLang('ch'))}
//           <Input icon='search' placeholder='Search...' />
//         </div>
//       </Menu.Menu>
//     </Menu>
//   </div>

// const popup = (t, img, f) => <Popup content={t} position="bottom center" trigger={<a class="cp" onClick={f}><img src={`images/${img}.png`} class="mr4" alt="" /></a>} />
