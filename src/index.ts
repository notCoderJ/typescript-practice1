import Button from './components/Button.js';
import { CLASS_NAME, MENU } from './constants.js';

const menuButtons = MENU.map<Button>(
  (menu) =>
    new Button(
      { label: menu, classList: [CLASS_NAME.menuButton] }, //
      () => console.log(`${menu} clicked!!`),
    ),
);

const headerEl = document.querySelector('.app__header');
menuButtons.forEach((btn) => btn.render(headerEl));
