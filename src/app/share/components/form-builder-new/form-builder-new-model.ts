import {Validators} from "@angular/forms";

export class FormBuilderNewModel {
  type: any; // select, number, text, tel, date;
  label: any;
  formControlName: any;
  validators: any; // array or null;
  hint: any;
  options: any; // array or null;
  required = false;
  isTextArea = false;
  isMultiple = false;
  isAutoComplete = false;
  disabled = false;
  isFile = false;
  fileLink = false;
  isCkEditor = false;
  classList = '';
  dirLtr = false;
  sideBar = false;
}


export class FormBuilderSelectOption {
  name: any;
  value: any;
}

export var ValidatorsDict: any = {
  "Required": Validators.required
}
