import store from './store';
import { receiveModels } from './redux/models';

export const onAppEnter = () => {
  if (window.localStorage.models) {
    let models = JSON.parse(window.localStorage.models);
    store.dispatch(receiveModels(models));
  } else {
    window.localStorage.setItem('models', '[]');
  }
};
