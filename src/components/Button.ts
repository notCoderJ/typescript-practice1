import type { Component } from '../component-base';
import ComponentBase from '../component-base.js';

export const ButtonSize = {
  s: 'size-s',
  m: 'size-m',
} as const;

export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

export const ButtonType = {
  button: 'button',
  submit: 'submit',
} as const;

export type ButtonType = (typeof ButtonType)[keyof typeof ButtonType];

export type ButtonProps = Partial<{
  type: ButtonType;
  label: string;
  size: ButtonSize;
  classList: string[];
}>;

export interface Button extends Component<ButtonProps, Component<any, any>> {
  setClickHandler(onClick: (e?: PointerEvent) => void): Button;
}

export default class ButtonComponent
  extends ComponentBase<HTMLButtonElement, ButtonProps, Component<any, any>>
  implements Button
{
  private onClick: ((e?: PointerEvent) => void) | null = null;

  public setClickHandler(onClick: (e?: PointerEvent) => void): ButtonComponent {
    this.onClick = onClick;
    return this;
  }

  protected createHostElement(props: ButtonProps): HTMLButtonElement {
    const { type, label, size, classList } = this.getProps(props);
    const host = document.createElement<'button'>('button');
    host.type = type;
    host.textContent = label;
    host.className = `styled-button ${size}`;
    host.classList.add(...classList);
    host.addEventListener('click', (e) => this.onClick && this.onClick(e));
    return host;
  }

  protected rerenderByProps(host: HTMLButtonElement, props: ButtonProps): void {
    const { type, label, size, classList = [] } = this.getProps(props);
    host.type = type;
    host.textContent = label;
    host.className = `styled-button ${size}`;
    host.classList.add(...classList);
  }

  private getProps(props: ButtonProps): Required<ButtonProps> {
    return {
      type: ButtonType.button,
      label: '',
      size: ButtonSize.m,
      classList: [],
      ...props,
    };
  }
}
