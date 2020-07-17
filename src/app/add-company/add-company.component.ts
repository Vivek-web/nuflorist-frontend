import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit { 
  imagePreview: string = 'assets/images/account.png';
  CompanyForm: FormGroup;
  StoreForm: FormGroup;
  preview: string;
  url: string;
  urls = new Array<string>();
  Stores: FormArray;
  isValidFormSubmitted = null;
  valueofItem = 0;
  countries = [];
  states = [];
  States = []
  constructor(private fb: FormBuilder, private userService: UserService, private Router: Router, private spinner: NgxSpinnerService) { }
  submitted = false;
  ngOnInit(): void {
    if(localStorage.getItem('unllotesLinces') == 'yes'){
      this.Router.navigate(['/allot-licences'])
    }
    this.userService.getcountries().subscribe((data: any) => {
      console.log(data)
      this.countries = data.countries;
    });

    this.CompanyForm = this.fb.group({
      // company_id: [''],
      company_name: ['', Validators.required],
      owner_name: ['', Validators.required],
      contact_number: ['', [Validators.required, Validators.minLength(5)]],
      email_Address: ['', Validators.required],
      address_line1: ['', Validators.required],
      address_line2: [''],
      country: ['', Validators.required],
      city: ['', Validators.required],
      State: ['', Validators.required],
      zip: ['', Validators.required],
      Stores: this.fb.array([this.ManageStores()],
        [Validators.required])
    });
  }
  ManageStores(): FormGroup {
    return this.fb.group({
      Storeimage: [null],
      store_name: [null, Validators.required],
      owner_name: [null, Validators.required],
      contact_number: [null, [Validators.required, Validators.minLength(5)]],
      email_Address: [null, Validators.required],
      address_line1: [null, Validators.required],
      country: ['', Validators.required],
      address_line2: [null],
      city: [null, Validators.required],
      State: [null, Validators.required],
      zip: [null, Validators.required],
    });
  }


  // StoreName = this.CompanyForm['controls']['Stores']['controls'].get('store_name').value;


  addNewRow() {
    this.StoreArray.push(this.ManageStores());
  }


  remove(index: number) {
    this.StoreArray.removeAt(index);


  }

  get StoreArray(): FormArray {
    return <FormArray>this.CompanyForm.get('Stores'); 
  }

  changeState(event) {
    console.log(event);
    localStorage.setItem('country.id', event);
    this.userService.getRegions(event).subscribe(res => {
      this.states = res.regions;
    })

  }

  changeStateStore(event, i) {
    console.log(event);
    localStorage.setItem('country.id', event);
    this.userService.getRegions(event).subscribe(res => {
      this.States[i] = res.regions;
    })

  }


  selectImage(event, i) {
    let file = event.target.files[0];
    console.log(file);
    this.valueofItem = i
    // File Preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.CompanyForm['controls']['Stores']['controls'][this.valueofItem]['controls'].Storeimage.patchValue(e.target.result);
    }
    reader.readAsDataURL(file)

  }

  // convenience getter for easy access to form fields 
  get f() { return this.CompanyForm.controls; }

  Submit() {
    this.isValidFormSubmitted = false;
    console.log(this.CompanyForm.value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.CompanyForm.invalid) {
      return;
    }
    this.spinner.show();
    this.isValidFormSubmitted = true;
    this.userService.CreateCompanyAndStores(this.CompanyForm.value,).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.spinner.hide();
        this.Router.navigate(['/account']);
      }

    })

  }

}
