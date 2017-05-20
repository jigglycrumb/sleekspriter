import iconfont from './fonts/flaticon';
import styles from './styles/common';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/App';
import store from './state/store';
import { Provider } from 'react-redux';

store.subscribe(() => {
  console.info('Store changed', store.getState());
});

window.onload = function() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  );
};
