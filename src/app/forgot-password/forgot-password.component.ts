import { Component, OnInit , OnDestroy} from '@angular/core';
import { UserService } from '../services/user.service';
import {Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private router: Router ,private user:UserService, private Spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  	document.body.classList.add('signinbg');
  }
  ngOnDestroy(): void {
     document.body.classList.remove('signinbg');
  }
  emailError:string = '';
  forgotPassword(event){
    this.Spinner.show()
    event.preventDefault();
    const target = event.target;
    const email = target.querySelector("#email").value;
    this.user.forgotPassword(email).subscribe(
      resp => {
        if(resp.status == 2){
          this.emailError = resp.validationErrors.email;
          this.Spinner.hide()
        }else{
          this.Spinner.hide()
          this.router.navigate(['/forgot-success']);
          
        }
      }
    );
  }

}
