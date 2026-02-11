import type { Component, Props } from '../interface';
import { CLASS_NAME } from '../constants.js';

type HeaderProps = Props<
  Partial<{
    title: string;
  }>
>;

interface Header extends Component<HeaderProps> {}

export default class HeaderComponent implements Header {
  private headerEl: HTMLElement | null = null;

  constructor(public readonly props: HeaderProps) {
    this.headerEl = this.createHeaderEl(this.props);
    this.mount();
  }

  public mount(): void {}

  public unMount(): void {
    if (!this.headerEl) return;

    this.headerEl.remove();
    this.headerEl = null;
  }

  public render(target?: Element | null): void {
    if (this.headerEl === null) {
      this.headerEl = this.createHeaderEl(this.props);
    }

    const parent = target ?? document.body;
    parent.prepend(this.headerEl);
  }

  private createHeaderEl(props: HeaderProps): HTMLElement {
    const { title = '', children = [] } = props;
    const headerEl = document.createElement<'header'>('header');
    headerEl.className = CLASS_NAME.appHeader;

    const h1El = document.createElement<'h1'>('h1');
    h1El.className = CLASS_NAME.appTitle;
    h1El.textContent = title;

    headerEl.prepend(h1El);
    children.forEach((child) => child.render(headerEl));

    return headerEl;
  }
}
