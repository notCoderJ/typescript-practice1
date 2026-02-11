export interface Component<P> {
  readonly props?: P;
  mount(): void;
  unMount(): void;
  render(target?: Element | null): void;
}
