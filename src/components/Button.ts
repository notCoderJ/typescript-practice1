import type { Props } from '../interface';
import type { Component } from '../interface';

export const ButtonSize = {
  s: 'size-s',
  m: 'size-m',
} as const;

export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

type ButtonProps = Props<
  Partial<{
    label: string;
    size: ButtonSize;
    classList: string[];
  }>
>;

interface Button extends Component<ButtonProps> {
  onClick(e?: Event): void;
}

export default class ButtonComponent implements Button {
  private buttonEl: HTMLButtonElement | null = null;
  private handleClick = (e: Event) => this.onClick(e);

  constructor(
    public readonly props: ButtonProps,
    public onClick: (e?: Event) => void,
  ) {
    this.buttonEl = this.createButtonEl(this.props);
    this.mount();
  }

  public mount(): void {}

  public unMount(): void {
    if (!this.buttonEl) return;

    this.buttonEl.removeEventListener('click', this.handleClick);
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
    const { label = '', size = ButtonSize.m, classList = [] } = props;
    const buttonEl = document.createElement<'button'>('button');
    buttonEl.textContent = label;
    buttonEl.classList.add('styled-button', size, ...classList);
    buttonEl.addEventListener('click', this.handleClick);
    return buttonEl;
  }
}
