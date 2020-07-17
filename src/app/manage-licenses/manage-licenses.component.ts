import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, AbstractControl, ValidationErrors, FormGroupDirective } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, map, flatMap } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';

@Component({
  selector: 'app-manage-licenses',
  templateUrl: './manage-licenses.component.html',
  styleUrls: ['./manage-licenses.component.css']
})
export class ManageLicensesComponent implements OnInit {
  @ViewChild('adminclose') adminclose;
  @ViewChild('close') close;
  @ViewChild('passmodel') passmodel;
  @ViewChild('passclose') passclose;


  AdminSubmitted = false;
  AdminData = [];
  selectedsubmit = false;
  adminmessage = ''
  adminMessage = ''
  AdminSelected = ''
  emailerror = '';
  passwordMessage = '';
  status = '';
  byDeafaultSelected = ''
  constructor(private userService: UserService, private Router: Router, private router: ActivatedRoute, private fb: FormBuilder, private Spinner: NgxSpinnerService) { }
  allottedLicenses: [];
  productname = ''
  AdminForm: FormGroup;
  Selectedadmin: FormGroup
  ngOnInit(): void {
    if (localStorage.getItem('unllotesLinces') == 'yes') {
      this.Router.navigate(['/allot-licences'])
    }

    this.manageLicences();


    this.Selectedadmin = this.fb.group({
      adminid: ['', Validators.required]
    })

    this.AdminForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['',],
      email: ['', [Validators.required, Validators.email], this.validateNameViaServer.bind(this)]


    })

  }

  manageLicences() {
    this.router.paramMap.subscribe(params => {
      this.userService.getAllottedLicensesList(params.get('id')).subscribe((data: any) => {
        console.log(data);
        const proDuctid = params.get('id')
        localStorage.setItem('proDuctid', proDuctid);
        if (data.status == 1) {
          this.allottedLicenses = data.subscription_info
          this.productname = data.product_name
          this.userService.getAdminUsers().subscribe((res) => {
            console.log(res);
            this.AdminData = res.admin_users;

          });

        }
      })
    })
  }
  CancelLicenses(id) { 
    if (confirm("Are you sure you want to cancel the subscription?")) {
      this.Spinner.show();

      this.userService.Cancellicenses(id).subscribe((res) => {
        this.Spinner.hide();
        this.manageLicences();
      })
    }
  }

  changeAdminUser(subId) {
    console.log(subId);
    localStorage.setItem('subscription_id', subId)
  }

  changePassword(subid) {
    if (confirm("Are you sure you want to reset the user's password?")) {
      this.Spinner.show();
      this.userService.updateAdminUserPassword(subid).subscribe((res) => {
        console.log(res);
        if (res.status == 1) {
          this.Spinner.hide();
          this.passwordMessage = 'The new password has been emailed to the user'
          //  alert('Password send to mail sucessfully')
          this.passmodel.nativeElement.click();
          setTimeout(() => this.passclose.nativeElement.click(), 2000)

        }
      })
    }

  }

  get f() { return this.Selectedadmin.controls; };
  get k() { return this.AdminForm.controls; };


  SelectedAdmin(event) {
    this.adminMessage = '';
    // console.log(event);
    const product_id = localStorage.getItem('proDuctid');
    if (product_id == '3') {
      this.userService.validateAdminUser(event, product_id).subscribe((res => {
        console.log(res);
        if (res.status == 3) {
          this.status = '0';
          this.adminMessage = "Admin user already assigned"
          return
        } else {
          this.status = '1';
          localStorage.setItem('selected_admin', event);
        }
      }));

    } else {
      this.status = '1';
    }
  }

  SelectedAdminReset() {
    this.adminMessage = '';
    this.selectedsubmit = false;
    this.Selectedadmin.reset();
    this.Selectedadmin.patchValue({
      adminid:""
    })
   
  }

  AdminReset() {
    this.adminMessage = '';
    this.AdminForm.reset()
    this.AdminSubmitted = false;
    

  }
  AddNew() {
    this.Selectedadmin.reset()
    this.selectedsubmit = false;
    this.Selectedadmin.patchValue({
      adminid:""
    })

  }

  SelectedSubmit() {
    this.selectedsubmit = true;
    console.log(this.Selectedadmin.value)
    if (this.Selectedadmin.invalid) {
      return;
    }
    if (this.status == '1') {
      this.Spinner.show();
      var selected_admin = localStorage.getItem('selected_admin')
      console.log('done')
      this.userService.updateSubscriptionAdmin(selected_admin).subscribe((res) => {
        console.log(res);
        if (res.status == 1) {
          this.Spinner.hide();
          this.manageLicences();
          this.AdminSelected = 'The admin user is selected!';
          setTimeout(() => this.AdminSelected = '', 2000)
          setTimeout(() => this.close.nativeElement.click(), 2000)
        } this.Spinner.hide();

      })
    } else {
      this.Spinner.hide();
    }
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

  AdminSubmit() {
    this.AdminSubmitted = true;
    if (this.AdminForm.invalid) {
      return;

    }
    this.Spinner.show();
    this.userService.createAdminUser(this.AdminForm.value).subscribe((res) => {
      console.log(res);
      if (res.status == 1) {
        this.Spinner.hide();
        this.adminmessage = "The admin user is created! The account password will be emailed to the user's email address.";
        setTimeout(() => this.adminmessage = '', 2000);
        setTimeout(() => this.adminclose.nativeElement.click(), 2000);
        this.manageLicences();
      }
      this.Spinner.hide();
      this.emailerror = res.validationErrors.email
      console.log(this.emailerror);

    });
  }

}
