import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { UserService } from '../services/user.service';
import { Product } from './checkout.model'
import * as bcrypt from 'bcryptjs';
// import { CartService } from '../cart.service'
import { NgZone } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  ShowLoading = false;
  ShowPayNow=true;
  countries = [];
  states = [];
  cites = [];
  total: any
  price = [];
  CustmoreInformation = [];
   Cards = [];
  Product: Product[] = [];
  cartItems: Product[] = [];
  Products: Product[] = [];
  data: Product[] = [];
  id = [];
  isValidationError: boolean = false
  licensesValue = '1'
  message: string
  needline: boolean = false
  cartTotal = 0;
  userProfile = [];
  AddmoreProductDiv = true;
  returnUrl: string;
  backButton = true;

  constructor(private router: ActivatedRoute, private userService: UserService, private Router: Router,  private zone: NgZone, private spinner: NgxSpinnerService) {

  }
  passwordHidden: boolean = true;
  readonly = false;
  ifCustmoreLogin: boolean = true;
  ShowTotalPrice: boolean = false;
  BydefaultPrice: boolean = true;
  fieldset1: boolean = true;
  fieldset2: boolean = false;
  progressbar1: boolean = true;
  progressbar2: boolean = false;
  verification: boolean = false;
  ShowAddCardForm: boolean = false;
  ListCardDiv:boolean = true;
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

  ngOnInit(): void {
    this.spinner.show();
    if(localStorage.getItem('unllotesLinces') == 'yes'){
    this.Router.navigate(['/allot-licences'])
  }
    if (localStorage.getItem('nu_c_user_id') !== null) { 

      this.V_email = localStorage.getItem('nu_email');

      this.userService.GetUserDetails(localStorage.getItem('nu_c_user_id')).subscribe(res => {
        this.spinner.hide();
        if (res.profile[0]) {
          this.V_email = res.profile[0].email;
          this.V_contact = res.profile[0].mobile_no;
          this.V_firstname = res.profile[0].first_name;
          this.V_lastname = res.profile[0].last_name;
          this.V_address = res.profile[0].address;
          this.V_addressOptional = res.profile[0].addressOptional;
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

      this.passwordHidden = false;
      this.ifCustmoreLogin = false;
      this.readonly = true;
    }

    if (localStorage.getItem('CustmoreInformation') !== null) {
      const countryId = localStorage.getItem('country.id');
      this.userService.getRegions(countryId).subscribe(res => {
        this.states = res.regions;
      })
      this.ifCustmoreLogin = false
      this.readonly = true;
      const CustmoreDetails = JSON.parse(localStorage.getItem('CustmoreInformation'));
      const CustmoreDetailsObject = CustmoreDetails[0];
      this.V_email = CustmoreDetailsObject.email;
      this.V_contact = CustmoreDetailsObject.mobile_no;
      this.V_firstname = CustmoreDetailsObject.firstname;
      this.V_lastname = CustmoreDetailsObject.lastname;
      this.V_address = CustmoreDetailsObject.address;
      this.V_addressOptional = CustmoreDetailsObject.address_optional;
      this.V_Country = CustmoreDetailsObject.country;
      this.V_State = CustmoreDetailsObject.state;
      this.V_city = CustmoreDetailsObject.city;
      this.V_zipcode = CustmoreDetailsObject.zip;

    }

    localStorage.removeItem('anotherProduct');

    this.loadStripe();

    document.body.classList.add('orderbg');

    this.router.paramMap.subscribe(params => {
      this.userService.GetProductbyId(params.get('id')).subscribe((data: any) => {
        this.spinner.hide();
       const proDuctid = params.get('id')
          localStorage.setItem('proDuctid',proDuctid);
          
        if (localStorage.getItem("FilterProduct") !== null) {
          this.needline = true
          this.cartItems = JSON.parse(localStorage.getItem("FilterProduct"));

          this.cartTotal = JSON.parse(localStorage.getItem("OverallTotal"));

          this.Products = JSON.parse(localStorage.getItem("FilterProducts"));


          this.BydefaultPrice = false;

          this.ShowTotalPrice = true;

          this.price = data.product_info.price 

        } else {

          localStorage.setItem('product_id', data.product_info.id);

          this.cartItems.push({
            id: data.product_info.id,
            name: data.product_info.name,
            qty: 1,
            price: data.product_info.price,
            image: data.product_info.image
          })

          this.cartTotal = data.product_info.price;

          localStorage.setItem("FilterProduct", JSON.stringify(this.cartItems));

          localStorage.setItem("OverallTotal", JSON.stringify(this.cartTotal));

          this.userService.getAllProducts().subscribe((data: any) => {
            this.Products = data.products;
            const product_id = JSON.parse(localStorage.getItem('product_id'))
            this.Products = this.Products.filter(item => item.id !== product_id)
            localStorage.setItem("FilterProducts", JSON.stringify(this.Products));
          });


          this.price = data.product_info.price
        }


        this.userService.getcountries().subscribe((data: any) => {
          this.countries = data.countries;

        })

      })

    })

    // if(this.Products.length == this.cartItems.length){
    //   this.AddmoreProductDiv = false
    //   }
  //  if(this.Products.length !== this.cartItems.length){
  //    this.AddmoreProductDiv = true
  //  }
    
  }

  ngOnDestroy(): void {
    document.body.classList.remove('orderbg');
  } 

  increase(event: any) {
    console.log(event.target.value, event.target.id);
    this.cartItems.find(p => p.id == event.target.id).qty = event.target.value
    localStorage.setItem("FilterProduct", JSON.stringify(this.cartItems));
    this.calculateAllTotal(this.cartItems);

  }

  removeProduct(product: any) {
    console.log(product); 
     this.cartItems = this.cartItems.filter(p => p.id !== product.id)
    localStorage.setItem("FilterProduct", JSON.stringify(this.cartItems));
    if(this.cartItems.length == 0){
      this.Router.navigate(['/products']);
      localStorage.removeItem('FilterProduct');
      localStorage.removeItem("FilterProducts");

    }
    this.calculateAllTotal(this.cartItems);
     this.Products.push(product);
     localStorage.setItem("FilterProducts", JSON.stringify(this.Products));

  }

  calculateAllTotal(items) {
    this.BydefaultPrice = false;
    this.ShowTotalPrice = true;
    let total = 0;
    for (let i in items) {
      total = total + (items[i].qty * items[i].price);
    }
    this.cartTotal = total;


    localStorage.setItem("OverallTotal", JSON.stringify(this.cartTotal));

  }
  

  AddMoreProducts(product) {
    this.needline = true
    localStorage.setItem('anotherProduct', JSON.stringify(this.id))


    this.cartItems.push({
      id: product.id,
      name: product.name,
      qty: 1,
      price: product.price,
      image: product.image

    })

  this.Products = this.Products.filter((val) => !this.cartItems.find(({ id }) => val.id === id));
  console.log(this.Products.length)
  // if(this.Products.length == 0){
  //   this.AddmoreProductDiv = false
  // }else{
  //   this.AddmoreProductDiv = true
  // }
  
    localStorage.setItem("FilterProducts", JSON.stringify(this.Products));

    localStorage.setItem("FilterProduct", JSON.stringify(this.cartItems));

    this.BydefaultPrice = false;
    this.ShowTotalPrice = true;
    this.cartTotal += product.price


    localStorage.setItem("OverallTotal", JSON.stringify(this.cartTotal))

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

  // Choose city using select dropdown
  // changeCity(e) {
  //   console.log(e.value)
  //  city.setValue(e.target.value, {
  //     onlySelf: true
  //   })
  // }
  selectedGroup: any;

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

  emailCheck(event){
    console.log(event.target.value);
    this.userService.validateEmail(event.target.value).subscribe(res =>{
      console.log(res);
     if(res.status == 2){
      this.emailError = res.validationErrors.email  ;
     }else{
      this.emailError = ''; 
     }

    })
  }

  backbutton(){
    this.StripeCardEror = '';
    this.fieldset1 = true;
    this.fieldset2 = false;
    this.progressbar1 = true;
    this.progressbar2 = false;
    const CustmoreDetails = JSON.parse(localStorage.getItem('CustmoreInformation'));
    const CustmoreDetailsObject = CustmoreDetails[0];
    this.V_email = CustmoreDetailsObject.email;
    this.V_contact = CustmoreDetailsObject.mobile_no;
    this.V_firstname = CustmoreDetailsObject.firstname;
    this.V_lastname = CustmoreDetailsObject.lastname;
    this.V_address = CustmoreDetailsObject.address;
    this.V_addressOptional = CustmoreDetailsObject.address_optional;
    this.V_Country = CustmoreDetailsObject.country;
    this.V_State = CustmoreDetailsObject.state;
    this.V_city = CustmoreDetailsObject.city;
    this.V_zipcode = CustmoreDetailsObject.zip;

  }

  checkInput(input){
    if(input == 'contact')
    this.contactError = '';
    if(input == 'first_name')
    this.first_nameError = '';
    if(input == 'password')
    this.passwordError = '';
    if(input == 'address_line1')
    this.address_line1Error = '';
    if(input == 'city')
    this.cityError = '';
    if(input == 'country')
    this.countryError = '';
    if(input == 'state')
    this.stateError = '';
    if(input == 'zip')
    this.zipError = '';
    }










  showPaymentForm(event) {
    this.ShowPayNow = false;
    this.ShowLoading = true;  
    
    event.preventDefault();
    const target = event.target;
    const email = target.querySelector("#email").value;
    var password = '';
    if (localStorage.getItem('nu_c_user_id') == null) {
      password = target.querySelector("#password").value;
    }
    const mobile_no = target.querySelector("#contact").value;
    const firstname = target.querySelector("#first_name").value;
    const lastname = target.querySelector("#last_name").value;
    const address = target.querySelector("#address_line1").value;
    const addressOptional = target.querySelector("#address_line2").value;
    const city = target.querySelector("#city").value;
    const country: number = target.querySelector("#country").value;
    const state: number = target.querySelector("#state").value;
    const zip = target.querySelector("#zip").value;
    const needValidation = 1

    this.userService.custmoreRegister(email, password, mobile_no, firstname, address, city, country, state, zip, needValidation).subscribe(
      resp => {
        console.log(resp);
        if (resp.status == 2) {
          this.emailError = resp.validationErrors.email;
          this.passwordError = resp.validationErrors.password;
          this.contactError = resp.validationErrors.mobile_no;
          this.first_nameError = resp.validationErrors.first_name;
          this.last_nameError = resp.validationErrors.last_name;
          this.address_line1Error = resp.validationErrors.address_line1;
           this.address_line2Error = resp.validationErrors.address_line2Error;
          this.cityError = resp.validationErrors.city;
          this.countryError = resp.validationErrors.country;
          this.stateError = resp.validationErrors.state;
          this.zipError = resp.validationErrors.zip;
          this.ShowLoading = false;
          this.ShowPayNow = true;
        } else {
          this.ShowLoading = false;
          this.ShowPayNow = true;

          this.fieldset1 = false;
          this.fieldset2 = true;
          this.progressbar1 = false;
          this.progressbar2 = true;
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
          // Without login case
          if(localStorage.getItem('nu_c_user_id') == null){
            this.ListCardDiv = false;
            this.ShowAddCardForm = true;
            window.scrollTo(0,0);
          }
          // with Login case 
          if(localStorage.getItem('nu_c_user_id') !== null){
            this.userService.getCustomerCards().subscribe(res => {
              this.Cards = res.cards
              window.scrollTo(0,0);

              if(res.cards_count ==  0){
                this.ListCardDiv = false;
                this.ShowAddCardForm = true;
              }
                if(res.cards_count > 0){
                  this.ListCardDiv = true;
                  this.ShowAddCardForm = false; 
                }

            })
          }

          /*const salt = bcrypt.genSaltSync(10);
          const pass = bcrypt.hashSync(password, salt);
          console.log(pass);*/

          this.CustmoreInformation.push({
            "email": email,
            "password": password,
            "mobile_no": mobile_no,
            "firstname": firstname,
            "lastname": lastname,
            "address": address,
            "addressOptional": addressOptional,
            "city": city,
            "country": country,
            "state": state,
            "zip": zip,


          })

          localStorage.setItem('CustmoreInformation', JSON.stringify(this.CustmoreInformation)); 

        }

      }
    );
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
  PaymentInformation(event) {
    this.backButton = false;
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
      this.ShowLoading = false;
      this.ShowPayNow = true;
      this.backButton = false;
    }

    if (CardNumber == '') {
      this.card_numberError = 'Please enter card number';
      this.isValidationError = true;
      this.ShowLoading = false;
      this.ShowPayNow = true;
      this.backButton = false;
    }
    if (CardNumber.length !== 16) {
      this.card_numberError = 'Please enter 16 digit card number';
      this.isValidationError = true;
      this.ShowLoading = false;
      this.ShowPayNow = true;
      this.backButton = false;
    }

    if (Expirationdate == '') {
      this.card_expiry_dateError = 'Please enter card Expiry Month';
      this.isValidationError = true;
      this.ShowLoading = false;
      this.ShowPayNow = true;
      this.backButton = false;
    }
    if (expYear == '') {
      this.card_expiry_yearError = 'Please enter card Expiry Year';
      this.isValidationError = true;
      this.ShowLoading = false;
      this.ShowPayNow = true;
      this.backButton = false;
    }

    if (CVV == '') {
      this.card_cvvError = 'Please enter card cvv';
      this.isValidationError = true;
      this.ShowLoading = false;
      this.ShowPayNow = true;
      this.backButton = false;
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
        const CustmoreData = JSON.parse(localStorage.getItem('CustmoreInformation'))
        this.zone.run(() => {

        if (status == 200) {
          //this.StripeCardEror = `Success! Card token ${response.card.id}.`
          this.userService.custmoreRegisterFinal(CustmoreData, response.id, response.card.id).subscribe(
            resp => {
              console.log(resp);
              if (resp.status == 1) {
                localStorage.setItem('nu_c_user_id', resp.user_id);
                localStorage.setItem('nu_email', resp.email);
                localStorage.setItem('nu_first_name', resp.first_name);
                localStorage.setItem('nu_last_name', resp.last_name);
                this.ShowPayNow = false;
                this.ShowLoading = true;
                this.zone.run(() => this.Router.navigate(['/thankyou']));
              }
            });
        } else {
          this.backButton = true;
          this.ShowLoading = false;
          this.ShowPayNow = true;
           this.StripeCardEror = response.error.message;
           window.scrollTo(0,0);
           console.log(this.StripeCardEror);
        }
      });
      });

    }

  }

  SelectCard(event:any){
    this.backButton = false;
    this.ShowPayNow = false;
    this.ShowLoading = true;
    event.preventDefault();
    const target = event.target;
    var CardId =target.querySelector('input[name=card_id]:checked').value;
    const CustmoreData = JSON.parse(localStorage.getItem('CustmoreInformation'))
    const responseid = ''
    this.userService.custmoreRegisterFinal(CustmoreData,'',CardId ).subscribe(
      resp => {
        console.log(resp)
        if (resp.status == 1) {
          localStorage.setItem('nu_c_user_id', resp.user_id);
          localStorage.setItem('nu_email', resp.email);
          localStorage.setItem('nu_first_name', resp.first_name);
          localStorage.setItem('nu_last_name', resp.last_name);
          this.zone.run(() => this.Router.navigate(['/thankyou']));
        }
  })

}

  useAnotherCard(){
    window.scrollTo(0,0);

    this.ListCardDiv = false;
     this.ShowAddCardForm = true;
  }

}
