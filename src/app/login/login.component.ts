import { Component, OnInit , OnDestroy} from '@angular/core';
import {Router, ActivatedRoute,} from "@angular/router";
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router , private user:UserService,private Router: ActivatedRoute) { }

  ngOnInit(): void {
    document.body.classList.add('signinbg');

    // let params = this.Router.snapshot.queryParams;
    // console.log(params);
    if(localStorage.getItem('proDuctid') !==null){
    this.Router.paramMap.subscribe(params => {
           console.log(params);
           if(params){
            const gotoChekout = 'yes'
             localStorage.setItem('gotoCheckout',gotoChekout)
           }
         
    }); 
  }
  }

  ngOnDestroy(): void {
     document.body.classList.remove('signinbg');
  }

  emailError:string = '';
  passwordError:string = '';

  checkInput(input){
    if(input == 'email')
    this.emailError = '';
    if(input == 'password')
    this.passwordError = '';
    }


  loginUser(event){
  	event.preventDefault();
  	const target = event.target;
  	const email = target.querySelector("#email").value;
  	const password = target.querySelector("#password").value;
  	this.user.loginRequest(email,password).subscribe(
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
          var checkout = localStorage.getItem('gotoCheckout')
          this.user.getUnAllottedLicensesList().subscribe((res)=>{
            console.log(res);  
            if(res.status == 1){
             const unllotedLinces = 'yes';
             localStorage.setItem('unllotesLinces',unllotedLinces); 
              this.router.navigate(['/allot-licences'])
            }   
          else if(checkout == 'yes'){
            const proDuctid = localStorage.getItem('proDuctid')
            this.router.navigate(['checkout/'+proDuctid])
          }else{
            this.router.navigate(['/subscriptions']);
          }
        })
        }
  		}
  	);
  }




}
