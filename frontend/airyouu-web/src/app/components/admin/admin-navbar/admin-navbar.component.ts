import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss'],
})
export class AdminNavbarComponent implements OnInit {
  @Output() toggleDrawer = new EventEmitter();
  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {}
  getProfile(): Profile<Admin> | null {
    return this.adminService.profile;
  }
  logout() {
    this.adminService.LogOut();
    this.router.navigate(['/user/auth']);
  }
}
