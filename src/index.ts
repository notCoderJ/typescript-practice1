import Button from './components/Button.js';
import ControlComponent, { ControlType } from './components/Control.js';
import HeaderComponent from './components/Header.js';
import { CLASS_NAME, MENU } from './constants.js';
import ModalService from './modal.js';

const control = new ControlComponent({ label: 'Body' });

const menuButtons = MENU.map<Button>(
  (menu) =>
    new Button(
      { label: menu, classList: [CLASS_NAME.menuButton] }, //
      () =>
        modal.show(
          menu === MENU[2]
            ? control.setType(ControlType.textarea)
            : control.setType(ControlType.text),
        ),
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
