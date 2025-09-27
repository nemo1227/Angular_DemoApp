import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showLogin: boolean = true; // start with login form

  // RegisterForm fields
  regUsername: string = '';
  regEmail: string = '';
  regPassword: string = '';
  constructor(private loginService: LoginService) {}

  toggleForm(event: Event) 
{
    event.preventDefault(); // prevent page reload on link click
    this.showLogin = !this.showLogin;
  }
  onSignIn() 
  {
    
  }
  onRegister()
  {
    if (!this.isPasswordValid(this.regPassword)) 
    {
      alert("❌ Password must be at least 15 characters OR at least 8 characters including a number and an uppercase letter.");
      return;
    }
    // If valid, continue with registration
    const newUser = {
      username: this.regUsername,
      email: this.regEmail,
      password: this.regPassword
    };
  }
  private isPasswordValid(password: string): boolean 
  {
    const longEnough = password.length >= 15;
    const strongEnough = password.length >= 8 &&
                         /[A-Z]/.test(password) &&
                         /\d/.test(password);
    return longEnough || strongEnough;
  }
}
