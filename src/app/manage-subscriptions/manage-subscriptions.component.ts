import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {Router} from "@angular/router";

@Component({
  selector: 'app-manage-subscriptions',
  templateUrl: './manage-subscriptions.component.html',
  styleUrls: ['./manage-subscriptions.component.css']
})
export class ManageSubscriptionsComponent implements OnInit {

  constructor(private userService: UserService,private spinner: NgxSpinnerService,private Router: Router) { }
  productData = [];
    TotalAmount = ''
  ngOnInit(): void {
        // document.body.classList.add('bgbnnerimg');

    if(localStorage.getItem('unllotesLinces') == 'yes'){
      this.Router.navigate(['/allot-licences'])
    }
    this.spinner.show();
    // document.body.classList.add('bgbnnerimg');
    if (localStorage.getItem('nu_first_name') !== null) {
      const user_id = localStorage.getItem('nu_c_user_id')

      this.userService.getUserPurchasedProducts(user_id).subscribe((data: any) => {
        console.log(data);
        this.productData = data.purchased_products;
        this.TotalAmount = data.total_monthly
        this.spinner.hide();
        // this.productData = data.purchased_products; 
        // if (data.status == 1) {
        //   this.showNoRecord = false;
        // } else {
        //   this.showNoRecord = true
        // }
      })


    }


  }


  ngOnDestroy(): void {
    document.body.classList.remove('bgbnnerimg');
  }

}
