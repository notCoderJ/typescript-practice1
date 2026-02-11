import type { Component, Props } from './interface';
import { CLASS_NAME } from './constants.js';

const MODAL_ACTION = { close: 'close' } as const;

interface Modal {
  build(target?: Element | null): void;
  clear(): void;
  show(target: Component<Props<{}>>): void;
  hide(): void;
}

export default class ModalService implements Modal {
  private modalBackdrop: HTMLDivElement | null = null;
  private modalSlot: HTMLElement | null = null;
  private modalComponent: Component<Props<{}>> | null = null;

  public build(target?: Element | null): void {
    const parent = target ?? document.body;
    this.modalBackdrop = document.createElement<'div'>('div');
    this.modalBackdrop.classList.add(CLASS_NAME.modalBackdrop, 'hidden');
    this.modalBackdrop.setAttribute('data-action', MODAL_ACTION.close);
    this.modalBackdrop.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.dataset.action === MODAL_ACTION.close) {
        this.hide();
      }
    });

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
  }

  public clear(): void {
    this.modalComponent?.unMount();
    this.modalComponent = null;

    this.modalSlot?.remove();
    this.modalSlot = null;

    this.modalBackdrop?.remove();
    this.modalBackdrop = null;
  }

  public show(target: Component<Props<{}>> | null = null): void {
    this.modalComponent = target;
    this.modalComponent?.render(this.modalSlot);
    this.modalBackdrop?.classList.remove('hidden');
  }

  public hide(): void {
    this.modalComponent?.unMount();
    this.modalBackdrop?.classList.add('hidden');
  }
}
