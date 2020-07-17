import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-reactive-sample',
  templateUrl: './reactive-sample.component.html',
  styleUrls: ['./reactive-sample.component.css']
})
export class ReactiveSampleComponent implements OnInit {

  states: Array<String> = ['AR', 'AL', 'CA', 'DC'];
  reactiveForm: FormGroup;
  user = { 'fname': 'Bob', 'lname': 'Jack' };
  constructor(private _fb: FormBuilder) { }

  ngOnInit() {

    // console.log('Initial Value', this.user);
    this.reactiveForm = this._fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, Validators.required],
      address: this._fb.group({
        addressType: [null, Validators.required],
        expiryDate: [null, this.expiryDateValidator],
        streetAddress: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipcode: [null, [Validators.required, Validators.pattern('^[0-9]{5}$')]]
      })
    });
  }

  triggerExpiryValidator() {
    this.expiryDate.updateValueAndValidity();
  }
  expiryDateValidator(control: AbstractControl) {
    if (control) {
      const group = <FormGroup>control.root.get('address');
      if (group) {
        const addControl = group.controls.addressType;
        if (addControl) {
          if (addControl.value === 'temporary') {
            if (control.value === null || control.value === undefined || control.value === '') {
              return {'date_error' : 'Date cannot be blank.'};
            }
          }
        }
      }
    }

    return null;
  }

  get zipcode() {
    const temp = <FormGroup>this.reactiveForm.controls.address;
    return temp.controls.zipcode;
  }

  get state() {
    const temp = <FormGroup>this.reactiveForm.controls.address;
    return temp.controls.state;
  }

  get city() {
    const temp = <FormGroup>this.reactiveForm.controls.address;
    return temp.controls.city;
  }

  get streetAddress() {
    const temp = <FormGroup>this.reactiveForm.controls.address;
    return temp.controls.streetAddress;
  }

  get addressType() {
    const temp = <FormGroup>this.reactiveForm.controls.address;
    return temp.controls.addressType;
  }

  get expiryDate() {
    const temp = <FormGroup>this.reactiveForm.controls.address;
    return temp.controls.expiryDate;
  }

  get firstName() {
    return this.reactiveForm.get('firstName');
  }

  get lastName() {
    return this.reactiveForm.get('lastName');
  }

  submitHandler() {
    console.log(this.reactiveForm);
    // console.log('Final Value', this.user);
  }

}
