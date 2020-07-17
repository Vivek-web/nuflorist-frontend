import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  loggedInUserName: string = 'User';
  loggedInUserFirstName: string = 'User';
  loggedInUserEmail: string = ''; 
  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem('nu_first_name') !== null){
      this.loggedInUserFirstName  = localStorage.getItem('nu_first_name');
      this.loggedInUserName =  localStorage.getItem('nu_first_name');
      this.loggedInUserEmail=localStorage.getItem('nu_email');
     
    }



  }

}
