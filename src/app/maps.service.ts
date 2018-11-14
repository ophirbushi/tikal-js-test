import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { getDistance } from 'geolib';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private _apiLoaded$ = new BehaviorSubject<boolean>(false);
  get apiLoaded$(): Observable<boolean> { return this._apiLoaded$.asObservable(); }

  constructor(private mapsAPILoader: MapsAPILoader) {
    this.mapsAPILoader.load()
      .then(() => this._apiLoaded$.next(true));
  }

  getCoordinates(address: string): Observable<Coordinates> {
    return this.apiLoaded$
      .pipe(
        filter(loaded => loaded === true),
        switchMap(() => {
          const geocoder = new google.maps.Geocoder();
          return new Promise((resolve, reject) => {
            geocoder.geocode({ address }, (response, status) => {
              if (status !== 'OK' || !response.length) {
                reject(status);
              } else {
                const { lng, lat } = response[0].geometry.location;
                resolve({
                  longitude: lng(),
                  latitude: lat()
                });
              }
            });
          });
        }),
        take<Coordinates>(1)
      );
  }

  getDistanceBetweenCoordinates(a: Coordinates, b: Coordinates): number {
    return getDistance(a, b);
    // return Math.sqrt(
    //   Math.pow(b.longitude - a.longitude, 2) + Math.pow(b.latitude - a.latitude, 2)
    // );
  }
}

export interface Coordinates {
  longitude: number;
  latitude: number;
}

declare var google;
