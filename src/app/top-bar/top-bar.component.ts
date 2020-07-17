import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import {Router} from "@angular/router";
import {Observable} from 'rxjs'; // Angular 6 
import { interval } from 'rxjs';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
   condition = true;
   logout = false;
   account = false;
   Products: any[] =[]
  constructor(private router: Router ,private user:UserService,private ref: ChangeDetectorRef,private zone: NgZone) {
   var user_id = localStorage.getItem('nu_c_user_id');
    if(user_id !== null){
      this.condition = false  
      this.logout = true 
      this.account = true
    }
   }

  ngOnInit(): void {

    this.user.getAllProducts().subscribe((data: any) => {
      this.Products = data.products      
    });

  }

Aboutus(){

  this.router.navigate(['/'], { fragment: 'about' });
} 






Logout() {
    localStorage.clear();
    window.scrollTo(0,0);
    this.logout = false;
    this.account = false;
   this.condition = true;
    }
  }



