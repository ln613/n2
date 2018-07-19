import React from 'react';
import { connect } from 'no-redux';
import { is } from 'ramda';
import { Link } from 'react-router-dom';
import { Menu, Input, Dropdown, Popup, Container, Sidebar, Responsive, Icon } from 'semantic-ui-react';
import actions from 'utils/actions';
import { langSelector } from 'utils/selectors';

//const menus = ['Home', 'Products', 'News', ['Training', [['Classes', 'university'], ['Coaches', 'user'], ['Players', 'users']]], 'Tournaments', 'League', 'Rating', 'Contact'];
//const menus = ['Home', 'Products', 'News', 'Players', 'Tournaments', 'Rating', 'Calendar', 'Contact'];
const menus = ['Home', 'Intro', 'Tournaments', 'Rating', 'Calendar', 'Links', 'Contact'];

const leftItems = menus.map(x => ({ as: "a", content: x, key: x.toLowerCase() }));
  
const menu = ({ lang, setLang, children }) =>
<NavBar leftItems={leftItems}>
{children}
</NavBar>

const menu1 = () => <div>
    <Menu color="blue" inverted id="main-menu" stackable>
      {menus.map((x, i) => {
        if (is(Array, x)) {
          return (
            <Dropdown item simple text={x[0]} key={x[0]}>
              <Dropdown.Menu>
                {x[1].map(y =>
                  <Dropdown.Item text={y[0]} icon={y[1]} />
                )}
              </Dropdown.Menu>
            </Dropdown>
          );
        }
        return <Link to={'/' + (i === 0 ? '' : x)}><Menu.Item name={x} /></Link>;
      })}
      {/* <Menu.Menu position='right'>
        <div class="f aic p4">
          {popup('English', 'c1', () => setLang())}
          {popup('中文', 'c2', () => setLang('ch'))}
          <Input icon='search' placeholder='Search...' />
        </div>
      </Menu.Menu> */}
    </Menu>
  </div>

const popup = (t, img, f) => <Popup content={t} position="bottom center" trigger={<a class="cp" onClick={f}><img src={`images/${img}.png`} class="mr4" alt="" /></a>} />

export default connect(langSelector, actions)(menu);

const NavBarMobile = ({
  children,
  leftItems,
  onPusherClick,
  onToggle,
  rightItems,
  visible
}) => (
  <Sidebar.Pushable>
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      items={leftItems}
      vertical
      visible={visible}
      color="blue"
    />
    <Sidebar.Pusher
      dimmed={visible}
      onClick={onPusherClick}
      style={{ minHeight: "100vh" }}
    >
      <Menu inverted color="blue">
        <Menu.Item onClick={onToggle}>
          <Icon name="sidebar" />
        </Menu.Item>
      </Menu>
      {children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);

const NavBarDesktop = ({ leftItems }) => (
  <Menu inverted color="blue">
    {leftItems.map(item => <Menu.Item {...item} />)}
  </Menu>
);

const NavBarChildren = ({ children }) => (
  <Container style={{ marginTop: "5em" }}>{children}</Container>
);

class NavBar extends React.Component {
  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    const { children, leftItems, rightItems } = this.props;
    const { visible } = this.state;

    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>
          <NavBarMobile
            leftItems={leftItems}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            visible={visible}
          >
            {children}
          </NavBarMobile>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavBarDesktop leftItems={leftItems} />
          {children}
        </Responsive>
      </div>
    );
  }
}

