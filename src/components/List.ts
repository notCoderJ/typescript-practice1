import type { Item } from './item/Item';
import ComponentBase, { type Component } from './component-base.js';
import { CLASS_NAME } from '../constants.js';

type ListProps = Record<string, unknown>;

export interface List extends Component<ListProps, Item> {
  add(item: Item): void;
  remove(item: Item): void;
}

export default class ListComponent
  extends ComponentBase<HTMLUListElement, ListProps, Item>
  implements List
{
  public add(item: Item): void {
    if (!this.host) return;
    this.children.push(item);
    item.render(this.host);
  }

  public remove(item: Item): void {
    item.unMount();
    this.children = this.children.filter((it) => it.id !== item.id);
  }

  protected createHostElement(): HTMLUListElement {
    const hostEl = document.createElement<'ul'>('ul');
    hostEl.classList.add(CLASS_NAME.contentList, CLASS_NAME.scroll);
    return hostEl;
  }
}
