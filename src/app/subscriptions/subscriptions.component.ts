import { Component, OnInit,OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

  constructor(private userService: UserService, private spinner: NgxSpinnerService, private router:Router) { }
  loggedInUserName: string = 'User';
  loggedInUserFirstName: string = 'User';
  loggedInUserEmail: string = '';
  productData = [];
  showNoRecord = false;
  paginationhide = true;

  p: number = 1;
  ngOnInit(): void {
    if(localStorage.getItem('unllotesLinces') == 'yes'){
      this.router.navigate(['/allot-licences'])
    }
    this.spinner.show();
    // document.body.classList.add('bgbnnerimg');
    if (localStorage.getItem('nu_first_name') !== null) {
      this.loggedInUserFirstName = localStorage.getItem('nu_first_name');
      this.loggedInUserName = localStorage.getItem('nu_first_name');
      this.loggedInUserEmail = localStorage.getItem('nu_email');
      const user_id = localStorage.getItem('nu_c_user_id')  
      this.userService.getUserPurchasedProducts(user_id).subscribe((data: any) => {
        console.log(data);
        this.spinner.hide();
        this.productData = data.purchased_products;
      
        if (data.status == 1) {

          this.showNoRecord = false;
        } else {
          this.showNoRecord = true;
          this.paginationhide = false;
        }
      })

  }

}



Select(id){
console.log(id);
this.router.navigate(['/manage-licenses/'+ id])
}


}