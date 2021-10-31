import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { AdminService } from 'src/app/services/admin/admin.service';
@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss'],
})
export class AdminOverviewComponent implements OnInit {
  map: Leaflet.Map | null = null;
  packages: Package[] = [];
  packageStatuss = [0, 0, 0];
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.map = Leaflet.map('map').setView([26.6448, 55.216721], 2);
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        //@ts-ignore
      }).addTo(this.map);
      this.DoMarkers();
    }, 1);

    this.adminService.GetPackages().subscribe((result) => {
      this.packages = result.data;
      this.packageStatuss = this.packages.reduce(
        (s, p) => {
          if (p.status === 'pending') {
            s[0] = s[0] + 1;
          } else if (p.status === 'done') {
            s[1] = s[1] + 1;
          } else if (p.status === 'cancelled') {
            s[2] = s[2] + 1;
          }
          return s;
        },
        [0, 0, 0]
      );
      this.DoMarkers();
    });
  }

  DoMarkers(): void {
    if (this.map) {
      for (let k = 0; k < this.packages.length; k++) {
        const points = this.packages[k].points;
        for (let i = 0; i < points.length; i++) {
          const marker = Leaflet.marker(
            new Leaflet.LatLng(
              Number(points[i].position.lat),
              Number(points[i].position.lng)
            )
          ).addTo(this.map);

          marker
            .bindPopup(
              '<a href="/admin/dashboard/delivery/details/' +
                this.packages[k].package_id +
                '"> Go to package </a>'
            )
            .openPopup();
        }
      }
    }
  }
  getPackages(): Package[] {
    return this.packages;
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
    }
  }
}
