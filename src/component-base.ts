type Props = Record<string, any>;
export type RenderOrder = 'first' | 'last';

export interface Component<P extends Props, C extends Component<any, any>> {
  setProps(props: P): Component<P, C>;
  setChildren(children: C[]): Component<P, C>;
  unMount(): void;
  render(target: Element | null, order?: RenderOrder): void;
}

export default abstract class ComponentBase<
  P extends Props,
  E extends HTMLElement,
  C extends Component<any, any>,
> implements Component<P, C> {
  private parent: Element | null = null;
  private host: E | null = null;
  private props: P | undefined;
  private children: C[] = [];

  constructor(props: P) {
    this.host = this.createHostElement(props);
    this.props = props;
  }

  protected abstract createHostElement(props: P): E;
  protected abstract refreshHost(props: P): void;

  protected clear(): void {}

  protected renderChildren(host: E | null): void {
    this.children.forEach((child) => child.render(host));
  }

  public setProps(props: P): Component<P, C> {
    this.props = { ...this.props, ...props };
    this.refreshHost(this.props);
    return this;
  }

  public setChildren(children: C[]): Component<P, C> {
    this.children = children;
    this.renderChildren(this.host);
    return this;
  }

  public unMount(): void {
    if (!this.host) return;

    this.clear();
    this.children.forEach((child) => child.unMount());
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
