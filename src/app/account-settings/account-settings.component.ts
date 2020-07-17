import { Component, OnInit,ViewChild  } from '@angular/core';
import { UserService } from 'src/app/services/user.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

   declare var $: any;
   import * as $ from 'jquery'; 

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('fileInput') fileInput;
  constructor(private userService: UserService, private Spinner: NgxSpinnerService,private zone: NgZone,private Router: Router) { }
  loggedInUserName: string = 'User';
  loggedInUserFirstName: string = 'User';
  loggedInUserEmail: string = ''; 
  productData = [];
  countries = [];
  cites = [];
  spinner = false;
 checkSign = false;
  states = [];
  showNoRecord = false;
  buttonhide = true;
  isValidationError: boolean = false
  ShowLoading = false;
  ShowPayNow=true;
  V_email: string = ''
  V_contact: string = '';
  V_firstname: string = '';
  V_lastname: string = '';
  V_address: string = '';
  V_addressOptional: string = '';
  V_Country: number;
  V_State: number;
  V_city: string = '';
  V_zipcode: string = '';
  Profilemessage: string = '';
  Passwdemessage: string = '';
  Cardmessage: string = '';

  loadStripe() {

    if (!window.document.getElementById('stripe-custom-form-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-custom-form-script";
      s.type = "text/javascript";
      s.src = "https://js.stripe.com/v2/";
      s.onload = () => {
        window['Stripe'].setPublishableKey('pk_test_3TLPNfRAH1xS1R8mZRmlZ9An00S1qrBW9R');
      }

      window.document.body.appendChild(s);
    }
  }




  ngOnInit(): void {
    if(localStorage.getItem('unllotesLinces') == 'yes'){
      this.Router.navigate(['/allot-licences'])
    }
    this.loadStripe();
    this.Spinner.show();
    // document.body.classList.add('bgbnnerimg');
    if (localStorage.getItem('nu_first_name') !== null) {
      this.loggedInUserFirstName = localStorage.getItem('nu_first_name');
      this.loggedInUserName = localStorage.getItem('nu_first_name'); 
      this.loggedInUserEmail = localStorage.getItem('nu_email');
     this.V_email = this.loggedInUserEmail
      this.userService.GetUserDetails(localStorage.getItem('nu_c_user_id')).subscribe(res => { 
        console.log(res);
        this.Spinner.hide();
        if (res.profile[0]) {
          this.V_email = res.profile[0].email;
          this.V_contact = res.profile[0].mobile_no;
          this.V_firstname = res.profile[0].first_name;
          this.V_lastname = res.profile[0].last_name;
          this.V_address = res.profile[0].address;
          this.V_addressOptional = res.profile[0].address_optional;
          this.V_Country = res.profile[0].country;
          this.userService.getRegions(this.V_Country).subscribe(res => {
            this.states = res.regions; 
          })
          // this.V_State =res.profile[0].state;
          this.V_State = res.profile[0].state;
          this.V_city = res.profile[0].city;
          this.V_zipcode = res.profile[0].zip;
        }

      });
     
     
      this.userService.getcountries().subscribe((data: any) => {
        this.countries = data.countries;

      })


    }
   
  }

  // ngOnDestroy(): void {
  //   document.body.classList.remove('bgbnnerimg');
  // }


  ngAfterViewInit(){
    $(document).ready(function(){
    $("#closebutton").click(function(){
      $(".input-reset").val("");
      // $(".inputValidation").val("");

       });
    });
    $(document).ready(function(){
      $("#closecard").click(function(){
        $(".card-reset").val("");
      });
      });



    }

  emailError: string = '';
  passwordError: string = '';
  contactError: string = '';
  first_nameError: string = '';
  last_nameError: string = '';
  address_line1Error: string = '';
  address_line2Error: string = '';
  cityError: string = '';
  countryError: string = '';
  stateError: string = '';
  zipError: string = '';
  payment_methodError: string = '';
  card_numberError: string = '';
  card_expiry_dateError: string = '';
  card_expiry_yearError: string = '';
  card_cvvError: string = '';
  cardError: string = '';
  plainText: string;

  



  changeState(event) {
    console.log(event);
    localStorage.setItem('country.id', event);
    this.userService.getRegions(event).subscribe(res => {
      this.states = res.regions;
    })

  }

  changeCities(value) {
    console.log(value);
    let country = JSON.parse(localStorage.getItem('country.id'))
    this.userService.getCities(country, value).subscribe(res => {
      this.cites = res.cities;
      console.log(res);
    })
  }




 

  updateCustmoreinfo(event) {
    this.ShowPayNow = false;
    this.ShowLoading = true;  
    event.preventDefault();
    const target = event.target;
    // const email = target.querySelector("#email").value;
   
    const mobile_no = target.querySelector("#contact").value;
    const firstname = target.querySelector("#first_name").value;
    const lastname = target.querySelector("#last_name").value;
    const address = target.querySelector("#address_line1").value;
    const address_Optional = target.querySelector("#address_line2").value;
    const city = target.querySelector("#city").value;
    const country: number = target.querySelector("#country").value;
   
    const state: number = target.querySelector("#state").value;
    const zip = target.querySelector("#zip").value;

    this.userService.updateCustomerInfo( mobile_no, firstname,lastname, address, address_Optional, city, country, state, zip).subscribe(
      resp => {
        console.log(resp);
        if (resp.status == 2) {
          this.emailError = resp.validationErrors.email;
          this.passwordError = resp.validationErrors.password;
          this.contactError = resp.validationErrors.mobile_no;
          this.first_nameError = resp.validationErrors.first_name;
          // this.last_nameError = resp.validationErrors.last_name;
          this.address_line1Error = resp.validationErrors.address_line1;
          // this.address_line2Error = resp.validationErrors.address_line2Error;
          this.cityError = resp.validationErrors.city;
          this.countryError = resp.validationErrors.country;
          this.stateError = resp.validationErrors.state;
          this.zipError = resp.validationErrors.zip;
          this.ShowLoading = false;
          this.ShowPayNow = true;
        } else {
          this.emailError = '';
          this.passwordError = '';
          this.contactError = ' ';
          this.first_nameError = '';
          this.last_nameError = '';
          this.address_line1Error = '';
          this.cityError = '';
          this.countryError = '';
          this.stateError = '';
          this.zipError = '';
          this.ShowLoading = false;
          this.ShowPayNow = true;
          this.Profilemessage = 'Your information updated sucessfuly!'  
          setTimeout(() =>  this.Profilemessage = '', 2000)       
         
        
        }

      }
    );
  }
 
  OldPassError:string = '';
 newPassError:string = ''; 
 confirmPassError:string = '';  

 checkInput(input){
  if(input == 'oldPassword')
  this.OldPassError = '';
  if(input == 'newPassword')
  this.newPassError = '';
  if(input == 'ConfirmPassword')
  this.confirmPassError = '';
  }



  Submit(event){
    this.ShowPayNow = false;
    this.ShowLoading = true;  
      event.preventDefault();
     const target = event.target;
     const oldPass = target.querySelector("#oldPassword").value;
     const newPass = target.querySelector("#Newpassword").value;
     const confirmPass = target.querySelector("#Confirmpassword").value;
     const user_id =  localStorage.getItem('nu_c_user_id')
     this.userService.changeUserPassword(oldPass,newPass,confirmPass,user_id  ).subscribe(res =>{
        console.log(res);
        if(res.status == 2){
          this.ShowLoading = false;
          this.ShowPayNow = true;
  
          this.OldPassError = res.validationErrors.oldPassword;
          this.newPassError = res.validationErrors.newPassword;
          this.confirmPassError = res.validationErrors.confirmPassword;
  
        }else{
          if(res.status == 1){
            this.ShowLoading = false;
            this.ShowPayNow = true;
            // this.OldPassError = '';
            // this.newPassError = ''; 
            // this.confirmPassError = '';  
            // this.spinner = false;
            // this.checkSign = true;
            // setTimeout(() => {
            //   this.checkSign = false;
            // }, 2000);
           
          this.Passwdemessage = res.message;
          setTimeout(() =>  this.Passwdemessage = '', 2000)
          setTimeout(() =>  this.closebutton.nativeElement.click(), 2000)       

          }
          this.OldPassError = '';
          this.newPassError = '';
          this.confirmPassError = '';
        }
  
  
     })
  
   
  }

  checkCard(input){
    if(input == 'card_holder')
    this.cardError = '';
    if(input == 'card_number')
    this.card_numberError = '';
    if(input == 'expire_month')
    this.card_expiry_dateError = '';
    if(input == 'expYear')
    this.card_expiry_yearError = '';
    if(input == 'cvv')
    this.card_cvvError = '';
   




    }





 
  StripeCardEror:string;
UpdateCardInformation(event){
  this.ShowPayNow = false;
  this.ShowLoading = true;
  event.preventDefault();
  const target = event.target;
  const Cardholder = target.querySelector('#card_holder').value;
  const CardNumber = target.querySelector('#card_number').value;
  const Expirationdate = target.querySelector('#card_expiry_date').value;
  const expYear = target.querySelector('#expYear').value;
  const CVV = target.querySelector('#card_cvv').value;

  this.isValidationError = false;


  if (Cardholder == '') {
    this.cardError = 'Please enter cardholderName';
    this.isValidationError = true;
    this.ShowPayNow = true;
      this.ShowLoading = false;
  }

  if (CardNumber == '') {
    this.card_numberError = 'Please enter card number';
    this.isValidationError = true;
    this.ShowPayNow = true;
    this.ShowLoading = false;
    
  }
  if (CardNumber.length !== 16) {
    this.card_numberError = 'Please enter 16 digit card number';
    this.isValidationError = true;
    this.ShowPayNow = true;
    this.ShowLoading = false;
  }

  if (Expirationdate == '') {
    this.card_expiry_dateError = 'Please enter card Expiry Month';
    this.isValidationError = true;
    this.ShowPayNow = true;
    this.ShowLoading = false;
  }
  if (expYear == '') {
    this.card_expiry_yearError = 'Please enter card Expiry Year';
    this.isValidationError = true;
    this.ShowPayNow = true;
    this.ShowLoading = false;
  }

  if (CVV == '') {
    this.card_cvvError = 'Please enter card cvv';
    this.isValidationError = true;
    this.ShowPayNow = true;
    this.ShowLoading = false;
  }

  if (!this.isValidationError) {//Means all forms inputs are filled
    this.payment_methodError = '';
    this.cardError = '';
    this.card_numberError = '';
    this.card_expiry_dateError = '';
    this.card_expiry_yearError = '';
    this.card_cvvError = '';

    //do something
    if (!window['Stripe']) {
      alert('Oops! Stripe did not initialize properly.');
      return;
    }
    (<any>window).Stripe.card.createToken({
      number: CardNumber,
      exp_month: Expirationdate,
      exp_year: expYear,
      cvc: CVV
    }, (status: number, response: any) => {
      console.log(status);
     
      this.zone.run(() => {

      if (status == 200) {
          const user_id = localStorage.getItem('nu_c_user_id')
        this.userService.updateCustomerCard(user_id, response.id, response.card.id).subscribe(
          resp => {
            console.log(resp);
            if (resp.status == 1) {
              this.Cardmessage = 'Your card is updated! '; 
              setTimeout(() =>  this.Cardmessage = '', 2000)    
              this.ShowPayNow = true;
              this.ShowLoading = false;
              setTimeout(() =>  this.fileInput.nativeElement.click(), 2000)       


            }else{
              this.StripeCardEror = resp.error
              this.ShowPayNow = true;
          this.ShowLoading = false;
            }
          });
      } else {
        this.ShowLoading = false;
        this.ShowPayNow = true;
         this.StripeCardEror = response.error.message;
         console.log(this.StripeCardEror);
      }
    });
    });

  }

}


}






