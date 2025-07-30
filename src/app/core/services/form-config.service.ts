import {Injectable, Input} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {

  @Input() formFields: {
    name: string,
    type: string,
    label: string,
    validator?: any,
    formName: any,
    options?: any,
  } [] = [];

  formPost!: FormGroup;

  constructor(private fb: FormBuilder) {}

  createForm() {
    let group: any = {}

    this.formFields.forEach(field => {
      if (field.type === 'op') {
        const defaultOption = field.options.find((opt: { name: string; }) => opt.name === 'Male')?.value || '';
        group[field.formName] = [defaultOption, field.validator];
      } else {
        group[field.formName] = ['', field.validator];
      }
    });
    this.formPost = this.fb.group(group)
  }

}
