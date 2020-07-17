import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, AbstractControl, ValidationErrors, FormGroupDirective } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Observable, empty } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { NgZone } from '@angular/core';
import { debounceTime, map, flatMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import * as $ from 'jquery';

@Component({
  selector: 'app-allot-licences',
  templateUrl: './allot-licences.component.html',
  styleUrls: ['./allot-licences.component.css']
})
export class AllotLicencesComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('fileInput') fileInput;
  @ViewChild('adminclose') adminclose;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  CompanyForm: FormGroup;
  StoreForm: FormGroup;
  AdminForm: FormGroup; 
  CompanySubmitted = false;
  StoreSubmitted = false;
  AdminSubmitted = false;
  SubscriptionSubmitted = true;
  preview: string;
  imagepreview = false;
  Companies = [];
  Stores = [];
  PurchasedProducts = [];
  AdminData = [];
  emailerror = '';
  subscriptionData: FormArray;
  SubscriptionForm: FormGroup
  companymessage = ''
  storemessage = ''
  adminmessage = ''
  countries = [];
  states = [];
  storehide = [];
  adminhide = [];
  selectedCompany = [];
  Adminmessage = [];
  allort;
  hide = null
  dropid = 0;
  selectedCompanies = [];
  Companymessage = [];
  Storemessage = [];
  selectedStores = [];
  selectedAdmins = [];
  selectedCompaniesAndstores = []
  companyid
  userexist:boolean = true;
  condtion:boolean = true; 
  constructor(private fb: FormBuilder, private userService: UserService, private Router: Router, private zone: NgZone, private Spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.Spinner.show();
    document.body.classList.add('orderbg'); 

    this.userService.UserPurchasedProducts().subscribe((res) => {
      this.Spinner.hide();
      // console.log(res);
      this.PurchasedProducts = res.purchased_products;

      this.SubscriptionForm.setControl('subscriptionData', this.setExistingStore(res.purchased_products));

      this.userService.getAdminUsers().subscribe((res) => {
        console.log(res);
        this.AdminData = res.admin_users;
      });

      this.userService.getUserCompanies().subscribe((res) => {
        this.Companies = res.companies;
        console.log(this.Companies);
      })

      this.callSelectedCompanies();


    })

    this.userService.getcountries().subscribe((data: any) => {
      this.countries = data.countries;
    })


    this.CompanyForm = this.fb.group({
      // company_id: [''],
      company_name: ['', Validators.required],
      owner_name: ['', Validators.required],
      contact_number: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      address_line1: ['', Validators.required],
      address_line2: [''],
      country: [null, Validators.required],
      city: ['', Validators.required],
      State: ['', Validators.required],
      zip: ['', Validators.required],

    });


    this.StoreForm = this.fb.group({
      // company_id: [companyId],
      Storeimage: [null, Validators.required],
      store_name: [null, Validators.required],
      owner_name: [null, Validators.required],
      contact_number: [null, [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      address_line1: [null, Validators.required],
      address_line2: [null],
      country: [null, Validators.required],
      city: [null, Validators.required],
      State: [null, Validators.required],
      zip: [null, Validators.required],
    })

    this.AdminForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['',],
      email: ['', [Validators.required, Validators.email], this.validateNameViaServer.bind(this)]
    })

    this.SubscriptionForm = this.fb.group({
      subscriptionData: this.fb.array([
        this.fb.group({
          SubscriptionId: [''],
          company_id: [Validators.required],
          store_id: ['', Validators.required],
          admin_id: ['', Validators.required]
        })
      ]),

    });
  }

  callSelectedCompanies() {
    if (localStorage.getItem('selectedCompanies') !== null) {
      const SelectedCompanies = JSON.parse(localStorage.getItem('selectedCompanies'));
      SelectedCompanies.forEach((value, index) => {
        this.storehide[index] = true
        this.adminhide[index] = true
        this.SubscriptionForm['controls']['subscriptionData']['controls'][index]['controls'].company_id.patchValue(value);

        if (localStorage.getItem('selectedStores') !== null) {
          this.userService.getUserStores(value).subscribe((res) => {
            console.log(res);
            this.Stores[index] = res.stores;

          })
          const selectedStores = JSON.parse(localStorage.getItem('selectedStores'));
          selectedStores.forEach((value1, index1) => {
           
            this.SubscriptionForm['controls']['subscriptionData']['controls'][index1]['controls'].store_id.patchValue(value1);
          })
        }

        if (localStorage.getItem('selectedAdmins') !== null) {
          const selectedAdmins = JSON.parse(localStorage.getItem('selectedAdmins'));
          selectedAdmins.forEach((value, index) => {

            this.SubscriptionForm['controls']['subscriptionData']['controls'][index]['controls'].admin_id.patchValue(value);

          })
        }
      });
    }

  }


  setExistingStore(skillSets): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        SubscriptionId: s.id,
        company_id: new FormControl([]),
        store_id: new FormControl([]),
        admin_id: new FormControl([])

      }));
    });

    return formArray;


  }
  CompanyResetValidation() {
    this.CompanyForm.reset()
  }

  CompanyReset(index, subscriptionid) {
    console.log(index);
    localStorage.setItem('companyindex', index);
    this.storehide[index] = true;
    this.adminhide[index] = true;
    localStorage.setItem('subscriptionid', subscriptionid)
    this.CompanyForm.reset()
    this.CompanySubmitted = false;
  }

  StoreAdd(index, subId) {
    console.log(this.preview)
    console.log(index);
    var  companyid 
    localStorage.setItem('subId', subId);
    localStorage.setItem('storeindex', index);
    this.selectedCompanies  = JSON.parse(localStorage.getItem('selectedCompanies'));
   companyid = this.selectedCompanies[index]
   localStorage.setItem('company_id',companyid);
    console.log(companyid)
    
  }

StoreReset(){

  this.preview = '';
  this.StoreForm.reset()
  this.StoreSubmitted = false;
  // this.StoreForm.patchValue({
  //   Storeimage: ''
  // });
  // this.StoreForm.get('Storeimage').updateValueAndValidity()
  // console.log(this.StoreForm.value)
  this.imagepreview = false;

}


  AdminReset(index, subId) {
    localStorage.setItem('AdminIndex', index);
    this.AdminForm.reset()
    this.AdminSubmitted = false;
  }

  get StoreArray(): FormArray {
    return <FormArray>this.SubscriptionForm.get('subscriptionData');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('orderbg');
  }



  dropdownrefresh() {
    this.userService.getUserCompanies().subscribe((res) => {
      this.Companies = res.companies;
      setTimeout(() => {
        const SelectedCompanies = JSON.parse(localStorage.getItem('selectedCompanies'));
        SelectedCompanies.forEach((value, index) => {
          this.storehide[index] = true;
          this.adminhide[index] = true;
          this.SubscriptionForm['controls']['subscriptionData']['controls'][index]['controls'].company_id.patchValue(value);
        })
      }, 500);
    })
   


  }

   storeRefresh(id) {

    const SelectedCompanies = JSON.parse(localStorage.getItem('selectedCompanies'));
    const storeindex = localStorage.getItem('storeindex')
    this.Storemessage[storeindex] = '';
    SelectedCompanies.forEach((value, index) => {
          this.userService.getUserStores(value).subscribe( (res) => {
        console.log(res);
        this.Stores[index] = res.stores;
        
        setTimeout(() => {
          const selectedStores = JSON.parse(localStorage.getItem('selectedStores'))
          selectedStores.forEach((storevalue, storeindex) => {
           
            this.SubscriptionForm['controls']['subscriptionData']['controls'][storeindex]['controls'].store_id.patchValue(storevalue);
            // window.location.reload()
          })
      

      },500)
    })

    })

  }

      AdminRefresh(id) {
    this.userService.getAdminUsers().subscribe(  (res) => {
      console.log(res);
      const AdminIndex = JSON.parse(localStorage.getItem('AdminIndex'));
      this.Adminmessage[AdminIndex] = ''
      this.AdminData = res.admin_users;

      setTimeout(()=>{
        const SelectedAdmins = JSON.parse(localStorage.getItem('selectedAdmins'));
      SelectedAdmins.forEach((value, index) => {
        this.SubscriptionForm['controls']['subscriptionData']['controls'][index]['controls'].admin_id.patchValue(value);
      })
      // window.location.reload()
      },500)

    })
    


  }

  changeState(event) {
    this.userService.getRegions(event).subscribe(res => {
      this.states = res.regions;
    })

  }

  SelectedCompany(event, subId, j) {
    this.Companymessage[j] = ''
    this.storehide[j] = true;
    this.adminhide[j] = true;
    if (event !== '') {
      localStorage.setItem('company_id', event);
      if (localStorage.getItem('selectedCompanies') !== null) {

        this.selectedCompanies = JSON.parse(localStorage.getItem('selectedCompanies'));
        this.selectedCompanies[j] = event;
        localStorage.setItem('selectedCompanies', JSON.stringify(this.selectedCompanies));
      } else {
        this.selectedCompanies[j] = event;
        localStorage.setItem('selectedCompanies', JSON.stringify(this.selectedCompanies));
      }
      this.userService.getUserStores(event).subscribe((res) => {
        console.log(res)
        this.Stores[j] = res.stores;

      })
    }else{
      if (localStorage.getItem('selectedCompanies') !== null) {
        this.selectedCompanies = JSON.parse(localStorage.getItem('selectedCompanies'))
        this.selectedCompanies[j] = "";
        localStorage.setItem('selectedCompanies', JSON.stringify(this.selectedCompanies))
      }
    }

  }

  SelectedStore(event, subId, j) {
    this.Storemessage[j] = '';
    console.log(event);
    if (event !== "") {
      var x = true;
      this.selectedCompanies = JSON.parse(localStorage.getItem('selectedCompanies'))
      const combinedCS = this.selectedCompanies[j] + "_" + event;
      this.Storemessage[j] = '';
      if (localStorage.getItem('selectedCompaniesAndstores') !== null) {
        this.selectedCompaniesAndstores = JSON.parse(localStorage.getItem('selectedCompaniesAndstores'))
        localStorage.setItem('selectedCompaniesAndstores', JSON.stringify(this.selectedCompaniesAndstores))
        this.selectedCompaniesAndstores.forEach((value, index) => {
          if (value == combinedCS && index !== j) {
            x = false;
            this.Storemessage[j] = 'Company & store must be unique';
            return;
          } else {
            this.selectedCompaniesAndstores[j] = combinedCS
            localStorage.setItem('selectedCompaniesAndstores', JSON.stringify(this.selectedCompaniesAndstores))
          }
        });

      } else {
          this.selectedCompaniesAndstores[j] = combinedCS
        localStorage.setItem('selectedCompaniesAndstores', JSON.stringify(this.selectedCompaniesAndstores))
      }

      if(x == true){

            if (localStorage.getItem('selectedStores') !== null) {

              this.selectedStores = JSON.parse(localStorage.getItem('selectedStores'));
              this.selectedStores[j] = event
        
              localStorage.setItem('selectedStores', JSON.stringify(this.selectedStores))
            } else {
              this.selectedStores[j] = event;
              localStorage.setItem('selectedStores', JSON.stringify(this.selectedStores));
        
            }
            localStorage.setItem('storeindex', j);
          }

    }else{
      if (localStorage.getItem('selectedStores') !== null) {
        this.selectedStores = JSON.parse(localStorage.getItem('selectedStores'))
        this.selectedStores[j] = "";
        localStorage.setItem('selectedStores', JSON.stringify(this.selectedStores))
      }
      if (localStorage.getItem('selectedCompaniesAndstores') !== null) {
        this.selectedCompaniesAndstores = JSON.parse(localStorage.getItem('selectedCompaniesAndstores'))
        this.selectedCompaniesAndstores[j] = "";
        localStorage.setItem('selectedCompaniesAndstores', JSON.stringify(this.selectedCompaniesAndstores))
      }
    }
 
  }
  get f() { return this.CompanyForm.controls; };
  get C() { return this.StoreForm.controls; };
  get k() { return this.AdminForm.controls; };
  // get v() { return this.StoreArray.controls; };



  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
console.log(this.StoreForm)
       if(file){
    // File Preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.preview = reader.result as string;
      this.imagepreview = true;

      this.StoreForm.patchValue({
        Storeimage: e.target.result
      });
    }
    this.StoreForm.get('Storeimage').updateValueAndValidity()
    reader.readAsDataURL(file)
  }
}
  Submit() {
    this.CompanySubmitted = true;

    // stop here if form is invalid
    if (this.CompanyForm.invalid) {
      // window.scrollTo(0,0);

      return;
    }
    this.Spinner.show();
    this.userService.addNewCompany(this.CompanyForm.value,).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        localStorage.setItem('company_id', res.company_id);
        const companyIndex = localStorage.getItem('companyindex');

        if (localStorage.getItem('selectedCompanies') !== null) {
          this.selectedCompanies = JSON.parse(localStorage.getItem('selectedCompanies'));
          console.log(this.selectedCompanies)
          this.selectedCompanies[companyIndex] = res.company_id
          // console.log(SelectedCompanies);
          localStorage.setItem('selectedCompanies', JSON.stringify(this.selectedCompanies));
        } else {
          this.selectedCompanies[companyIndex] = res.company_id
          console.log(this.selectedCompanies);
          localStorage.setItem('selectedCompanies', JSON.stringify(this.selectedCompanies));
        }

        this.Spinner.hide();
        this.companymessage = 'Your Company  is Created!';
        setTimeout(() => this.companymessage = '', 2000)
        setTimeout(() => this.closebutton.nativeElement.click(), 2000)
        this.dropdownrefresh();
      }

    })
  }

  onSubmit() {
    this.StoreSubmitted = true;
    // console.log(this.StoreForm.value)
    // stop here if form is invalid
    if (this.StoreForm.invalid) {
      return;
    }
    this.Spinner.show();
    this.userService.addNewStore(this.StoreForm.value).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        const storeindex = localStorage.getItem('storeindex');
        if (localStorage.getItem('selectedStores') !== null) {
          this.selectedStores = JSON.parse(localStorage.getItem('selectedStores'));
          this.selectedStores[storeindex] = res.store_id
          localStorage.setItem('selectedStores', JSON.stringify(this.selectedStores))
        } else {
          this.selectedStores[storeindex] = res.store_id;
          localStorage.setItem('selectedStores', JSON.stringify(this.selectedStores));
        }

        this.selectedCompanies = JSON.parse(localStorage.getItem('selectedCompanies'))
        const combinedCS = this.selectedCompanies[storeindex] + "_" + res.store_id;
        if (localStorage.getItem('selectedCompaniesAndstores') !== null) {
          this.selectedCompaniesAndstores = JSON.parse(localStorage.getItem('selectedCompaniesAndstores'))
          this.selectedCompaniesAndstores[storeindex] = combinedCS
        } else {
            this.selectedCompaniesAndstores[storeindex] = combinedCS
        }
        localStorage.setItem('selectedCompaniesAndstores', JSON.stringify(this.selectedCompaniesAndstores))
        
        this.Spinner.hide();
        // localStorage.setItem('company_id', res.company_id);
        this.storemessage = 'Your Store  is Created!';
        setTimeout(() => this.storemessage = '', 2000)
        setTimeout(() => this.fileInput.nativeElement.click(), 2000)
        this.preview = ''
        // this.imagepreview = false;
        this.storeRefresh(res.store_id);
      }

    })

  }

  AdminSubmit() {
    this.AdminSubmitted = true;
    if (this.AdminForm.invalid) {
      return;
    }
    this.Spinner.show();
    this.userService.createAdminUser(this.AdminForm.value).subscribe((res) => {
      console.log(res);

      if (res.status == 1) {
        const AdminIndex = localStorage.getItem('AdminIndex')
        if(localStorage.getItem('selectedAdmins')!==null){
            this.selectedAdmins = JSON.parse(localStorage.getItem('selectedAdmins'))
            this.selectedAdmins[AdminIndex] = res.admin_id 
        }else{
          this.selectedAdmins[AdminIndex] = res.admin_id
        }
       localStorage.setItem('selectedAdmins',JSON.stringify(this.selectedAdmins))

        
        this.Spinner.hide();
        this.adminmessage = 'Your Admin  is Created!';
        setTimeout(() => this.adminmessage = '', 2000)
        setTimeout(() => this.adminclose.nativeElement.click(), 2000)
        this.AdminRefresh(res.admin_id);


      }
      this.Spinner.hide();
      this.emailerror = res.validationErrors.email
      console.log(this.emailerror);
    })

  }
  // Email validation//
  validateNameViaServer({ value }: AbstractControl): Observable<ValidationErrors | null> {
    return this.userService.isEmailRegisterd(value)
      .pipe(debounceTime(500), map((res) => {
        console.log(status);
        if (res.status == 2) {
          return {
            isExists: true
          };
        }
        return null;
      }));
  }


  checkFormValid(admin_user_id,  productid, j) {
          

    this.Adminmessage[j] = '';
    if(admin_user_id !== ''){
        var x = true;
       
        if (productid == 3) {
          this.userService.validateAdminUser(admin_user_id, productid).subscribe((res => {
            
            if (res.status == 3) {
              this.Adminmessage[j] = "Admin allready assigned"
              x = false;
              this.userexist = false;
              // this.condtion = false;
              return;
            }
            console.log(x)
            if(x==true){
              if (localStorage.getItem('selectedAdmins') == null) { 
                this.selectedAdmins[j] = admin_user_id
                localStorage.setItem('selectedAdmins', JSON.stringify(this.selectedAdmins));
              } else {
                  this.selectedAdmins = JSON.parse(localStorage.getItem('selectedAdmins'));
                  this.selectedAdmins.forEach((value,index )=>{
                    if(value == admin_user_id && index !== j){
                      this.Adminmessage[j] = 'Admin already Selected';
                      return;
                    }else{
                      this.selectedAdmins[j] = admin_user_id
                      localStorage.setItem('selectedAdmins', JSON.stringify(this.selectedAdmins));
                    }
                 });  
              
              }
            }
          }))
        }
     

        

      }else{
        if (localStorage.getItem('selectedAdmins') !== null) {
          this.selectedAdmins = JSON.parse(localStorage.getItem('selectedAdmins'))
          this.selectedAdmins[j] = "";
          localStorage.setItem('selectedAdmins', JSON.stringify(this.selectedAdmins))
        }
      }

  }

  Finish() {
    console.log(this.Adminmessage )
    var x = true;
    let formData=this.SubscriptionForm.value;
    let data=formData.subscriptionData;
    data.forEach((value,index )=>{
     if(value.company_id == ''){
       x=false;
      this.Companymessage[index] = 'Company is required';
     }
     if(value.store_id == ''){
      x=false;
      this.Storemessage[index] = 'Store is required';
     }
     if(value.admin_id == ''){
      x=false;
      this.Adminmessage[index] = 'Admin is required';
     }

     this.Adminmessage.forEach((value,index)=>{

      if(value !== ''){

        x = false
      }
     })
     
   });  


    if (x) {
      console.log('SUBMITTED');
      this.Spinner.show();
      this.userService.updateCustomerSubscription(this.SubscriptionForm.value).subscribe((res) => {
        console.log(res);
        if (res.status == 1) {
          this.Spinner.hide();
          localStorage.removeItem('selectedCompanies');
          localStorage.removeItem('selectedStores');
          localStorage.removeItem('selectedAdmins');
          localStorage.removeItem('unllotesLinces');
          localStorage.removeItem('selectedCompaniesAndstores');
          localStorage.removeItem('storeindex');
          localStorage.removeItem('companyindex');
          this.zone.run(() => this.Router.navigate(['/subscriptions']));


        }
      })
    }



  }

}
