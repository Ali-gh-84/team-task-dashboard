import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MatChipInput} from "@angular/material/chips";

@Component({
  selector: 'app-form-builder-auto-complete',
  templateUrl: './form-builder-auto-complete.component.html',
  styleUrls: ['./form-builder-auto-complete.component.scss']
})
export class FormBuilderAutoCompleteComponent {

  @ViewChild('chipInput') chipInput: any;

  @Input() item: any;
  @Input() acStatus: any;
  @Input() acSelected: any;
  @Input() acOptions: any;
  @Input() acOptionValues: any;
  @Input() form?: FormGroup;
  // @Input() canAddAc: any;
  @Output() addAutoComplete: EventEmitter<any> = new EventEmitter<any>();

  removeAutoComplete(field: any, item: any): void {
    this.acSelected[item?.formControlName].delete(field);
    if (this.canAddAc(item)) this.form?.get(item?.formControlName)?.enable(); else  this.form?.get(item?.formControlName)?.disable();
  }

  canAddAc(field: any): boolean {
    return field?.type !== 'autoComplete' || (field?.acMulti || this.acSelected[field?.formControlName]?.size < 1)
  }

  addAutoCompleteEmit(event: any){
    this.addAutoComplete.emit(event);
    this.chipInput.nativeElement.value = '';
  }
}
