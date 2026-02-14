import type { Component } from './component-base';
import ComponentBase from './component-base.js';

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

type ButtonProps = Partial<{
  type: ButtonType;
  label: string;
  size: ButtonSize;
  classList: string[];
}>;

export interface Button extends Component<ButtonProps, Component<any, any>> {
  setClickHandler(onClick: (e?: PointerEvent) => void): this;
}

export default class ButtonComponent
  extends ComponentBase<HTMLButtonElement, ButtonProps, Component<any, any>>
  implements Button
{
  private onClick: (e?: PointerEvent) => void = () => {};

  public setClickHandler(onClick: (e?: PointerEvent) => void): this {
    this.onClick = onClick;
    return this;
  }

  protected createHostElement(props: ButtonProps): HTMLButtonElement {
    const { type, label, size, classList } = this.mergeDefaultProps(props);
    const hostEl = document.createElement<'button'>('button');
    hostEl.type = type;
    hostEl.textContent = label;
    hostEl.className = `styled-button ${size}`;
    hostEl.classList.add(...classList);
    hostEl.addEventListener('click', (e) => this.onClick(e));
    return hostEl;
  }

  protected override rerenderByProps(
    host: HTMLButtonElement,
    props: ButtonProps,
  ): void {
    if (!host) return;

    const { type, label, size, classList = [] } = this.mergeDefaultProps(props);
    host.type = type;
    host.textContent = label;
    host.className = `styled-button ${size}`;
    host.classList.add(...classList);
  }

  private mergeDefaultProps(props: ButtonProps): Required<ButtonProps> {
    return {
      type: ButtonType.button,
      label: '',
      size: ButtonSize.m,
      classList: [],
      ...props,
    };
  }
}
