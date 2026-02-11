import type { Component, Props } from '../interface';
import type ControlComponent from './Control';
import { CLASS_NAME } from '../constants.js';
import ButtonComponent, { ButtonSize, ButtonType } from './Button.js';

type FormData = Readonly<{ [K in string]: string }>;
type FormProps = Props<{}>;

interface Form extends Component<FormProps> {
  setControls(...controls: ControlComponent[]): Form;
  onSubmit(formData: FormData): void;
}

export default class FormComponent implements Form {
  private formEl: HTMLFormElement | null = null;
  private controls: ControlComponent[] = [];
  private button = new ButtonComponent({
    type: ButtonType.submit,
    label: 'ADD',
    size: ButtonSize.s,
    classList: [CLASS_NAME.addButton],
  });

  private handleSubmit = (e: Event) => {
    e.preventDefault();
    if (this.isValid) {
      this.onSubmit(this.getFormData());
    }
  };

  constructor(
    public readonly props: FormProps,
    public onSubmit: (formData: FormData) => void,
  ) {
    this.formEl = this.createFormEl(this.props);
    this.mount();
  }

  public setControls(...controls: ControlComponent[]): FormComponent {
    this.controls = controls;
    return this;
  }

  public mount(): void {}

  public unMount(): void {
    if (!this.formEl) return;

    this.controls.forEach((ctrl) => ctrl.unMount());
    this.controls = [];
    this.button?.unMount();
    this.formEl.removeEventListener('submit', this.handleSubmit);
    this.formEl.remove();
    this.formEl = null;
  }

  public render(target?: Element | null): void {
    if (this.formEl === null) {
      this.formEl = this.createFormEl(this.props);
    }

    this.controls.forEach((ctrl) => ctrl.render(this.formEl));
    this.button.render(this.formEl);
    const parent = target ?? document.body;
    parent.append(this.formEl);
  }

  private get isValid(): boolean {
    return this.controls.every((ctrl) => !!ctrl.value);
  }

  private getFormData(): FormData {
    return this.controls.reduce<FormData>(
      (data, ctrl) => ({ ...data, [ctrl.label]: ctrl.value }),
      {},
    );
  }

  private createFormEl(_: FormProps): HTMLFormElement {
    const formEl = document.createElement<'form'>('form');
    formEl.className = CLASS_NAME.form;
    formEl.addEventListener('submit', this.handleSubmit);
    return formEl;
  }
}
