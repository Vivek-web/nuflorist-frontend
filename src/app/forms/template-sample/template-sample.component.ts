import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-sample',
  templateUrl: './template-sample.component.html',
  styleUrls: ['./template-sample.component.css']
})
export class TemplateSampleComponent implements OnInit {

  states: Array<String> = ['AR', 'AL', 'CA', 'DC'];
  user = { 'fname': 'Bob', 'lname' : 'Smith'};
  constructor() { }

  ngOnInit() {
  }

  submitHandler(myForm) {
    console.log(myForm);
    // console.log('Model Value', this.user);
    // console.log('Form Value is', myForm.value);
  }
}
