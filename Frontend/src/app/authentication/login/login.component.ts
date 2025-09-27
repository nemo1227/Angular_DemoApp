import { Component } from '@angular/core';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  serverResponse: string = '';
  constructor(private loginService: LoginService) {}
  onSignIn() {
    this.loginService.testServer().subscribe({
      next: (res) => {
        this.serverResponse = res;
      },
      error: (err) => {
        this.serverResponse = '❌ Error: Could not reach server';
        console.error(err);
      }
    });
  }
}
