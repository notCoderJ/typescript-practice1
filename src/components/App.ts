import type { Modal } from '../modal';
import type { List } from './List';
import ComponentBase, { type Component } from './component-base.js';
import ListComponent from './List.js';
import ButtonComponent, { type Button } from './Button.js';
import AddFormComponent, { type AddForm } from './AddForm.js';
import ControlComponent, { ControlType } from './Control.js';
import ItemComponent from './item/Item.js';
import { ItemType } from './item/item.interface.js';
import { CLASS_NAME } from '../constants.js';

type Menu = { label: string; type: ItemType };

const MENUS: Menu[] = [
  { label: 'IMAGE', type: ItemType.image },
  { label: 'VIDEO', type: ItemType.video },
  { label: 'NOTE', type: ItemType.text },
  { label: 'TASK', type: ItemType.text },
];

const FormLabel = {
  title: 'Title',
  body: 'Body',
} as const;

type FormLabel = (typeof FormLabel)[keyof typeof FormLabel];
type FormData = Record<FormLabel, string>;
type AppProps = Readonly<Record<string, unknown>>;

export default class AppComponent extends ComponentBase<
  HTMLElement,
  AppProps,
  Component<any, any>
> {
  private list!: List;

  constructor(
    initialProps: AppProps = {} as AppProps,
    private modal: Modal,
  ) {
    super(initialProps);
    this.appendChildren(this.host!);
  }

  protected createHostElement(): HTMLElement {
    const hostEl = document.createElement<'section'>('section');
    hostEl.className = CLASS_NAME.app;
    return hostEl;
  }

  private appendChildren(host: HTMLElement): void {
    const menuButtons = MENUS.map<Button>(({ label, type }) =>
      new ButtonComponent({
        label,
        classList: [CLASS_NAME.menuButton],
      }).setClickHandler(() => this.modal.show(this.createAddFormByType(type))),
    );

    host.prepend(this.createHeader(menuButtons));
    this.list = new ListComponent({}).render(host);
  }

  private createHeader(menuButtons: Button[]): HTMLElement {
    const headerEl = document.createElement<'header'>('header');
    headerEl.className = CLASS_NAME.appHeader;

    const h1 = document.createElement<'h1'>('h1');
    h1.className = CLASS_NAME.appTitle;
    h1.textContent = 'MOTION';

    headerEl.prepend(h1);
    menuButtons.forEach((btn) => btn.render(headerEl));
    return headerEl;
  }

  private createAddFormByType(type: ItemType): AddForm {
    return new AddFormComponent({})
      .setChildren([
        new ControlComponent({ label: 'Title' }),
        new ControlComponent({
          label: 'Body',
          type: itemTypeToControlType(type),
        }),
      ])
      .setSubmitHandler((data) => {
        const item = this.createItem(type, data as FormData) //
          .setRemoveHandler((item) => this.list.remove(item));
        this.list.add(item);
        this.modal.hide();
        item.host!.scrollIntoView({ behavior: 'smooth' });
      });
  }

  private createItem(type: ItemType, data: FormData): ItemComponent {
    const { Title: title, Body: body } = data;
    switch (type) {
      case ItemType.image:
        return new ItemComponent({ type, title, url: body, alt: title });
      case ItemType.video:
        return new ItemComponent({ type, title, url: body });
      case ItemType.text:
        return new ItemComponent({ type, title, description: body });
      default:
        const neverType: never = type;
        throw new Error(`Not supported type ${neverType}`);
    }
  }
}

function itemTypeToControlType(itemType: ItemType): ControlType {
  switch (itemType) {
    case ItemType.image:
    case ItemType.video:
      return ControlType.url;
    case ItemType.text:
      return ControlType.textarea;
    default:
      const neverType: never = itemType;
      throw new Error(`Not supported type ${neverType}`);
  }
}
