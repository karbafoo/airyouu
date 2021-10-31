import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss'],
})
export class DeliveryListComponent implements OnInit {
  displayedColumns: string[] = ['package_id', 'user', 'items', 'points'];
  packages: Package[] = [];
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.GetPackages().subscribe((result) => {
      this.packages = result.data;
    });
  }

  getPackages(): Package[] {
    return this.packages;
  }
}
