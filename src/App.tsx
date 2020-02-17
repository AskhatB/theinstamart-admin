import React from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import CreateShop from './pages/CreateShop';
import CreateProduct from './pages/CreateProduct';
import ShopList from './pages/ShopList';
import ProductList from './pages/ProductList';
import ParsedProducts from './pages/ParsedProducts';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar
  })
);

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Link to="/">
          <Toolbar>
            <Typography variant="h6" noWrap style={{ color: '#ffffff' }}>
              <strong>Theinstamart.com</strong> Панель администратора
            </Typography>
          </Toolbar>
        </Link>
      </AppBar>
      {/* <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.toolbar} />
        <List>
          <ListItem button>
            <Link to="/create-shop?step=1">
              <ListItemText primary="Добавить магазин" />
            </Link>
          </ListItem>
          <ListItem button>
            <Link to="/create-product">
              <ListItemText primary="Добавить продукт" />
            </Link>
          </ListItem>
        </List>
      </Drawer> */}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route path="/create-shop" component={CreateShop}></Route>
          <Route path="/create-product/:shop" component={CreateProduct}></Route>
          <Route path="/shop-list" component={ShopList}></Route>
          <Route path="/product-list/:id" component={ProductList}></Route>
          <Route path="/parsed-products/:id" component={ParsedProducts}></Route>
          <Redirect from="/" to="/shop-list" />
        </Switch>
      </main>
    </div>
  );
};

export default App;
