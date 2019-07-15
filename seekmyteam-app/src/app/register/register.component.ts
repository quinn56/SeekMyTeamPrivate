import { Component, NgModule } from '@angular/core';
import { RegisterModalComponent } from './register-modal.component';

@Component({
    templateUrl: './register.component.html'
})

@NgModule({
    declarations: [
        RegisterModalComponent
    ]
})

export class RegisterComponent {
    constructor() {}
}