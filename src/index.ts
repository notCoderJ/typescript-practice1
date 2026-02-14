import ModalService from './modal.js';
import AppComponent from './components/App.js';

const root = document.querySelector('#root');
const app = new AppComponent(
  {}, //
  new ModalService().build(root),
).render(root);
