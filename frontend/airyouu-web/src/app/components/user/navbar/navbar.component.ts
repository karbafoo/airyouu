import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() toggleDrawer = new EventEmitter();
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  getProfile(): Profile<User> | null {
    return this.userService.profile;
  }
  goHome() {
    this.router.navigate(['/user/dashboard']);
  }
  logout() {
    this.userService.LogOut();
    this.router.navigate(['/user/auth']);
  }
}
