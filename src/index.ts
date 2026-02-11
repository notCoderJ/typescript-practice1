import Button from './components/Button.js';
import ControlComponent from './components/Control.js';
import FormComponent from './components/Form.js';
import HeaderComponent from './components/Header.js';
import { CLASS_NAME, FormLabel, MENU } from './constants.js';
import ModalService from './modal.js';

const titleControl = new ControlComponent({ label: FormLabel.title });
const bodyControl = new ControlComponent({ label: FormLabel.body });
const addForm = new FormComponent({}, (formData) => {
  console.log(formData);
});

const menuButtons = MENU.map<Button>(
  (menu) =>
    new Button(
      { label: menu, classList: [CLASS_NAME.menuButton] }, //
      () => modal.show(addForm.setControls(titleControl, bodyControl)),
    ),
);

const appHeader = new HeaderComponent({
  title: 'MOTION',
  children: menuButtons,
});

const app = document.querySelector('.app');
appHeader.render(app);

const root = document.querySelector('#root');
const modal = new ModalService();
modal.build(root);
