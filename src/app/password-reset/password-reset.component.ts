import { Component, OnInit , OnDestroy} from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Params, Router, ActivatedRouteSnapshot } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
Tokenmessage = ''
message = '';
  constructor(private Router: Router,private router:ActivatedRoute ,private user:UserService,private Spinner: NgxSpinnerService) { } 

  ngOnInit(): void {
    document.body.classList.add('signinbg');


this.router.paramMap.subscribe(params =>{
  console.log(params.get('id'))
this.user.checkPasswordToken(params.get('id')).subscribe((res)=>{
  console.log(res);
  if(res.user_id !== null){
   localStorage.setItem('user_id',res.user_id);
  }


  if(res.status == 2 ){
    this.Router.navigate(['/login']);
  }
  if(res.status == 3){
    this.Tokenmessage = 'Token do not matched'
    setTimeout(() => this.Router.navigate(['/login']) , 1000) 
    this.Tokenmessage = ''
  }
})

})


  }
  ngOnDestroy(): void {
     document.body.classList.remove('signinbg');
  }
  passwordError:string = '';
  confirmPasswordError:string = '';

  passwordReset(event){
    this.Spinner.show()
  	event.preventDefault();
  	const target = event.target;
  	const password = target.querySelector("#password").value;
  	const confirmPassword = target.querySelector("#confirmPassword").value;
  	this.user.passwordReset(password,confirmPassword).subscribe(
  	  resp => {
        if(resp.status == 2){
          this.Spinner.hide()
          this.passwordError = resp.validationErrors.password;
          this.confirmPasswordError = resp.validationErrors.confirmPassword; 
        }else{
          this.Spinner.hide()
          this.passwordError = '';
          this.confirmPasswordError = '';
          this.message = 'Password has been Updated'
             setTimeout(() => this.Router.navigate(['/login']) , 1000)
  
          // this.Router.navigate(['/login']);
        }
  		}
  	);
  }

}
