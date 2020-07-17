import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private Spinner: NgxSpinnerService,private Router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('unllotesLinces') == 'yes'){
      this.Router.navigate(['/allot-licences'])
    }
  }
 


}
