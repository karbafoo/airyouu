import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent implements OnInit {
  displayedColumns: string[] = ['admin_id', 'name', 'email'];
  admins: Profile<Admin>[] = [];
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.GetAdmins().subscribe((result) => {
      this.admins = result.data;
    });
  }

  getAdmins(): Profile<Admin>[] {
    return this.admins;
  }
}
