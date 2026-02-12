export interface Component<P extends Props<{}>> {
  readonly props?: P;
  mount(): void;
  unMount(): void;
  render(target?: Element | null, order?: RenderOrder): void;
}

export type Props<T> = Readonly<T & { children?: Component<{}>[] }>;
export type RenderOrder = 'first' | 'last';
