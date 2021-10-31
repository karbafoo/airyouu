import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from './../../../services/admin/admin.service';
@Component({
  selector: 'app-admin-auth',
  templateUrl: './admin-auth.component.html',
  styleUrls: ['./admin-auth.component.scss'],
})
export class AdminAuthComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('karbafoo@gmail.com'),
    password: new FormControl('12345678'),
  });

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {}

  onLogin(e: Event) {
    e.preventDefault();
    console.log('this.loginForm.value', this.loginForm.value);
    this.adminService.Login(this.loginForm.value).subscribe((result) => {
      if (result.success) {
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }
}
