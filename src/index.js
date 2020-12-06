import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';

import 'antd/dist/antd.css';
import './sass/style.sass'
import { Provider } from 'react-redux'
import store from './redux/index'

import {BrowserRouter as Router} from 'react-router-dom'
import RouteConfig from './components/RouteConfig';

import 'moment/locale/vi'
import locale from 'antd/es/date-picker/locale/vi_VN'
import { ConfigProvider } from 'antd';
import { fetchPlants } from './redux/features/Product/ProductSlice';
import { setAuthenication } from './redux/features/User/UserSlice';
import { fetchOrdersforOneUser } from './redux/features/OrderSlice/OrderSlice';
import { initSidebar } from './redux/features/Sidebar/SidebarSlice'
import { initCart } from './redux/features/Cart/CartSlice';

import local from './utils/withTokenUser'

function App() {
  useEffect(() => {
    if(local.user !== null) {
      store.dispatch(
        setAuthenication({user: local.user, token: local.token})
        )
      store.dispatch(
        fetchOrdersforOneUser({idUser: local.user.MATAIKHOAN, token: local.token})
      )
      }
    store.dispatch(fetchPlants())
    store.dispatch(initCart())
    store.dispatch(initSidebar())
  })
  return (
    <ConfigProvider locale = {locale}>
      <Router>
        <Provider store = {store}>
          <RouteConfig />
        </Provider>
      </Router>
    </ConfigProvider>
  );
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);


// store.dispatch(setAuthenication({name: "Thai", id: "10"}))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
