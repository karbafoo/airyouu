import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from './../../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  form_type = 0;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('12345'),
    name: new FormControl(''),
  });

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  getFormType(i?: AuthFormType) {
    return AuthFormType[i || this.form_type];
  }

  toggleFormType(e: Event) {
    e.preventDefault();
    this.form_type = this.form_type ? 0 : 1;
  }

  onAuth(e: Event) {
    e.preventDefault();
    console.log('this.loginForm.value', this.loginForm.value);
    if (this.form_type === AuthFormType.Login) {
      this.userService.Login(this.loginForm.value).subscribe((result) => {
        if (result.success) {
          this.router.navigate(['/user/dashboard']);
        }
      });
    } else {
      this.userService.SignUp(this.loginForm.value).subscribe((result) => {
        if (result.success) {
          this.form_type = AuthFormType.Login;
        }
      });
    }
  }
  onLogin(e: Event) {
    e.preventDefault();
    console.log('this.loginForm.value', this.loginForm.value);
  }
}
enum AuthFormType {
  'Login',
  'Signup',
}
