import { Component, OnInit } from '@angular/core'; 
import { UserService } from '../services/user.service';
import {Router,ActivatedRoute} from "@angular/router";
@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent implements OnInit {

  constructor(private user:UserService,private router: ActivatedRoute,private Router: Router) { }
  product=[]
  show = false;
  trailversion = true;

  ngOnInit(): void {
    if(localStorage.getItem('unllotesLinces') == 'yes'){
      this.Router.navigate(['/allot-licences'])
    }
  	var user_id = localStorage.getItem('nu_c_user_id');
	if(user_id !== null){
	  this.show = true;
	  this.trailversion = false; 
  }
this.router.paramMap.subscribe(params=>{
  this.user.GetProductbyId(params.get('id')).subscribe((res: any)=>{ 
    console.log(res);
   this.product = res.product_info

  })


})
  
  }

 RemoveOldData(){
  localStorage.removeItem("FilterProduct");

  localStorage.removeItem("OverallTotal");

  localStorage.removeItem("FilterProducts");


 } 

}
