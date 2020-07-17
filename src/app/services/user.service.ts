import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../checkout/checkout.model'
import { Observable } from 'rxjs';
import { map} from "rxjs/operators";
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  user_id = '';
  constructor(private httpClient: HttpClient) { }

  api_url = 'https://nuflorist.com/nfadmin-dev/nuflorist-backend-dev/api';
  

  // Login API // 

  loginRequest(email, password) {
    return this.httpClient.post<any>(this.api_url + '/login', { email, password });
  }

  passwordReset(password, confirmPassword) {
    if(localStorage.getItem('user_id') !== null){
    var user_id = localStorage.getItem('user_id');

  }
    return this.httpClient.post<any>(this.api_url + '/passwordReset', { password, confirmPassword,user_id });
  }

  forgotPassword(email) {
    return this.httpClient.post<any>(this.api_url + '/forgotpassword', { email });
  }

  signupRequest(email, password) {
    return this.httpClient.post<any>(this.api_url + '/register', { email, password });
  }

  getAllProducts() {
       var user_id = '';
    if(localStorage.getItem('nu_c_user_id') !== null){
       user_id =  localStorage.getItem('nu_c_user_id');
   }
    return this.httpClient.post<any>(this.api_url + '/getProductsList', { user_id});
  }


  getcountries() {
    return this.httpClient.post<any>(this.api_url + '/getCountries', {});
  }

  getRegions(country_id) {
    return this.httpClient.post<any>(this.api_url + '/getRegions', { country_id });
  }

  getCities(country_id, region_id) {
    return this.httpClient.post<any>(this.api_url + '/getCities', { country_id, region_id })
  }

  GetProductbyId(product_id) {
    return this.httpClient.post<any>(this.api_url + '/getProductInfo', { product_id })
  }

  GetUserDetails(user_id) {
    return this.httpClient.post<any>(this.api_url + '/getUserDetails', { user_id })
  }


  custmoreRegister(email, password, mobile_no, first_name, address_line1, city, country, state, zip, needValidation) {

    let filterProducts = JSON.parse(localStorage.getItem("FilterProduct"));

    if(localStorage.getItem('nu_c_user_id') !== null){
       var user_id =  localStorage.getItem('nu_c_user_id');
    }
    
    return this.httpClient.post<any>(this.api_url + '/customerRegister', { email, password, mobile_no, first_name, address_line1, city, country, state, zip, needValidation, filterProducts,user_id });
  }

  custmoreRegisterFinal(customre, StripeToken, Card_id) {

    if(localStorage.getItem('nu_c_user_id') !== null){
      var user_id =  localStorage.getItem('nu_c_user_id');
   } 
    let filterProducts = JSON.parse(localStorage.getItem("FilterProduct"));

    let TotalAmount = JSON.parse(localStorage.getItem('OverallTotal'))

    let AllData = {
      "customre":customre,
      "StripeToken":StripeToken,
      "Card_id":Card_id,
      "filterProducts":filterProducts,
      "TotalAmount":TotalAmount,
      "user_id":user_id
    };
    console.log(AllData);

    return this.httpClient.post<any>(this.api_url + '/customerRegisterFinal', { AllData });
  }


// api for get all product grouping data // 

  getUserPurchasedProducts(user_id){

    return this.httpClient.post<any>(this.api_url + '/getUserPurchasedProductsList', {user_id })
  } 

validateEmail(email){

  return this.httpClient.post<any>(this.api_url + '/validateEmail',{email})
}

changeUserPassword(oldPassword,newPassword,confirmPassword,user_id){
  return this.httpClient.post<any>(this.api_url + '/changeUserPassword',{oldPassword,newPassword,confirmPassword,user_id})
}

getCustomerCards(){

  var user_id =  localStorage.getItem('nu_c_user_id');  
  return this.httpClient.post<any>(this.api_url + '/getCustomerCards',{user_id})
}

CreateCompanyAndStores(companyData){
  var user_id =  localStorage.getItem('nu_c_user_id');
  // let storesData  = JSON.parse(companyData);  
  let CompanyData = {
    "CompanyData":companyData,
    "user_id":user_id
  }

  return this.httpClient.post<any>(this.api_url + '/addCompanyPlusStore',{ CompanyData})
}

getCompanyAndStores(){
  var user_id =  localStorage.getItem('nu_c_user_id');  

  return this.httpClient.post<any>(this.api_url + '/getUserCompaniesList',{ user_id})

}

deleteStore(company_id,store_id){
  var user_id =  localStorage.getItem('nu_c_user_id');  

  return this.httpClient.post<any>(this.api_url + '/deleteStore',{ user_id,company_id,store_id})  
}

getCompanyinfo(company_id){

  return this.httpClient.post<any>(this.api_url + '/getCompanyInfo',{ company_id})
}

updateCompanyPlusStore(companyData){
  var user_id =  localStorage.getItem('nu_c_user_id');
  let CompanyData = {
    "CompanyData":companyData,
    "user_id":user_id
  }

  return this.httpClient.post<any>(this.api_url + '/updateCompanyPlusStore',{CompanyData})

}

getAllottedLicensesList(product_id){
  var user_id =  localStorage.getItem('nu_c_user_id');
  return this.httpClient.post<any>(this.api_url + '/getAllottedLicensesList',{ product_id,user_id})
}

Cancellicenses(subscription_id){
  var user_id =  localStorage.getItem('nu_c_user_id');
  return this.httpClient.post<any>(this.api_url + '/cancelSubscription',{ subscription_id,user_id})
}

updateCustomerInfo(mobile_no, first_name,last_name, address, address_optional, city, country, state, zip){
  var user_id =  localStorage.getItem('nu_c_user_id');

  return this.httpClient.post<any>(this.api_url + '/updateCustomerInfo', {mobile_no, first_name,last_name, address, address_optional, city, country, state, zip,user_id });
  }

  getCustomerInvoices( user_id){
    // var user_id =  localStorage.getItem('nu_c_user_id');

    return this.httpClient.post<any>(this.api_url + '/getCustomerInvoices',{user_id })

  }

  updateCustomerCard(user_id ,stripe_token,card_id){
    return this.httpClient.post<any>(this.api_url + '/updateCustomerCard',{user_id ,stripe_token,card_id })

  } 

  addNewCompany(companyData){
    var user_id =  localStorage.getItem('nu_c_user_id');
  // let storesData  = JSON.parse(companyData);  
  let CompanyData = {
    "CompanyData":companyData,
    "user_id":user_id
  }

  return this.httpClient.post<any>(this.api_url + '/addNewCompany',{ CompanyData})
  }


  addNewStore(StoreData){
    var user_id =  JSON.parse(localStorage.getItem('nu_c_user_id'));
    var company_id = JSON.parse(localStorage.getItem('company_id'));
    
  
    return this.httpClient.post<any>(this.api_url + '/addNewStore',{company_id,user_id,StoreData})


  }

  getUserCompanies(){
    var user_id =  localStorage.getItem('nu_c_user_id');
    return this.httpClient.post<any>(this.api_url + '/getUserCompanies',{user_id})
  }

  getUserStores(company_id){
    var user_id =  JSON.parse(localStorage.getItem('nu_c_user_id'));

    
    return this.httpClient.post<any>(this.api_url + '/getUserStores',{company_id,user_id})
  }

// api for allot-licences//

   UserPurchasedProducts(){
    var user_id =  localStorage.getItem('nu_c_user_id');
     var forLicenseAllot = 1
    return this.httpClient.post<any>(this.api_url + '/getUserPurchasedProducts',{user_id,forLicenseAllot}) 

   }

   createAdminUser(AdminData){
    var user_id =  localStorage.getItem('nu_c_user_id');
    var subscription_id = localStorage.getItem('subscription_id')
    return this.httpClient.post<any>(this.api_url + '/createAdminUser',{user_id, subscription_id,AdminData})
   }

   getAdminUsers(){
    var user_id =  localStorage.getItem('nu_c_user_id');
    return this.httpClient.post<any>(this.api_url + '/getAdminUsers',{user_id})
   }

   isEmailRegisterd(email: string) {    
return this.httpClient.post<any>(this.api_url + '/validateEmail',{email})     
}

checkPasswordToken( p_token){
// console.log(token);
  return this.httpClient.post<any>(this.api_url + '/checkPasswordToken',{ p_token})     
 
}

 
updateCustomerSubscription(subscriptionData){
  var user_id =  localStorage.getItem('nu_c_user_id');

  return this.httpClient.post<any>(this.api_url + '/updateCustomerSubscription',{user_id,subscriptionData})

}

updateSubscriptionAdmin(admin_user_id){
  var subscription_id = localStorage.getItem('subscription_id')
 

 return this.httpClient.post<any>(this.api_url +'/updateSubscriptionAdmin',{subscription_id,admin_user_id})
}

getUnAllottedLicensesList(){
  var user_id =  localStorage.getItem('nu_c_user_id');
  return this.httpClient.post<any>(this.api_url + '/getUnAllottedLicensesList',{user_id})

}

checkIfCompanyAllotted(company_id){
  return this.httpClient.post<any>(this.api_url + '/checkIfCompanyAllotted',{company_id})

}

validateAdminUser( admin_user_id,product_id){
  // var user_id =  localStorage.getItem('nu_c_user_id');
  return this.httpClient.post<any>(this.api_url + '/validateAdminUser',{ admin_user_id,product_id })

}


updateAdminUserPassword(subscription_id){

  return this.httpClient.post<any>(this.api_url + '/updateAdminUserPassword',{ subscription_id })


}



}



