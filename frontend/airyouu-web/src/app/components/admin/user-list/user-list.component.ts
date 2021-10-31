import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['user_id', 'name', 'email'];
  users: Profile<User>[] = [];
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.GetUsers().subscribe((result) => {
      this.users = result.data;
    });
  }

  GetUsers(): Profile<User>[] {
    return this.users;
  }
}
