import type { Control } from './Control';
import ComponentBase, { type Component } from './component-base.js';
import ButtonComponent, {
  ButtonSize,
  ButtonType,
  type Button,
} from './Button.js';
import { CLASS_NAME } from '../constants.js';

type FormData = Readonly<Record<string, string>>;
export type AddFormProps = Record<string, unknown>;

export interface AddForm extends Component<AddFormProps, Control> {
  setSubmitHandler(onSubmit: (data: FormData) => void): AddForm;
}

export default class AddFormComponent
  extends ComponentBase<HTMLFormElement, AddFormProps, Control>
  implements AddForm
{
  private controlArea: HTMLDivElement | null = null;
  private submitButton: Button | null = null;
  private onSubmit: (data: FormData) => void = () => {};

  constructor(initProps: AddFormProps) {
    super(initProps);
    this.appendChildren(this.host!);
  }

  private get isValid(): boolean {
    return this.children.every((child) => !!child.value);
  }

  public setSubmitHandler(onSubmit: (data: FormData) => void): AddForm {
    this.onSubmit = onSubmit;
    return this;
  }

  protected createHostElement(): HTMLFormElement {
    const hostEl = document.createElement<'form'>('form');
    hostEl.className = CLASS_NAME.form;
    hostEl.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      if (this.isValid) {
        this.onSubmit(this.getFormData());
      }
    });

    return hostEl;
  }

  private appendChildren(host: HTMLFormElement): void {
    this.controlArea = document.createElement<'div'>('div');
    this.controlArea.className = CLASS_NAME.controlArea;
    host.append(this.controlArea);

    this.submitButton = new ButtonComponent({
      type: ButtonType.submit,
      label: 'ADD',
      size: ButtonSize.s,
      classList: [CLASS_NAME.addButton],
    }).render(host);
  }

  protected override renderChildren(
    _: HTMLFormElement,
    children: Control[],
  ): void {
    super.renderChildren(this.controlArea, children);
  }

  protected override release(): void {
    this.controlArea?.remove();
    this.controlArea = null;
    this.submitButton?.unMount();
    this.submitButton = null;
  }

  private getFormData(): FormData {
    return this.children.reduce<FormData>(
      (data, child) => ({ ...data, [child.label]: child.value }),
      {},
    );
  }
}
