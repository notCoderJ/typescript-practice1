type Props = Record<string, any>;
export type RenderOrder = 'first' | 'last';

export interface Component<P extends Props, C extends Component<any, any>> {
  host: HTMLElement | null;
  setProps(props: Partial<P>): this;
  setChildren(children: C[]): this;
  mount(): void;
  unMount(): void;
  render(target: Element | null, order?: RenderOrder): this;
}

export default abstract class ComponentBase<
  E extends HTMLElement,
  P extends Props,
  C extends Component<any, any>,
> implements Component<P, C> {
  public host: E | null = null;
  protected parent: Element | null = null;
  protected props: P;
  protected children: C[] = [];

  constructor(initialProps: P) {
    this.props = initialProps;
    this.host = this.createHostElement(this.props);
  }

  protected abstract createHostElement(props: P): E;
  protected release(): void {}
  protected rerenderByProps(_: E | null, __: P): void {}

  protected rerenderByChildren(
    target: HTMLElement | null,
    prev: C[],
    next: C[],
  ): void {
    this.removeChildren(prev);
    this.renderChildren(target, next);
  }

  protected renderChildren(target: HTMLElement | null, children: C[]): void {
    if (!target) return;
    children.forEach((child) => child.render(target));
  }

  protected removeChildren(children: C[]): void {
    children.forEach((child) => child.unMount());
  }

  public setProps(props: Partial<P>): this {
    this.props = { ...this.props, ...props };
    this.rerenderByProps(this.host, this.props);
    return this;
  }

  public setChildren(children: C[]): this {
    this.rerenderByChildren(this.host, this.children, children);
    this.children = children;
    return this;
  }

  public mount(): void {}

  public unMount(): void {
    if (!this.host) return;

    this.release();
    this.removeChildren(this.children);
    this.children = [];
    this.host.remove();
    this.host = null;
    this.parent = null;
  }

  public render(target: Element | null, order?: RenderOrder): this {
    if (!this.host) {
      throw new Error('Unable to render removed components!');
    }

    if (!!this.parent) {
      this.parent.removeChild(this.host);
    }

    this.parent = target ?? document.body;

    if (order === 'first') {
      this.parent.prepend(this.host);
    } else {
      this.parent.append(this.host);
    }

    this.mount();
    return this;
  }
}
