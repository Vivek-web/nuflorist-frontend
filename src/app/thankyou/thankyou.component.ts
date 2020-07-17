import { Component, OnInit , OnDestroy} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router'

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {
  PurchaseProducts = [];
  cartTotal = 0;
  constructor(private Router:Router) { }

  ngOnInit(): void {
    document.body.classList.add('orderbg'); 
    // if user direct type thankyou //
    if(localStorage.getItem("FilterProduct") == null){
        this.Router.navigate(['/'])
    }
    const unllotedLinces = 'yes';
    localStorage.setItem('unllotesLinces',unllotedLinces); 
    this.PurchaseProducts =  JSON.parse(localStorage.getItem("FilterProduct"))
    this.cartTotal = JSON.parse(localStorage.getItem('OverallTotal'));
    
    localStorage.removeItem("FilterProduct");
    localStorage.removeItem('OverallTotal');
    localStorage.removeItem('CustmoreInformation');
    // localStorage.removeItem('Fil')
  }

  ngOnDestroy(): void {
     document.body.classList.remove('orderbg');
  }

}
