import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private userService: UserService, private Spinner: NgxSpinnerService) { }
  loggedInUserName:string='User';
  loggedInUserFirstName:string = 'User';
  loggedInUserEmail:string='';
   spinner = false;
   done = false;
  ngOnInit(): void {
    this.Spinner.show();
    if(localStorage.getItem('nu_first_name') !== null){
      this.loggedInUserFirstName  = localStorage.getItem('nu_first_name');
      this.loggedInUserName =  localStorage.getItem('nu_first_name');
      this.loggedInUserEmail=localStorage.getItem('nu_email');
      this.Spinner.hide(); 
    }
  }    

  message: string = '';
   OldPassError:string = '';
  newPassError:string = ''; 
  confirmPassError:string = '';  


Submit(event){
  this.spinner = true;
  event.preventDefault();
  const target = event.target;
   const oldPass = target.querySelector("#oldPassword").value;
   const newPass = target.querySelector("#Newpassword").value;
   const confirmPass = target.querySelector("#Confirmpassword").value;
   const user_id =  localStorage.getItem('nu_c_user_id')
   this.userService.changeUserPassword(oldPass,newPass,confirmPass,user_id  ).subscribe(res =>{
      console.log(res);
      if(res.status == 2){
        this.spinner = false;
        this.OldPassError = res.validationErrors.oldPassword;
        this.newPassError = res.validationErrors.newPassword;
        this.confirmPassError = res.validationErrors.confirmPassword;

      }else{
        if(res.status == 1){
          this.spinner = false;
          this.done = true;
          setTimeout(() => {
            this.done = false;
          }, 2000);
         
        this.message = res.message;
        }
        this.OldPassError = '';
        this.newPassError = '';
        this.confirmPassError = '';
      }


   })

 
}



}