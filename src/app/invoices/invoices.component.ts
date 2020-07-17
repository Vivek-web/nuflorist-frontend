import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({ 
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  constructor(private userService: UserService, private spinner: NgxSpinnerService) { }
  loggedInUserName: string = 'User';
  loggedInUserFirstName: string = 'User';
  loggedInUserEmail: string = '';
  productData = [];
  showNoRecord = false;
  p: number = 1;
  paginationhide = true;

  ngOnInit(): void {
    this.spinner.show();
    // document.body.classList.add('bgbnnerimg');
    if (localStorage.getItem('nu_first_name') !== null) {
      this.loggedInUserFirstName = localStorage.getItem('nu_first_name'); 
      this.loggedInUserName = localStorage.getItem('nu_first_name');
      this.loggedInUserEmail = localStorage.getItem('nu_email');
      const user_id = localStorage.getItem('nu_c_user_id')

      this.userService.getCustomerInvoices(user_id).subscribe((data: any) => {
        console.log(data);
        this.spinner.hide();
        this.productData = data.invoices;
        if (data.status == 1) {
          this.showNoRecord = false;
        } else {
          this.showNoRecord = true
          this.paginationhide = false;

        }
      })


    }
  }

  // ngOnDestroy(): void {
  //   document.body.classList.remove('bgbnnerimg');
  // }

}
