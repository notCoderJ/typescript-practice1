import type { Props } from '../interface';
import type { Component } from '../interface';

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

type ButtonProps = Props<
  Partial<{
    type: ButtonType;
    label: string;
    size: ButtonSize;
    classList: string[];
  }>
>;

interface Button extends Component<ButtonProps> {
  onClick?: ((e?: Event) => void) | undefined;
}

export default class ButtonComponent implements Button {
  private buttonEl: HTMLButtonElement | null = null;
  private handleClick: (() => void) | null = null;

  constructor(
    public readonly props: ButtonProps,
    public onClick?: (e?: Event) => void,
  ) {
    if (this.onClick) {
      this.handleClick = this.onClick.bind(this);
    }
    this.buttonEl = this.createButtonEl(this.props);
    this.mount();
  }

  public mount(): void {}

  public unMount(): void {
    if (!this.buttonEl) return;

    if (this.handleClick) {
      this.buttonEl.removeEventListener('click', this.handleClick);
    }
    this.buttonEl.remove();
    this.buttonEl = null;
  }

  public render(target?: Element | null): void {
    if (this.buttonEl === null) {
      this.buttonEl = this.createButtonEl(this.props);
    }

    const parent = target ?? document.body;
    parent.append(this.buttonEl);
  }

  private createButtonEl(props: ButtonProps): HTMLButtonElement {
    const {
      type = ButtonType.button,
      label = '',
      size = ButtonSize.m,
      classList = [],
    } = props;
    const buttonEl = document.createElement<'button'>('button');
    buttonEl.type = type;
    buttonEl.textContent = label;
    buttonEl.classList.add('styled-button', size, ...classList);
    if (this.handleClick) {
      buttonEl.addEventListener('click', this.handleClick);
    }
    return buttonEl;
  }
}
