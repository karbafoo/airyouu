import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as Leaflet from 'leaflet';
import { AdminService } from 'src/app/services/admin/admin.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ElperService } from 'src/app/services/elper/elper.service';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './admin-delivery-details.component.html',
  styleUrls: ['./admin-delivery-details.component.scss'],
})
export class AdminDeliveryDetailsComponent implements OnInit {
  //@ts-ignore
  @ViewChild('itemTable') itemTable: MatTable<any>;
  //@ts-ignore
  @ViewChild('pointTable') pointTable: MatTable<any>;
  map: Leaflet.Map | null = null;
  userList: Profile<User>[] = [];
  deliveryForm = new FormGroup({
    user: new FormControl(''),
    items: new FormControl([]),
    points: new FormControl([]),
    status: new FormControl('pending'),
  });

  displayedItemColumns: string[] = ['name', 'quantity', 'weight', 'volume'];
  displayedPointColumns: string[] = ['status', 'name', 'position', 'foo'];

  package: Package | null = null;
  markers: Leaflet.Marker[] = [];
  movingmarkers: Leaflet.Marker[] = [];
  polygons: Leaflet.Polyline[] = [];
  routes: any[] = [];

  statuss = ['pending', 'done', 'cancelled'];
  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
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

    this.adminService.GetUsers().subscribe((result) => {
      this.userList = result.data;
    });

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
  openNewItemModal(): void {
    const dialogRef = this.dialog.open(NewItemModal, {
      width: '250px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.deliveryForm.value.items.push(result);
      this.itemTable.renderRows();
    });
  }
  openNewPointModal(): void {
    const dialogRef = this.dialog.open(NewPointModal, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.deliveryForm.value.points.push(result);
      this.pointTable.renderRows();
      this.DoMarkers();
    });
  }

  getItems() {
    return this.deliveryForm.value.items;
  }
  getPoints() {
    return this.deliveryForm.value.points;
  }

  DoMarkers(): void {
    if (this.map) {
      for (let i = 0; i < this.markers.length; i++) {
        this.map.removeLayer(this.markers[i]);
      }
      this.markers = [];
      const points: Point[] = this.deliveryForm.value.points || [];
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

  getLastPending(i: number): boolean {
    return (
      this.deliveryForm.value.points.findIndex(
        (p: Point) => p.status === 'pending'
      ) === i
    );
  }
  onCreate(): void {
    if (this.package) {
      this.adminService
        .UpdatePackage({
          ...this.deliveryForm.value,
          package_id: this.package.package_id,
        })
        .subscribe((result) => {
          if (result.success) {
            this.package = result.data;
            this.deliveryForm = new FormGroup({
              user: new FormControl(this.package.user.user_id),
              items: new FormControl(this.package.items),
              points: new FormControl(this.package.points),
              status: new FormControl(this.package.status),
            });
            this.DoMarkers();
          }
        });
    } else {
      this.adminService
        .CreateDelivery(this.deliveryForm.value)
        .subscribe((result) => {
          if (result.success) {
            this.deliveryForm = new FormGroup({
              user: new FormControl(''),
              items: new FormControl([]),
              points: new FormControl([]),
              status: new FormControl('pending'),
            });
            this.DoMarkers();
          }
        });
    }
  }

  LoadPackage(id: string): void {
    this.adminService.GetPackage(id).subscribe(
      (result) => {
        this.package = result.data;
        this.deliveryForm = new FormGroup({
          user: new FormControl(this.package.user.user_id),
          items: new FormControl(this.package.items),
          points: new FormControl(this.package.points),
          status: new FormControl(this.package.status),
        });
        this.DoMarkers();
      },
      (err) => (this.package = null)
    );
  }

  setStatus(point: Point, status: string): void {
    this.adminService
      .UpdatePoint({
        ...point,
        point_id: point.point_id,
        status: status,
      })
      .subscribe((result) => {
        if (result.success) {
          this.LoadPackage(this.package?.package_id || '');
        }
      });
  }
  ngOnDestroy(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
    }
  }
}

@Component({
  selector: 'new-item-modal',
  templateUrl: './new-item-modal.html',
})
export class NewItemModal {
  newItemForm = new FormGroup({
    name: new FormControl(''),
    quantity: new FormControl(1),
    weight: new FormControl(0),
    volume: new FormControl(0),
  });
  constructor(
    public dialogRef: MatDialogRef<NewItemModal>,
    @Inject(MAT_DIALOG_DATA) public data: Item
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'new-point-modal',
  templateUrl: './new-point-modal.html',
})
export class NewPointModal implements OnInit {
  map: Leaflet.Map | null = null;
  position: LatLng = { lat: 0, lng: 0 };
  name: string = '';
  marker: any = null;
  constructor(
    private ref: ChangeDetectorRef,
    public dialogRef: MatDialogRef<NewItemModal>,
    @Inject(MAT_DIALOG_DATA) public data: Point
  ) {}
  ngOnInit(): void {
    this.map = Leaflet.map('map1').setView([26.6448, 55.216721], 2);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Karbafoo.eth',
    }).addTo(this.map);

    this.map.on('click', this.onMapClick);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDoneClick(): void {
    this.dialogRef.close(this.getData());
  }
  onMapClick = (e: any) => {
    this.position = {
      lat: e.latlng.lat.toString(),
      lng: e.latlng.lng.toString(),
    };
    if (this.map) {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = Leaflet.marker([
        Number(this.position.lat),
        Number(this.position.lng),
      ]).addTo(this.map);
      if (this.name) {
        this.marker.bindPopup(this.name).openPopup();
      }
    }
  };
  onNameChange(event: any) {
    this.name = event.target.value;
  }
  getData(): Point {
    return {
      status: 'pending',
      name: this.name,
      position: this.position,
    };
  }
}

const POLY_COLORS = ['red', 'green', 'blue'];

export class AnimatedMarker extends Leaflet.Marker {
  speed: number = 100; //ms
  points: LatLng[] = [];
  i: number = 0;

  constructor(
    latLng: Leaflet.LatLng,
    options?: Leaflet.MarkerOptions,
    p?: LatLng[]
  ) {
    super(latLng, options);
    this.setLatLng(latLng);
    this.points = p || [];
  }

  onAdd(map: Leaflet.Map) {
    super.onAdd.call(this, map);
    this.animate();
    return this;
  }

  animate() {
    if (Leaflet.DomUtil.TRANSITION) {
      //@ts-ignore
      if (this._icon) {
        //@ts-ignore
        this._icon.style[Leaflet.DomUtil.TRANSITION] =
          'all ' + this.speed + 'ms linear';
      }
      //@ts-ignore
      if (this._shadow) {
        //@ts-ignore
        this._shadow.style[Leaflet.DomUtil.TRANSITION] =
          'all ' + this.speed + 'ms linear';
      }
    }

    if (this.i < this.points.length) {
      this.setLatLng([
        Number(this.points[this.i].lat),
        Number(this.points[this.i].lng),
      ]);
      this.i += 1;
      setTimeout(() => {
        this.animate();
      }, this.speed);
    }
  }
}
