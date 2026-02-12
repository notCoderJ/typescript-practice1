import type { Component, Props } from '../../interface';
import { CLASS_NAME } from '../../constants.js';

type TextContentProps = Props<{
  title: string;
  description?: string;
}>;

interface TextContent extends Component<TextContentProps> {}

export default class TextContentComponent implements TextContent {
  private sectionEl: HTMLElement | null = null;

  constructor(public readonly props: TextContentProps) {
    this.sectionEl = this.createSectionEl(this.props);
    this.mount();
  }

  public mount(): void {}

  public unMount(): void {
    if (!this.sectionEl) return;

    this.sectionEl.remove();
    this.sectionEl = null;
  }

  render(target?: Element | null): void {
    if (this.sectionEl === null) {
      this.sectionEl = this.createSectionEl(this.props);
    }

    const parent = target ?? document.body;
    parent.append(this.sectionEl);
  }

  private createSectionEl(props: TextContentProps): HTMLElement {
    const { title, description } = props;
    const sectionEl = document.createElement<'section'>('section');
    sectionEl.classList.add(CLASS_NAME.contentText, CLASS_NAME.scroll);

    const titleEl = document.createElement<'h2'>('h2');
    titleEl.className = CLASS_NAME.contentTitle;
    titleEl.textContent = title;
    sectionEl.prepend(titleEl);

    if (!!description) {
      const descEl = document.createElement<'p'>('p');
      descEl.textContent = description;
      sectionEl.append(descEl);
    }

    return sectionEl;
  }
}
