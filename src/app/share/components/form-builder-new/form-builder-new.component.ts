import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ValidatorsDict} from "./form-builder-new-model";
import {
  DatePipe,
  DecimalPipe,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault
} from '@angular/common';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatInput, MatInputModule, MatLabel, MatSuffix} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatSelect} from '@angular/material/select';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOption} from '@angular/material/core';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';

interface FormObject {
  [key: string]: any;
}

@Component({
  selector: 'app-form-builder-new',
  templateUrl: './form-builder-new.component.html',
  imports: [
    NgIf,
    NgClass,
    NgForOf,
    ReactiveFormsModule,
    NgStyle,
    MatCard,
    MatCardContent,
    MatLabel,
    MatLabel,
    MatFormField,
    MatFormField,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatSuffix,
    MatInput,
    MatSuffix,
    MatLabel,
    MatFormField,
    MatButton,
    MatSelect,
    MatSelect,
    MatOption,
    MatInputModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatNativeDateModule,
    MatSlideToggle,
  ],
  styleUrl: 'form-builder-new.component.css',
})
export class FormBuilderNewComponent implements OnInit, OnChanges {

  @Input() items: any[] = [];
  @Input() formAppearance = 'outline';
  @Input() saveButtonName = 'Save';
  @Input() fixedButton = true;
  @Input() showSaveButton = true;
  @Input() showResetButton = false;
  @Input() checkForValid = true;
  @Input() buttonWidth: any;
  @Input() patchValue: any;
  @Input() fileDownloadPath: any;
  @Output() formResult: EventEmitter<any> = new EventEmitter<any>();
  @Output() formChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() callerStatus: any = {closed: true};
  @Input() loadingName: string = '';
  @Input() loadingLoader: "dots-loader" = 'dots-loader';
  @Input() alert: string = '';

  isFormData: boolean = false;

  reportImages: any = {};

  form!: FormGroup;

  editorConfig = {
    toolbar: {
      items: [
        'bold',
        'italic',
        'underline',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'undo',
        'redo',
      ]
    },
    image: {
      toolbar: [
        'imageStyle:full',
        'imageStyle:side',
        '|',
        'imageTextAlternative'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    language: {
      ui: 'en',
      content: 'ar'
    },
    resize_enabled: true,
    width: 250,
    height: 500
  };
  // public Editor = ClassicEditor;

  acTimeOut: any = {};
  acSelected: any = {};
  acOptions: any = {};
  acStatus: any = {};


  // files: any = {};
  //
  // prePathImage: string = `${environment.path}..`

  otpArray = Array(6); // برای ساخت ۶ input
  otpDigits: string[] = Array(6).fill('');

  onOtpInput(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, ''); // فقط عدد

    if (value) {
      this.otpDigits[index] = value;
      if (index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        nextInput?.focus();
      }
    }

    this.updateOtpFormControl();
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  }

  updateOtpFormControl(): void {
    const code = this.otpDigits.join('');
    const control = this.form.get('code');
    if (control) {
      control.setValue(code);
    }
  }


  constructor(private formBuilder: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.items?.length && !this.items[0]?.fields) {
      this.items = [
        {
          label: "",
          classList: "col-12 col-md-12 my-2 card-none",
          fields: this.items
        },
      ];
    }
    this.patchValueF();
  }

  ngOnInit(): void {
    this.createForm();
  }

  patchValueF(): void {
    if (this.patchValue) {
      this.form?.patchValue(this?.patchValue);
      for (const item of this.items) {
        for (const field of item.fields) {
          if (field?.type === 'password') field.hidePassword = true;
          if (field?.type === 'autoComplete') {
            let val = this.patchValue[field.formControlName] || [];
            if (typeof val !== 'object' || !Array.isArray(val)) val = [val];
            val = val.map((el: any) => {
              if (typeof el !== 'object') {
                let aco: any = JSON.parse(localStorage.getItem('acOptions') || '{}');
                if (field.formControlName in aco) {
                  let item: any = aco[field.formControlName].find((ell: any) => ell.id == el);
                  if (item) {
                    return item;
                  }
                } else {
                  return {
                    username: el,
                    id: el
                  }
                }
              }
              return el
            });
            this.acSelected[field?.formControlName] = new Set(val);
            this.form?.get(field.formControlName)?.setValue('');
          } else if (field?.type === 'file' && field?.isFile) {
            // if (this.patchValue[field.formControlName] && !Array.isArray(this.patchValue[field.formControlName])) this.patchValue[field.formControlName] = [this.patchValue[field.formControlName]]
            // this.files[field.formControlName] = new Set(this.patchValue[field.formControlName] || []);
          } else if (field?.isFile) {
            this.form?.get(field.formControlName)?.setValue(this.patchValue[field.formControlName]);
          }
        }
      }
    }
  }

  getFields(item: any): any[] {
    return item.fields.filter((el: any) => !el?.hidden);
  }

  createForm(): void {
    const group: FormObject = {};
    for (const item of this.items) {
      for (const field of item.fields.filter((el: any) => !el?.readOnly)) {
        if (field?.type === 'password') field.hidePassword = true;
        if (field.type === 'autoComplete') this.setAsAutoComplete(field);
        this.isFormData = (field.type === 'image' || this.isFormData);
        const validators = this.setValidators(field.validators);
        // const value = JSON.parse(JSON.stringify(field?.default || (field?.type === 'file' && field?.isFile) ? JSON.stringify([]) : ''));
        const value = JSON.parse(JSON.stringify(field?.default || ''));
        if (field?.type === 'file' && field?.isFile) {
          // if (field?.default && !Array.isArray(field?.default)) field.default = [field?.default];
          // this.files[field.formControlName] = new Set(field?.default || []);
        }
        group[field.formControlName] = [{value: value, disabled: field?.disabled}, validators];
        if (field?.optionsApi) {
          field?.optionsApi()?.subscribe(
            (response: any) => {
              if (field?.responseFunction) response = field?.responseFunction(response);
              if (field?.optionsApiForEach) response?.results.forEach(field?.optionsApiForEach);
              field.options = response?.results;
              if (field.options && field.isAutoComplete) {
                field.tempOptions = field.options;
              }
            }, (error: any) => {
            }
          );
        }
        if (field.options && field.isAutoComplete) {
          field.tempOptions = field.options;
        }
      }
    }
    this.form = this.formBuilder.group(group);
    this.formChange.emit(this.form);
    this.patchValueF();

    for (let item of this.items) {
      for (let field of this.acFields(item)) {
        this.form?.get(field.formControlName)?.valueChanges.subscribe(result => {
          if ('valueChanges' in field) field?.valueChanges(result);
          if (field.type === 'autoComplete') {
            clearTimeout(this.acTimeOut[field?.formControlName]);
            if (!!result) {
              this.acTimeOut[field?.formControlName] = setTimeout(() => {
                field?.apiFunction(result)?.subscribe(
                  (response: any) => {
                    this.acOptions[field?.formControlName] = response?.results;

                    let aco: any = JSON.parse(localStorage.getItem('acOptions') || '{}');
                    if (field?.formControlName in aco) aco[field?.formControlName].push(...response?.results);
                    else aco[field?.formControlName] = response?.results;
                    localStorage.setItem('acOptions', JSON.stringify(aco));
                  }
                );
              }, 1000);
            } else this.acOptions[field?.formControlName] = [];
          }
        });
      }
    }

  }

  get allFields(): any{
    let fields: any[] = []
    this.items.forEach((el: any) => {
      fields.push(...el.fields)
    })
    return fields;
  }

  acFields(item: any): any[] {
    return item.fields.filter((el: any) => el.type === 'autoComplete');
  }

  fileFields(item: any): any[] {
    return item.fields.filter((el: any) => el.type === 'file');
  }

  acOptionValues(field: any, option: any): any {
    let str: any[] = [];
    if (typeof option === 'object') {
      for (let i of field?.acValues) {
        if (i in option) {
          str.push(option[i]);
        }
      }
      return str.join(' - ');
    }
    return '';
  }

  setAsAutoComplete(field: any): void {
    this.acTimeOut[field?.formControlName] = '';
    this.acSelected[field?.formControlName] = new Set();
    this.acOptions[field?.formControlName] = [];
    this.acStatus[field?.formControlName] = {closed: true};
  }

  // addAutoComplete(event: MatAutocompleteSelectedEvent, item: any): void {
  //   this.acSelected[item?.formControlName].add(event.option.value);
  //   this.form.get(item?.formControlName)?.setValue('');
  //   if (this.canAddAc(item)) this.form.get(item?.formControlName)?.enable(); else  this.form.get(item?.formControlName)?.disable();
  // }
  //
  // removeAutoComplete(field: any, formControlName: any): void {
  //   this.acSelected[formControlName].delete(field);
  // }

  canAddAc(field: any): boolean {
    return field?.type !== 'autoComplete' || (field?.acMulti || this.acSelected[field?.formControlName]?.size < 1)
  }

  resetForm(): void {
    this.patchValue = {};
    this.createForm();
    if (this.form.valid) this.returnForm();
  }


  returnForm(): void {
    this.patchValue = {...this.form.value};
    let ext: any = {};
    for (let item of this.items) {
      for (let field of this.acFields(item)) {
        let value: any;
        if (field?.acMulti) {
          value = [];
          this.acSelected[field?.formControlName].forEach((el: any) => {
            value.push(el.id);
          });
        } else {
          [value] = this.acSelected[field?.formControlName];
          value = value?.id;
        }
        this.form.get(field?.formControlName)?.setValue(value);
        ext[field?.formControlName] = value;
      }
      for (let field of this.fileFields(item)) {
        // let value: any = [...this.files[field?.formControlName]].map((el: any) => el.key);
        // if (!field?.isMultiple) value = value[0] || ''
        // this.form.get(field?.formControlName)?.setValue(value);
        // ext[field?.formControlName] = value;
      }
    }
    // this.formResult.emit(this.form);
    let formVal = {...this.form.value};
    formVal = Object.assign(formVal, ext);
    Object.keys(formVal).forEach((key: any) => {
      formVal[key] = (formVal[key]?.toISOString) ? formVal[key]?.toISOString() : formVal[key];
    });
    console.log(formVal)
    this.formResult.emit((this.isFormData) ? this.setFormValues(formVal) : {value: formVal});
  }

  setValidators(validators: any[] = []): any[] {
    let list: any[] = [];
    validators?.forEach((el: any) => {
      if (typeof el === "string")
        el = ValidatorsDict[el];
      list.push(el)
    });
    return list;
  }

  setFormValues<T>(formValue: any) {
    const formData = new FormData();
    Object.keys(formValue).forEach((key: any) => {
      formData.set(key, formValue[key]);
    });
    return {value: formData};
  }

  onKey(event: any, sectionIndex: any, itemIndex: any): any {
    // if (!event?.target?.value) {
    //   this.items[sectionIndex].fields[itemIndex].options = this.items[sectionIndex].fields[itemIndex]?.tempOptions;
    // }
    let opts = this.items[sectionIndex].fields[itemIndex]?.tempOptions;
    // opts = this.items[sectionIndex].fields[itemIndex]?.tempOptions;
    const filterValue = event?.target?.value.toLowerCase();
    opts = opts?.filter((option: any) => option.name.toLowerCase().includes(filterValue));
    this.items[sectionIndex].fields[itemIndex].options = opts;
  }

  triggerFileSelect(id: string): void {
    document.getElementById(id)?.click();
  }

  addFileData(files: any, formControlName: string): void {
    const file = files.target.files.item(0);
    const reader = new FileReader();
    if (formControlName) {
      // this.fileName = files.target.files.item(0)?.name;
      reader.onload = e => this.reportImages[formControlName] = reader.result;
      reader.readAsDataURL(file);
    }
    this.form.get(formControlName)?.patchValue(files.target.files.item(0));
  }

  // setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, item: any) {
  //   if (item?.selectMonth) {
  //     this.form.get(item?.formControlName)?.setValue(normalizedMonthAndYear);
  //     datepicker.close();
  //   }
  // }

  isChecked(formControl: any, options: any): boolean {
    return formControl.value && options.length
      && formControl.value.length === options.length;
  }

  isIndeterminate(formControl: any, options: any): boolean {
    return formControl.value && options.length && formControl.value.length
      && formControl.value.length < options.length;
  }

  // toggleSelection(change: MatCheckboxChange, formControl: any, options: any): void {
  //   if (change.checked) {
  //     formControl.setValue(options.map((el: any) => el?.value));
  //   } else {
  //     formControl.setValue([]);
  //   }
  // }

  genRandHex(size: number=6): string{
    return `#${[...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  }

  download(file: any): void {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', file.url);
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  bytesToSize(bytes: any): any {
    if (bytes == 0) return '0 Byte';
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    var i = Number(Math.floor(Math.log(bytes) / Math.log(1024)));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // uploadedFile(item: any, event: any): void{
  //   // console.log(event)
  //   this.files[item?.formControlName].add(event);
  //   this.form.get(item?.formControlName)?.setValue('1');
  //   // console.log(this.files[item?.formControlName]);
  //
  //   // form.get(item?.formControlName)?.setValue(form.get(item?.formControlName)?.value.push($event));
  // }

  // getFiles(item: any): any {
  //   return [...this.files[item.formControlName]]
  // }

  focusout(searchInput: any, si: any, i: any): void{
    setTimeout(()=>{searchInput.value='';this.onKey({target:{value:''}}, si, i)}, 100)
  }


  protected readonly length = length;
  saveButtonColor: string | null | undefined;

  patchValidatePass(group: FormGroup){
    const pass = group.get('password')?.value;
    const accept  = group.get('confirm_password')?.value;
    return pass === accept ? null : { mismatch: true };
  }
}
