import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import * as Leaflet from 'leaflet';
import { ElperService } from 'src/app/services/elper/elper.service';
import { UserService } from 'src/app/services/user/user.service';
import { AnimatedMarker } from '../../admin/admin-delivery-details/admin-delivery-details.component';
@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss'],
})
export class DeliveryDetailsComponent implements OnInit {
  //@ts-ignore
  @ViewChild('itemTable') itemTable: MatTable<any>;
  //@ts-ignore
  @ViewChild('pointTable') pointTable: MatTable<any>;
  map: Leaflet.Map | null = null;

  displayedItemColumns: string[] = ['name', 'quantity', 'weight', 'volume'];
  displayedPointColumns: string[] = ['status', 'name', 'position', 'foo'];

  package: Package | null = null;
  markers: Leaflet.Marker[] = [];
  movingmarkers: Leaflet.Marker[] = [];
  polygons: Leaflet.Polyline[] = [];
  routes: any[] = [];

  constructor(
    private userService: UserService,
    private elperService: ElperService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.map = Leaflet.map('map').setView([26.6448, 55.216721], 2);
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        //@ts-ignore
      }).addTo(this.map);
      this.DoMarkers();
    }, 1);

    this.route.queryParams.subscribe((params) => {
      const id = this.route.snapshot.paramMap.get('packageId');
      if (id) {
        this.LoadPackage(id);
      }
    });
  }
  getRoutes(): LatLng[][] {
    return this.routes;
  }

  playROute(route: LatLng[]): void {
    if (this.map) {
      for (let i = 0; i < this.movingmarkers.length; i++) {
        this.map.removeLayer(this.movingmarkers[i]);
      }
      const m = new AnimatedMarker(
        new Leaflet.LatLng(Number(route[0].lat), Number(route[0].lng)),
        {
          icon: Leaflet.icon({
            iconUrl: 'assets/icons/c7.png',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        },
        route
      ).addTo(this.map);
      this.movingmarkers.push(m);
    }
  }
  getItems() {
    return this.package?.items || [];
  }
  getPoints() {
    return this.package?.points || [];
  }

  getLastPending(i: number): boolean {
    return (
      this.package?.points.findIndex((p: Point) => p.status === 'pending') === i
    );
  }
  LoadPackage(id: string): void {
    this.userService.GetPackage(id).subscribe(
      (result) => {
        this.package = result.data;
        this.DoMarkers();
      },
      (err) => (this.package = null)
    );
  }
  DoMarkers(): void {
    if (this.map) {
      for (let i = 0; i < this.markers.length; i++) {
        this.map.removeLayer(this.markers[i]);
      }
      this.markers = [];
      const points: Point[] = this.package?.points || [];
      for (let i = 0; i < points.length; i++) {
        const marker = Leaflet.marker(
          new Leaflet.LatLng(
            Number(points[i].position.lat),
            Number(points[i].position.lng)
          )
        ).addTo(this.map);
      }
      if (points.length > 1) {
        this.elperService
          .GetRouteBetween(points.map((p) => p.position))
          .subscribe((result) => {
            console.log('result', result);
            this.routes = [];
            const legIndexes: number[] = result.route.shape.legIndexes;
            const shapePoints: LatLng[][] = new Array(
              legIndexes.length ? legIndexes.length - 1 : 0
            )
              .fill(0)
              .map((i) => []);
            for (let i = 1; i < legIndexes.length; i++) {
              const shapeArr = result.route.shape.shapePoints.slice(
                legIndexes[i - 1] * 2,
                legIndexes[i] * 2
              );
              for (let j = 0; j < shapeArr.length; j += 2) {
                shapePoints[i - 1].push({
                  lat: shapeArr[j],
                  lng: shapeArr[j + 1],
                });
              }
            }
            this.routes = shapePoints;
            for (let i = 0; i < shapePoints.length; i++) {
              const poly = Leaflet.polyline(
                shapePoints[i].map((p) => [Number(p.lat), Number(p.lng)]),
                { color: POLY_COLORS[i % POLY_COLORS.length] }
                //@ts-ignore
              ).addTo(this.map);
              this.polygons.push(poly);
            }
            this.map?.fitBounds(
              shapePoints
                .reduce((s, v) => [...s, ...v], [])
                .map((i) => [Number(i.lat), Number(i.lng)])
            );
          });
      }
    }
  }
}
const POLY_COLORS = ['red', 'green', 'blue'];
