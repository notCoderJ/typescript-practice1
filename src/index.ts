import ModalService from './service/modal.js';
import AppComponent from './components/App.js';

const root = document.querySelector('#root');
ModalService.build(root);
const app = new AppComponent({}).render(root);
