import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-beta',
  templateUrl: './register-beta.component.html'
})
export class RegisterBetaComponent implements OnInit {

  constructor(  
    private router: Router,
    ) { }

  ngOnInit() {
  }

}
