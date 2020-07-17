import { Component, OnInit , OnDestroy} from '@angular/core';
import { UserService } from '../services/user.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private router:Router,private user:UserService) { }

  ngOnInit(): void {
    document.body.classList.add('signinbg');
  }

  ngOnDestroy(): void {
     document.body.classList.remove('signinbg');
  }

  emailError:string = '';
  passwordError:string = '';
  signupSuccess='';
  

  checkInput(input){
    if(input == 'email')
    this.emailError = '';
    if(input == 'password')
    this.passwordError = '';
    }

  signupUser(event){
  	event.preventDefault();
  	const target = event.target;
  	const email = target.querySelector("#email").value;
  	const password = target.querySelector("#password").value;
  	this.user.signupRequest(email,password).subscribe(
  	  resp => {
	         if(resp.status == 2){
	           this.emailError = resp.validationErrors.email;
	           this.passwordError = resp.validationErrors.password;
	         }else{
				this.emailError = '';
          		this.passwordError = '';
	            localStorage.setItem('nu_c_user_id', resp.id);
				localStorage.setItem('nu_email', resp.email);
				localStorage.setItem('nu_first_name', resp.first_name);
				localStorage.setItem('nu_last_name', resp.last_name);
				this.router.navigate(['/subscriptions']);
			   
	         }
  		}
  	);
  }
}
