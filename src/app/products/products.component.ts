import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import {Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  Products: any[] = [];
   Data = [];
   show = false
   trailversion = true
   showBtnDiv1=false
   showBtnDiv2=true
   price = ''

  constructor(private user:UserService,private router: Router,private spinner: NgxSpinnerService) { 
  var user_id = localStorage.getItem('nu_c_user_id');
    if(user_id !== null){
        this.showBtnDiv1=true
        this.showBtnDiv2=false
        this.show = true;
        this.trailversion = false;
  }

}

  ngOnInit(): void {
    if(localStorage.getItem('unllotesLinces') == 'yes'){
      this.router.navigate(['/allot-licences'])
    }
    this.spinner.show();
    this.getAllProducts();
    
  }

  getAllProducts() {
    this.user.getAllProducts().subscribe((data: any) => {
      console.log(data);
      this.Products = data.products
      this.price = data.settings.Trial_period
      this.spinner.hide();
      //  console.log(this.Products)        
          });
  }

  RemoveOldData(){
    localStorage.removeItem("FilterProduct");
  
    localStorage.removeItem("OverallTotal");
  
    localStorage.removeItem("FilterProducts");
  
  
   } 

}
