import { Component, OnInit,ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
   Companies = [];
  
  constructor(private spinner: NgxSpinnerService,private userService: UserService,private Router: Router) { }
  noCompanyFound = false;
  paginationhide = true;
  loggedInUserName:string='User';
  loggedInUserFirstName:string = 'User';
  loggedInUserEmail:string='';
  p: number = 1;
  ngOnInit(): void {
    // document.body.classList.add('bgbnnerimg');

    if(localStorage.getItem('unllotesLinces') == 'yes'){
      this.Router.navigate(['/allot-licences'])
    }
    this.spinner.show();

    if(localStorage.getItem('nu_first_name') !== null){
      this.loggedInUserFirstName  = localStorage.getItem('nu_first_name');
      this.loggedInUserName =  localStorage.getItem('nu_first_name');
      this.loggedInUserEmail=localStorage.getItem('nu_email');
     
    }

    if(localStorage.getItem('nu_c_user_id') !== null){
       this.userService.getCompanyAndStores().subscribe(res=>{
         console.log(res);
         this.Companies = res.companies;
         this.spinner.hide();
         if(res.companies.length == 0){
           this.noCompanyFound = true;
           this.paginationhide = false
         
         }
       })

    }

  }    

  // ngOnDestroy(): void {
  //   document.body.classList.remove('bgbnnerimg');
  // }



}
