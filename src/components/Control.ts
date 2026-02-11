import type { Component, Props } from '../interface';
import { CLASS_NAME } from '../constants.js';

export const ControlType = {
  text: 'text',
  url: 'url',
  textarea: 'textarea',
} as const;

export type ControlType = (typeof ControlType)[keyof typeof ControlType];

type ControlProps = Props<{
  label: string;
  initValue?: string;
  placeholder?: string;
}>;

export interface Control extends Component<ControlProps> {
  readonly label: string;
  readonly value: string;
  setType(type: ControlType): Control;
  clear(): void;
  focus(): void;
}

export default class ControlComponent implements Control {
  private controlEl: HTMLParagraphElement | null = null;
  private inputEl: HTMLInputElement | HTMLTextAreaElement | null = null;
  private _type: ControlType = ControlType.text;
  private _label = '';
  private _value = '';
  private handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    this._value = target.value;
  };

  constructor(public readonly props: ControlProps) {
    this._label = this.props.label;
    this.controlEl = this.createControlEl(this.props);
    this.mount();
  }

  public get label(): string {
    return this._label;
  }

  public get value(): string {
    return this._value;
  }

  public mount(): void {}

  public unMount(): void {
    if (!this.inputEl && !this.controlEl) return;

    this.inputEl?.removeEventListener('change', this.handleChange);
    this.inputEl?.remove();
    this.controlEl?.remove();

    this.inputEl = null;
    this.controlEl = null;
    this.clear();
  }

  public setType(type: ControlType): ControlComponent {
    this._type = type;
    return this;
  }

  public focus(options?: FocusOptions | undefined): void {
    this.inputEl?.focus(options);
  }

  public clear(): void {
    this._value = '';
  }

  public render(target?: Element | null): void {
    if (this.controlEl === null) {
      this.controlEl = this.createControlEl(this.props);
    }

    const parent = target ?? document.body;
    parent.append(this.controlEl);
  }

  private createControlEl(props: ControlProps): HTMLParagraphElement {
    const controlEl = document.createElement<'p'>('p');
    controlEl.className = CLASS_NAME.control;

    const labelEl = document.createElement<'label'>('label');
    labelEl.className = CLASS_NAME.controlLabel;
    labelEl.htmlFor = this.props.label.toLowerCase();
    labelEl.textContent = this.props.label;

    this.inputEl = this.createInputEl(props);
    controlEl.append(labelEl, this.inputEl);
    return controlEl;
  }

  private createInputEl(
    props: ControlProps,
  ): HTMLInputElement | HTMLTextAreaElement {
    let inputEl: HTMLInputElement | HTMLTextAreaElement;
    const { label, initValue, placeholder = '' } = props;

    if (this._type !== ControlType.textarea) {
      inputEl = document.createElement<'input'>('input');
      inputEl.type = this._type;
    } else {
      inputEl = document.createElement<'textarea'>('textarea');
      inputEl.classList.add(CLASS_NAME.scroll);
    }

    inputEl.id = label.toLowerCase();
    inputEl.classList.add(CLASS_NAME.controlInput);
    inputEl.placeholder = placeholder;
    inputEl.value = initValue ?? this.value;
    inputEl.addEventListener('change', this.handleChange);
    return inputEl;
  }
}
