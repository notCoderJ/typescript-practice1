import type { Component } from '../../component-base';
import ComponentBase from '../../component-base.js';
import { CLASS_NAME } from '../../constants.js';
import {
  ItemType,
  type ImageItemProps,
  type TextItemProps,
  type VideoItemProps,
} from './item.interface.js';

let gId = 0;

type ItemProps = TextItemProps | ImageItemProps | VideoItemProps;

export interface Item extends Component<ItemProps, Component<any, any>> {
  readonly id: number;
  setRemoveHandler(onRemove: (item: Item) => void): Item;
}

export default class ItemComponent
  extends ComponentBase<HTMLLIElement, ItemProps, Component<any, any>>
  implements Item
{
  public readonly id = gId++;
  private onRemove: (item: Item) => void = () => {};
  private static defaultResourceSize = { width: 480, height: 240 } as const;

  public setRemoveHandler(onRemove: (item: Item) => void): Item {
    this.onRemove = onRemove;
    return this;
  }

  protected createHostElement(props: ItemProps): HTMLLIElement {
    const hostEl = document.createElement<'li'>('li');
    hostEl.className = CLASS_NAME.contentItem;

    if (props.type !== ItemType.text) {
      const mediaEl = this.createMediaElementByType(props);
      hostEl.append(mediaEl);
    }

    const textEl = this.createTextElement(props);
    const rmButtonEl = document.createElement<'button'>('button');
    rmButtonEl.classList.add('x-button', CLASS_NAME.itemRemoveButton);
    rmButtonEl.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    rmButtonEl.addEventListener('click', () => this.onRemove(this));

    hostEl.append(textEl, rmButtonEl);
    return hostEl;
  }

  private createMediaElementByType(
    props: ImageItemProps | VideoItemProps,
  ): HTMLElement {
    switch (props.type) {
      case ItemType.image:
        return this.createImageElement(props);
      case ItemType.video:
        return this.createIframeElement(props);
      default:
        const neverType: never = props;
        throw new Error(`Not supported media type ${props}`);
    }
  }

  private createImageElement(props: ImageItemProps): HTMLImageElement {
    const { url, alt, width, height } = {
      ...ItemComponent.defaultResourceSize,
      ...props,
    };

    const imageEl = document.createElement<'img'>('img');
    imageEl.className = CLASS_NAME.contentFigure;
    imageEl.src = url;
    imageEl.alt = alt ?? '';
    imageEl.width = width;
    imageEl.height = height;
    return imageEl;
  }

  private createIframeElement(props: VideoItemProps): HTMLIFrameElement {
    const { url, title, width, height } = {
      ...ItemComponent.defaultResourceSize,
      ...props,
    };

    const iframeEl = document.createElement<'iframe'>('iframe');
    iframeEl.className = CLASS_NAME.contentFigure;
    iframeEl.src = url;
    iframeEl.title = title;
    iframeEl.width = width.toString();
    iframeEl.height = height.toString();
    return iframeEl;
  }

  private createTextElement(props: ItemProps): HTMLElement {
    const { title, description } = props;
    const sectionEl = document.createElement<'section'>('section');
    sectionEl.classList.add(CLASS_NAME.contentText, CLASS_NAME.scroll);

    const titleEl = document.createElement<'h2'>('h2');
    titleEl.className = CLASS_NAME.contentTitle;
    titleEl.textContent = title;
    sectionEl.prepend(titleEl);

    if (!!description) {
      const descEl = document.createElement<'p'>('p');
      descEl.textContent = description;
      sectionEl.append(descEl);
    }

    return sectionEl;
  }
}
