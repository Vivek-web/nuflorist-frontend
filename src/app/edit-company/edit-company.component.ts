import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  CompanyForm: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService, private Router: Router, private router: ActivatedRoute, private Spinner: NgxSpinnerService) { }
  isValidFormSubmitted = null;
  submitted = false;
  valueofItem = 0;
  countries = [];
  states = [];
  States = []
  V_Country: number;
  S_Country: number;
  preview = [];
  Preview = true;
  isalloted = [];
  storemessage = [];
  ownermessage = [];
  contactmessage = [];
  emailmessage = [];
  addressmessage = [];
  countrymessage = [];
  statemessage = [];
  citymessage = [];
  zipmessage = [];

  ngOnInit(): void {

    this.router.paramMap.subscribe(params => {
      this.userService.getCompanyinfo(params.get('id')).subscribe((data: any) => {
        console.log(data.company_info.Stores);
        const editCompanyId = params.get('id')
        localStorage.setItem('editCompanyId', editCompanyId);
        this.V_Country = data.company_info.country
        this.userService.getRegions(this.V_Country).subscribe(res => {
          this.states = res.regions;
        })

        this.CompanyForm.patchValue(data.company_info);
        this.CompanyForm.setControl('Stores', this.setExistingStore(data.company_info.Stores));
      })
    })

    this.userService.getcountries().subscribe((data: any) => {
      this.countries = data.countries;
    });

    // this.getStates()





    this.CompanyForm = this.fb.group({
      company_id: ['',],
      company_name: ['', Validators.required],
      owner_name: ['', Validators.required],
      contact_number: ['', [Validators.required, Validators.minLength(5)]],
      email_Address: ['', Validators.required],
      address_line1: ['', Validators.required],
      address_line2: [null],
      country: ['', Validators.required],
      State: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      Stores: this.fb.array([])

    });

  }
  ManageStores(): FormGroup {
    return this.fb.group({
      Store_id: [null],
      Storeimage: [null],
      store_name: [null,Validators.required],
      owner_name: [null,Validators.required],
      contact_number: [null,Validators.required],
      email_Address: [null,Validators.required],
      address_line1: [null,Validators.required],
      address_line2: [null],
      country: [null,Validators.required],
      State: [null,Validators.required],
      city: [null,Validators.required],
      zip: [null,Validators.required],
      isAlloted: [null]
    });
  }


  setExistingStore(ExistingStore): FormArray {
    const formArray = new FormArray([]);
    ExistingStore.forEach((s, id) => {
      formArray.push(this.fb.group({
        Storeimage: '',
        Store_id: s.id,
        store_name: s.store_name,
        owner_name: s.owner_name,
        contact_number: s.contact_number,
        email_Address: s.email_Address,
        address_line1: s.address_line1,
        address_line2: s.address_line2,
        country: s.country,
        State: s.State,
        city: s.city,
        zip: s.zip,
        isAlloted: s.isAlloted

      }));
      this.changeStateStore(s.country, id);
      this.imagePreview(s.Storeimage, id);
      this.Alloted(s.isAlloted, id)

    });

    return formArray;
  }

  imagePreview(image, id) {
    this.preview[id] = image;

  }

  Alloted(isAlloted, id) {
    this.isalloted[id] = isAlloted;
    console.log(this.isalloted)


  }

  addNewRow() {
    this.StoreArray.push(this.ManageStores());
    this.Preview = false
  }


  remove(id) {
    console.log(id);
    const editCompanyId = localStorage.getItem('editCompanyId')

    if (confirm("Are you sure to delete?")) {
      this.Spinner.show();
      this.userService.deleteStore(editCompanyId, id).subscribe((res) => {
        console.log(res);
        this.Spinner.hide();
        if(res.status == 1 ){
          this.Router.navigate(['/account']);   

        }
      })
    }

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
    // localStorage.setItem('country.id', event);
    this.userService.getRegions(event).subscribe(res => {
      this.States[i] = res.regions;
    })

  }

  checkInput(input,index){
    if(input == 'storeName')
    this.storemessage[index] = '';
    if(input == 'ownrname')
    this.ownermessage[index] = '';
    if(input == 'contactNo')
    this.contactmessage[index] = '';
    if(input == 'email')
    this.emailmessage[index] = '';
    if(input == 'address')
    this.addressmessage[index] = '';
    if(input == 'country')
    this.countrymessage[index] = '';
    if(input == 'state')
    this.statemessage[index] = '';
    if(input == 'city')
    this.citymessage[index] = '';
    if(input == 'zip')
    this.zipmessage[index] = '';
    }
    

  selectImage(event, i) {
    let file = event.target.files[0];

    console.log(file);
    this.valueofItem = i
    // File Preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.preview[i] = reader.result as string;
      this.CompanyForm['controls']['Stores']['controls'][this.valueofItem]['controls'].Storeimage.patchValue(e.target.result);
      this.Preview = true;
    }
    reader.readAsDataURL(file)

  }


  get f() { return this.CompanyForm.controls; }


  Submit() {
    this.isValidFormSubmitted = true;
    console.log(this.CompanyForm.value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.CompanyForm.invalid) {
      console.log('inside')
      return;
    }
    
    let formData = this.CompanyForm.value;
    let storedata = formData.Stores
    storedata.forEach((value, index) => {
      if (value.store_name == '' || value.store_name == null ) {
        this.isValidFormSubmitted = false;
        this.storemessage[index] = 'Store name required';
      }
      if (value.owner_name == '' || value.owner_name == null) {
        this.isValidFormSubmitted = false;
        this.ownermessage[index] = 'Owner name required';
      }
      if (value.contact_number == '' || value.contact_number == null ) {
        this.isValidFormSubmitted = false;
        this.contactmessage[index] = 'Contact No required';
      }
      if(value.contact_number !== null){
        if(value.contact_number.length < 8){
          this.isValidFormSubmitted = false;
         this.contactmessage[index] = 'Minimum length should be 8 digits';
        }   

      }
     
      if (value.email_Address == '' || value.email_Address == null ) {
        this.isValidFormSubmitted = false;
        this.emailmessage[index] = 'Email Address required';
      }
      if (value.address_line1 == '' || value.address_line1 == null) {
        this.isValidFormSubmitted = false;
        this.addressmessage[index] = 'Address Line 1 required';
      }
      if (value.country == ''  || value.country == null) {
        this.isValidFormSubmitted = false;
        this.countrymessage[index] = 'Country name required';
      }
      if (value.State == '' || value.State == null) {
        this.isValidFormSubmitted = false;
        this.statemessage[index] = 'State name required';

      }
      if (value.city == '' || value.city == null) {
        this.isValidFormSubmitted = false;
        this.citymessage[index] = 'City name required';
      }
      if (value.zip == '' || value.zip == null) {
        this.isValidFormSubmitted = false;
        this.zipmessage[index] = 'Zip Code name required';
      }

    })
    if(this.isValidFormSubmitted){
    this.Spinner.show();
    this.isValidFormSubmitted = true;
    this.userService.updateCompanyPlusStore(this.CompanyForm.value).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.Spinner.hide();
        this.Router.navigate(['/account']);
      }

    })

  }

  }

}
