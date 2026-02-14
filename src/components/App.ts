import type { Modal } from '../modal';
import type { List } from './List';
import ComponentBase, { type Component } from '../component-base.js';
import ButtonComponent, { type Button } from './Button.js';
import ListComponent from './List.js';
import { CLASS_NAME } from '../constants.js';

const MenuType = {
  image: 'image',
  video: 'video',
  note: 'note',
  task: 'task',
} as const;

type MenuType = (typeof MenuType)[keyof typeof MenuType];
type Menu = { label: string; type: MenuType };

const MENUS: Menu[] = [
  { label: 'IMAGE', type: 'image' },
  { label: 'VIDEO', type: 'video' },
  { label: 'NOTE', type: 'note' },
  { label: 'TASK', type: 'task' },
];

type AppProps = Record<string, unknown>;

export default class AppComponent extends ComponentBase<
  HTMLElement,
  AppProps,
  Component<any, any>
> {
  private list: List | null = null;

  constructor(
    initialProps: AppProps = {} as AppProps,
    private modal: Modal,
  ) {
    super(initialProps);
  }

  protected override beforeHostElementBuild(): void {
    this.list = new ListComponent();
  }

  protected createHostElement(): HTMLElement {
    const hostEl = document.createElement<'section'>('section');
    hostEl.className = CLASS_NAME.app;

    hostEl.prepend(this.createHeader());
    this.list!.render(hostEl);

    return hostEl;
  }

  private createHeader(): HTMLElement {
    const headerEl = document.createElement<'header'>('header');
    headerEl.className = CLASS_NAME.appHeader;

    const h1 = document.createElement<'h1'>('h1');
    h1.className = CLASS_NAME.appTitle;
    h1.textContent = 'MOTION';

    const menuButtons = MENUS.map<Button>(
      ({ label }) =>
        new ButtonComponent({
          label,
          classList: [CLASS_NAME.menuButton],
        }).setClickHandler(() => this.modal.show(null)), // TODO: input form & control
    );

    headerEl.prepend(h1);
    menuButtons.forEach((btn) => btn.render(headerEl));
    return headerEl;
  }
}
