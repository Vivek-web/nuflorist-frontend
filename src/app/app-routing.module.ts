import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { ProductsComponent } from './products/products.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { ManageSubscriptionsComponent } from './manage-subscriptions/manage-subscriptions.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { FaqComponent } from './faq/faq.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { AddCompanyComponent } from './add-company/add-company.component'; 
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ManageLicensesComponent } from './manage-licenses/manage-licenses.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { AllotLicencesComponent } from './allot-licences/allot-licences.component';
import { NotificationComponent } from './notification/notification.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import {AuthGuardService} from './auth-guard.service'
const routes: Routes = [
  { path: 'account', component: AccountComponent,canActivate:[AuthGuardService] },
  { path: 'products', component: ProductsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:id', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'product-info/:id', component: ProductInfoComponent },
  { path: 'checkout/:id', component: CheckoutComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'thankyou', component: ThankyouComponent,canActivate:[AuthGuardService] },
  { path: 'allot-licences', component: AllotLicencesComponent,canActivate:[AuthGuardService] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'manage-subscriptions', component: ManageSubscriptionsComponent,canActivate:[AuthGuardService] },
  { path: 'forgot-success', component: ResetPasswordComponent },
  { path: 'resetPassword/:id', component: PasswordResetComponent },
  { path: 'edit-company/:id', component: EditCompanyComponent,canActivate:[AuthGuardService] },
  { path: 'add-company', component: AddCompanyComponent,canActivate:[AuthGuardService] },
  { path: 'subscriptions', component: SubscriptionsComponent,canActivate:[AuthGuardService] },
  { path: 'notification', component: NotificationComponent },
  { path: 'account-settings', component: AccountSettingsComponent,canActivate:[AuthGuardService] },
  { path: 'invoices', component: InvoicesComponent,canActivate:[AuthGuardService] },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },

  { path: 'manage-licenses/:id', component: ManageLicensesComponent,canActivate:[AuthGuardService] },
  {path:  'change-password',component:ChangePasswordComponent},
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 