import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';

import 'antd/dist/antd.css';
import './sass/style.sass'

import store from './redux'
import {Provider} from 'react-redux'

import {BrowserRouter as Router} from 'react-router-dom'
import RouteConfig from './components/RouteConfig';

import {actions} from './redux/reducers/index'


import 'moment/locale/vi'
import locale from 'antd/es/date-picker/locale/vi_VN'
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider locale = {locale}>
      <Provider store = {store}>
          <Router forceRefresh = {true}>
                <RouteConfig />
          </Router>
        </Provider>
    </ConfigProvider>
  );
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

// store.dispatch(actions.increment(2))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
