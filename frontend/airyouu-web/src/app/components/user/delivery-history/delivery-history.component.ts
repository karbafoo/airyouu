import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import * as Leaflet from 'leaflet';
@Component({
  selector: 'app-delivery-history',
  templateUrl: './delivery-history.component.html',
  styleUrls: ['./delivery-history.component.scss'],
})
export class DeliveryHistoryComponent implements OnInit {
  displayedColumns: string[] = [
    'status',
    'package_id',
    'user',
    'items',
    'points',
  ];
  packages: Package[] = [];
  map: Leaflet.Map | null = null;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.map = Leaflet.map('map').setView([26.6448, 55.216721], 2);
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        //@ts-ignore
      }).addTo(this.map);
      this.DoMarkers();
    }, 1);

    this.userService.GetPackages().subscribe((result) => {
      this.packages = result.data;
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
              '<a href="/user/dashboard/delivery/details/' +
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
}
