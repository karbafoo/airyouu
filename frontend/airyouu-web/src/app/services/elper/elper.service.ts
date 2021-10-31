import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ElperService {
  constructor(private http: HttpClient) {}

  GetRouteBetween(points: LatLng[]): Observable<any> {
    const data = {
      locations: points.map((point) => ({ latLng: point })),
      options: {
        avoids: [],
        avoidTimedConditions: false,
        doReverseGeocode: true,
        shapeFormat: 'raw',
        generalize: 0,
        routeType: 'fastest',
        timeType: 1,
        locale: 'en_US',
        unit: 'k',
        enhancedNarrative: false,
        drivingStyle: 2, //1 for freight = cautios
        highwayEfficiency: 25.0,
      },
    };
    return this.http.post<any>(
      'http://www.mapquestapi.com/directions/v2/route?key=' +
        environment.mapQuestApiKey,
      data
    );
  }
}
