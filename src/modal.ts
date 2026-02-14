import type { Component } from './component-base';
import { CLASS_NAME } from './constants.js';

const MODAL_ACTION = { close: 'close' } as const;

export interface Modal {
  build(target?: Element | null): void;
  clear(): void;
  show(target: Component<any, any> | null): void;
  hide(): void;
}

export default class ModalService implements Modal {
  private isOpened = false;
  private modalBackdrop: HTMLDivElement | null = null;
  private modalSlot: HTMLElement | null = null;
  private modalComponent: Component<any, any> | null = null;
  private handleKeyClose = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      this.hide();
    }
  };

  public build(target?: Element | null): Modal {
    const parent = target ?? document.body;
    this.modalBackdrop = document.createElement<'div'>('div');
    this.modalBackdrop.classList.add(
      CLASS_NAME.modalBackdrop,
      CLASS_NAME.hidden,
    );
    this.modalBackdrop.setAttribute('data-action', MODAL_ACTION.close);
    this.modalBackdrop.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.dataset.action === MODAL_ACTION.close) {
        this.hide();
      }
    });
    document.body.addEventListener('keydown', this.handleKeyClose);

    this.modalSlot = document.createElement<'section'>('section');
    this.modalSlot.className = CLASS_NAME.modalSlot;

    // TODO: 컴포넌트화 고민 중.
    const closeButton = document.createElement<'button'>('button');
    closeButton.classList.add('x-button', CLASS_NAME.modalCloseButton);
    closeButton.setAttribute('data-action', MODAL_ACTION.close);
    closeButton.innerHTML = `<i data-action="${MODAL_ACTION.close}" class="fa-solid fa-xmark"></i>`;

    this.modalSlot.append(closeButton);
    this.modalBackdrop.append(this.modalSlot);
    parent.append(this.modalBackdrop);

    return this;
  }

  public clear(): void {
    this.modalComponent?.unMount();
    this.modalComponent = null;

    this.modalSlot?.remove();
    this.modalSlot = null;

    this.modalBackdrop?.remove();
    this.modalBackdrop = null;
    this.isOpened = false;

    document.body.removeEventListener('keydown', this.handleKeyClose);
  }

  public show(target: Component<any, any> | null = null): void {
    if (this.isOpened) {
      this.hide();
    }

    this.modalComponent = target;
    this.modalComponent?.render(this.modalSlot);
    this.modalBackdrop?.classList.remove(CLASS_NAME.hidden);
    this.isOpened = true;
  }

  public hide(): void {
    this.modalComponent?.unMount();
    this.modalComponent = null;
    this.modalBackdrop?.classList.add(CLASS_NAME.hidden);
    this.isOpened = false;
  }
}
