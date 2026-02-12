import type { Component, Props } from '../../interface';
import { CLASS_NAME, FIGURE_SIZE } from '../../constants.js';

type VideoContentProps = Props<{
  url: string;
  title?: string;
  width?: number;
  height?: number;
}>;

interface VideoContent extends Component<VideoContentProps> {}

export default class VideoContentComponent implements VideoContent {
  private iframeEl: HTMLIFrameElement | null = null;

  constructor(public readonly props: VideoContentProps) {
    this.iframeEl = this.createIframeEl(this.props);
    this.mount();
  }

  public mount(): void {}

  public unMount(): void {
    if (!this.iframeEl) return;

    this.iframeEl.remove();
    this.iframeEl = null;
  }

  render(target?: Element | null): void {
    if (this.iframeEl === null) {
      this.iframeEl = this.createIframeEl(this.props);
    }

    const parent = target ?? document.body;
    parent.append(this.iframeEl);
  }

  private createIframeEl(props: VideoContentProps): HTMLIFrameElement {
    const {
      url,
      title = '',
      width = FIGURE_SIZE.width,
      height = FIGURE_SIZE.height,
    } = props;

    const iframeEl = document.createElement<'iframe'>('iframe');
    iframeEl.className = CLASS_NAME.contentFigure;
    iframeEl.src = url;
    iframeEl.title = title;
    iframeEl.width = width.toString();
    iframeEl.height = height.toString();
    return iframeEl;
  }
}
