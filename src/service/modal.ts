import type { Component } from '../components/component-base';
import { CLASS_NAME } from '../constants.js';

const MODAL_ACTION = { close: 'close' } as const;

export default class Modal {
  private static isOpened = false;
  private static modalBackdrop: HTMLDivElement | null = null;
  private static slotElement: HTMLElement | null = null;
  private static modalComponent: Component<any, any> | null = null;
  private static handleKeyClose = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      Modal.hide();
    }
  };

  public static build(target?: Element | null): void {
    const parent = target ?? document.body;
    const modalBackdrop = document.createElement<'div'>('div');
    modalBackdrop.classList.add(CLASS_NAME.modalBackdrop, CLASS_NAME.hidden);
    modalBackdrop.setAttribute('data-action', MODAL_ACTION.close);
    modalBackdrop.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.dataset.action === MODAL_ACTION.close) {
        Modal.hide();
      }
    });

    const slotElement = document.createElement<'section'>('section');
    slotElement.className = CLASS_NAME.modalSlot;

    const closeButton = document.createElement<'button'>('button');
    closeButton.classList.add('x-button', CLASS_NAME.modalCloseButton);
    closeButton.setAttribute('data-action', MODAL_ACTION.close);
    closeButton.innerHTML = `<i data-action="${MODAL_ACTION.close}" class="fa-solid fa-xmark"></i>`;

    slotElement.append(closeButton);
    modalBackdrop.append(slotElement);
    parent.append(modalBackdrop);

    Modal.slotElement = slotElement;
    Modal.modalBackdrop = modalBackdrop;
    document.body.addEventListener('keydown', Modal.handleKeyClose);
  }

  public static release(): void {
    Modal.modalComponent?.unMount();
    Modal.modalComponent = null;

    Modal.slotElement?.remove();
    Modal.slotElement = null;

    Modal.modalBackdrop?.remove();
    Modal.modalBackdrop = null;
    Modal.isOpened = false;

    document.body.removeEventListener('keydown', Modal.handleKeyClose);
  }

  public static show(target: Component<any, any> | null = null): void {
    if (Modal.isOpened) {
      Modal.hide();
    }

    Modal.modalComponent = target;
    Modal.modalComponent?.render(Modal.slotElement);
    Modal.modalBackdrop?.classList.remove(CLASS_NAME.hidden);
    Modal.isOpened = true;
  }

  public static hide(): void {
    Modal.modalComponent?.unMount();
    Modal.modalComponent = null;
    Modal.modalBackdrop?.classList.add(CLASS_NAME.hidden);
    Modal.isOpened = false;
  }
}
