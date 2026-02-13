import type { Component, Props } from '../interface';
import type { Item } from './Item';
import { CLASS_NAME } from '../constants.js';

type ListProps = Props<{}>;

interface List extends Component<ListProps> {
  add(item: Item): void;
  remove(item: Item): void;
}

export default class ListComponent implements List {
  private listEl: HTMLUListElement | null = null;
  private items: Item[] = [];

  constructor(public readonly props: ListProps) {
    this.listEl = this.createListEl();
    this.mount();
  }

  public mount(): void {}

  public unMount(): void {
    if (!this.listEl) return;

    this.listEl.remove();
    this.listEl = null;
  }

  public add(item: Item): void {
    this.items.push(item);
    if (this.listEl) {
      item.render(this.listEl, 'first');
    }
  }

  public remove(item: Item): void {
    item.unMount();
    this.items = this.items.filter((i) => i.id !== item.id);
  }

  public render(target?: Element | null): void {
    if (this.listEl === null) {
      this.listEl = this.createListEl();
    }

    const parent = target ?? document.body;
    parent.append(this.listEl);
  }

  private createListEl(): HTMLUListElement {
    const listEl = document.createElement<'ul'>('ul');
    listEl.classList.add(CLASS_NAME.contentList, CLASS_NAME.scroll);
    return listEl;
  }
}
