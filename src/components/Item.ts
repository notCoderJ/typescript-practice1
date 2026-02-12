import type { Component, Props, RenderOrder } from '../interface';
import { CLASS_NAME } from '../constants.js';

type ItemProps = Props<{}>;

interface Item extends Component<ItemProps> {
  readonly id: number;
  onRemove: (item: Item) => void;
}

let gId = 0;

export default class ItemComponent implements Item {
  public readonly id = gId++;
  private itemEl: HTMLLIElement | null = null;
  private handleRemove = () => this.onRemove(this);

  constructor(
    public readonly props: ItemProps,
    public onRemove: (item: Item) => void,
  ) {
    this.itemEl = this.createItemEl(this.props);
    this.mount();
  }

  public mount(): void {}

  public unMount(): void {
    if (!this.itemEl) return;

    this.props.children?.forEach((child) => child.unMount());
    this.itemEl.remove();
    this.itemEl = null;
  }

  public render(target?: Element | null, order: RenderOrder = 'last'): void {
    if (this.itemEl === null) {
      this.itemEl = this.createItemEl(this.props);
    }

    const parent = target ?? document.body;
    if (order === 'first') {
      parent.prepend(this.itemEl);
    } else {
      parent.append(this.itemEl);
    }
  }

  private createItemEl(props: ItemProps): HTMLLIElement {
    const { children = [] } = props;
    const itemEl = document.createElement<'li'>('li');
    itemEl.className = CLASS_NAME.contentItem;

    const removeButton = document.createElement<'button'>('button');
    removeButton.classList.add('x-button', CLASS_NAME.itemRemoveButton);
    removeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    removeButton.addEventListener('click', this.handleRemove);

    children.forEach((child) => child.render(itemEl));
    itemEl.append(removeButton);
    return itemEl;
  }
}
