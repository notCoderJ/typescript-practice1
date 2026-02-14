type Props = Record<string, any>;
export type RenderOrder = 'first' | 'last';

export interface Component<P extends Props, C extends Component<any, any>> {
  setProps(props: Partial<P>): Component<P, C>;
  setChildren(children: C[]): Component<P, C>;
  unMount(): void;
  render(target: Element | null, order?: RenderOrder): void;
}

export default abstract class ComponentBase<
  E extends HTMLElement,
  P extends Props,
  C extends Component<any, any>,
> implements Component<P, C> {
  protected parent: Element | null = null;
  protected host: E | null = null;
  protected props: P;
  protected children: C[] = [];

  constructor(initialProps: P = {} as P) {
    this.beforeHostElementBuild();
    this.props = initialProps;
    this.host = this.createHostElement(this.props);
  }

  protected abstract createHostElement(props: P): E;
  protected clear(): void {}
  protected beforeHostElementBuild(): void {}
  protected rerenderByProps(host: E, props: P): void {}

  protected rerenderByChildren(host: E, prev: C[], next: C[]): void {
    this.removeChildren(prev);
    this.renderChildren(host, next);
  }

  protected renderChildren(target: HTMLElement | null, children: C[]): void {
    children.forEach((child) => child.render(target));
  }

  protected removeChildren(children: C[]): void {
    children.forEach((child) => child.unMount());
  }

  public setProps(props: Partial<P>): Component<P, C> {
    if (!this.host) return this;
    this.props = { ...this.props, ...props };
    this.rerenderByProps(this.host, this.props);
    return this;
  }

  public setChildren(children: C[]): Component<P, C> {
    if (!this.host) return this;
    this.rerenderByChildren(this.host, this.children, children);
    this.children = children;
    return this;
  }

  public unMount(): void {
    if (!this.host) return;

    this.clear();
    this.removeChildren(this.children);
    this.children = [];
    this.host.remove();
    this.host = null;
    this.parent = null;
  }

  public render(target: Element | null, order?: RenderOrder): void {
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
  }
}
