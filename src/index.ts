import Button from './components/Button.js';
import HeaderComponent from './components/Header.js';
import { CLASS_NAME, MENU } from './constants.js';

const menuButtons = MENU.map<Button>(
  (menu) =>
    new Button(
      { label: menu, classList: [CLASS_NAME.menuButton] }, //
      () => console.log(`${menu} clicked!!`),
    ),
);

const appHeader = new HeaderComponent({
  title: 'MOTION',
  children: menuButtons,
});

const app = document.querySelector('.app');
appHeader.render(app);
