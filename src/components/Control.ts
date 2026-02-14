import ComponentBase, { type Component } from './component-base.js';
import { CLASS_NAME } from '../constants.js';

export const ControlType = {
  text: 'text',
  url: 'url',
  textarea: 'textarea',
} as const;

export type ControlType = (typeof ControlType)[keyof typeof ControlType];

type ControlProps = {
  label: string;
  type?: ControlType;
  initValue?: string;
  placeholder?: string;
};

export interface Control extends Component<ControlProps, Component<any, any>> {
  readonly label: string;
  readonly value: string;
  focus(): void;
  clear(): void;
}

export default class ControlComponent
  extends ComponentBase<HTMLParagraphElement, ControlProps, Component<any, any>>
  implements Control
{
  private controlEl: HTMLInputElement | HTMLTextAreaElement | null = null;
  private _value = '';

  constructor(initProps: ControlProps) {
    super(initProps);
    this._value = initProps.initValue ?? '';
    this.appendChildren(this.host!, initProps);
  }

  public get label(): string {
    return this.props.label;
  }

  public get value(): string {
    return this._value;
  }

  private get controlId(): string {
    return this.props.label.toLowerCase();
  }

  public focus(options?: FocusOptions | undefined): void {
    this.controlEl?.focus(options);
  }

  public clear(): void {
    this._value = '';
  }

  protected override release(): void {
    this.controlEl?.remove();
    this.controlEl = null;
  }

  protected createHostElement(_: ControlProps): HTMLParagraphElement {
    const hostEl = document.createElement<'p'>('p');
    hostEl.className = CLASS_NAME.control;
    return hostEl;
  }

  private appendChildren(
    host: HTMLParagraphElement,
    props: ControlProps,
  ): void {
    const labelEl = document.createElement<'label'>('label');
    labelEl.className = CLASS_NAME.controlLabel;
    labelEl.htmlFor = this.controlId;
    labelEl.textContent = this.props.label;

    this.controlEl = this.createControlElement(props);
    host.append(labelEl, this.controlEl);
  }

  private createControlElement(
    props: ControlProps,
  ): HTMLInputElement | HTMLTextAreaElement {
    const { type = ControlType.text, placeholder } = props;
    let controlEl: HTMLInputElement | HTMLTextAreaElement;

    if (type !== ControlType.textarea) {
      controlEl = document.createElement<'input'>('input');
      controlEl.type = type;
    } else {
      controlEl = document.createElement<'textarea'>('textarea');
      controlEl.classList.add(CLASS_NAME.scroll);
    }

    controlEl.id = this.controlId;
    controlEl.classList.add(CLASS_NAME.controlInput);
    controlEl.placeholder = placeholder ?? '';
    controlEl.value = this.value;
    controlEl.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      this._value = target.value;
    });

    return controlEl;
  }
}
