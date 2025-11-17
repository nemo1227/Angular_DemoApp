import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login.service';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent 
{
  token: string = '';
  loading = false;
  message = '';
  form!: FormGroup;
  isSuccess = false;
  constructor(private route: ActivatedRoute, private loginService: LoginService, private fb: FormBuilder) {}
  ngOnInit() 
  {
    this.token = this.route.snapshot.queryParamMap.get('token')!;
    this.form = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }
  
  
  submit()
  {
    if (this.form.invalid) {
      this.message = "Please fill all fields correctly.";
      this.isSuccess = false;
      return;
    }
    if (this.form.value.password !== this.form.value.confirmPassword) 
    {
      this.message = "Passwords do not match";
      this.isSuccess = false;
      return;
    }
    this.loading = true;
    this.loginService.resetPassword(this.token, this.form.value.otp, this.form.value.password).subscribe({
      next: () => {
        this.message = "Password reset successful. You can now log in with your new password.";
        this.isSuccess = true; 
        this.loading = false;
      },
      error: (error) => {
        this.message =  "An error occurred during password reset.";
        console.error("Reset Password Error:", error);
        this.loading = false;
        this.isSuccess = false;
      }
    });
  }
}
