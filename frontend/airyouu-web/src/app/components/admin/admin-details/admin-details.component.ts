import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.scss'],
})
export class AdminDetailsComponent implements OnInit {
  adminForm = new FormGroup({
    admin_id: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    name: new FormControl({ value: '', disabled: true }),
  });
  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = this.route.snapshot.paramMap.get('adminId');
      if (!id) {
        this.adminForm = new FormGroup({
          admin_id: new FormControl({ value: '', disabled: true }),
          email: new FormControl(''),
          name: new FormControl(''),
        });
        return;
      }
      this.adminService.GetAdmin(id).subscribe(
        (result) => {
          this.adminForm.controls.admin_id.setValue(result.data.admin_id);
          this.adminForm.controls.email.setValue(result.data.email);
          this.adminForm.controls.name.setValue(result.data.name);
        },
        (err) => {
          if (err.error && err.error.msg === 'USER_NOT_FOUND') {
            this.adminForm = new FormGroup({
              admin_id: new FormControl({ value: '', disabled: true }),
              email: new FormControl(''),
              name: new FormControl(''),
            });
          }
        }
      );
    });
  }

  onEnableEdit(name: string) {
    this.adminForm.controls[name].enable();
  }
  onUpdate(name: string) {
    console.log('blur!');
    this.adminForm.controls[name].disable();
  }
}
