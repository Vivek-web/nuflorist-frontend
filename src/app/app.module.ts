import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule} from './app-routing.module';
import { FormsModule } from '@angular/forms'; 
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule }    from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AccountComponent } from './account/account.component';
import { ManageSubscriptionsComponent } from './manage-subscriptions/manage-subscriptions.component';
import { FaqComponent } from './faq/faq.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { ManageLicensesComponent } from './manage-licenses/manage-licenses.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { AllotLicencesComponent } from './allot-licences/allot-licences.component';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { NotificationComponent } from './notification/notification.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProductsComponent,
    SignupComponent,
    ForgotPasswordComponent,
    AccountComponent,
    ManageSubscriptionsComponent,
    FaqComponent,
    ProductInfoComponent,
    CheckoutComponent,
    ThankyouComponent,
    TopBarComponent,
    FooterComponent,
    HomeComponent,
    ResetPasswordComponent,
    PasswordResetComponent,
    EditCompanyComponent,
    ManageLicensesComponent,
    AddCompanyComponent,
    AccountSettingsComponent,
    ChangePasswordComponent,
    InvoicesComponent,
    SubscriptionsComponent,
    AllotLicencesComponent,
    JwPaginationComponent,
    NotificationComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
