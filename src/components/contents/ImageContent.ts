import type { Component, Props } from '../../interface';
import { CLASS_NAME, FIGURE_SIZE } from '../../constants.js';

type ImageContentProps = Props<{
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}>;

interface ImageContent extends Component<ImageContentProps> {}

export default class ImageContentComponent implements ImageContent {
  private imageEl: HTMLImageElement | null = null;

  constructor(public readonly props: ImageContentProps) {
    this.imageEl = this.createImageEl(this.props);
    this.mount();
  }

  public mount(): void {}

  public unMount(): void {
    if (!this.imageEl) return;

    this.imageEl.remove();
    this.imageEl = null;
  }

  render(target?: Element | null): void {
    if (this.imageEl === null) {
      this.imageEl = this.createImageEl(this.props);
    }

    const parent = target ?? document.body;
    parent.append(this.imageEl);
  }

  private createImageEl(props: ImageContentProps): HTMLImageElement {
    const {
      url,
      alt = '',
      width = FIGURE_SIZE.width,
      height = FIGURE_SIZE.height,
    } = props;

    const imageEl = document.createElement<'img'>('img');
    imageEl.className = CLASS_NAME.contentFigure;
    imageEl.src = url;
    imageEl.alt = alt;
    imageEl.width = width;
    imageEl.height = height;
    return imageEl;
  }
}
