import Button from './components/Button.js';
import ImageContentComponent from './components/contents/ImageContent.js';
import TextContentComponent from './components/contents/textContent.js';
import VideoContentComponent from './components/contents/VideoContent.js';
import ControlComponent from './components/Control.js';
import FormComponent from './components/Form.js';
import HeaderComponent from './components/Header.js';
import ItemComponent from './components/Item.js';
import { CLASS_NAME, FormLabel, MENU } from './constants.js';
import ModalService from './modal.js';

const root = document.querySelector('#root');
const modal = new ModalService();
modal.build(root);

const titleControl = new ControlComponent({ label: FormLabel.title });
const bodyControl = new ControlComponent({ label: FormLabel.body });

const listEl = document.querySelector('.app__contents');

const menuButtons = MENU.map<Button>(
  (menu) =>
    new Button(
      { label: menu, classList: [CLASS_NAME.menuButton] }, //
      () =>
        modal.show(
          new FormComponent({}, () => {
            createItemTemp(menu)?.render(listEl);
            modal.hide();
          }).setControls(titleControl, bodyControl),
        ),
    ),
);

const appHeader = new HeaderComponent({
  title: 'MOTION',
  children: menuButtons,
});

const app = document.querySelector('.app');
appHeader.render(app);

function createItemTemp(
  menu: 'IMAGE' | 'VIDEO' | 'NOTE' | 'TASK',
): ItemComponent | null {
  switch (menu) {
    case 'IMAGE':
      return new ItemComponent(
        {
          children: [
            new ImageContentComponent({
              url: 'https://fastly.picsum.photos/id/786/700/350.jpg?hmac=eI1TG9CaWM15B1mycXUjh88-YmKVkdx5GHLxXG43sJ4',
              alt: 'iamge',
            }),
            new TextContentComponent({ title: 'Image' }),
          ],
        },
        (item) => console.log(`${item.id} removed!!`),
      );
    case 'VIDEO':
      return new ItemComponent(
        {
          children: [
            new VideoContentComponent({
              url: 'https://www.youtube.com/embed/hYlBSiX28ps',
              title: 'youtube',
            }),
            new TextContentComponent({ title: 'Video' }),
          ],
        },
        (item) => console.log(`${item.id} removed!!`),
      );
    case 'NOTE':
    case 'TASK':
      return new ItemComponent(
        {
          children: [
            new TextContentComponent({
              title: 'Note',
              description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat`,
            }),
          ],
        },
        (item) => console.log(`${item.id} removed!!`),
      );
    default:
      new Error(`not supported menu ${menu}`);
  }

  return null;
}
