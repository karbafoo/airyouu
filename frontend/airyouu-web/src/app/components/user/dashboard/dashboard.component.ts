import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  packages: Package[] = [];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.GetPackages().subscribe((result) => {
      this.packages = result.data;
    });
  }
}
