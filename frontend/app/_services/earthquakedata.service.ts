import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';

import { environment } from '../_helpers/environment';
import { EarthquakeCount, EarthquakeData } from '../_models';

@Injectable({ providedIn: 'root' })
export class EarthquakeDataService {

    //Observable Earthquake data to be accessed by components
    private allEqDataSubject: ReplaySubject<any> = new ReplaySubject<any>(1);
    allEarthquakeData$: Observable<any>;


    constructor(
        private router: Router,
        private http: HttpClient
    ) {

        this.allEarthquakeData$ = this.allEqDataSubject.asObservable()
    }

    allEarthquakeData(data: any) {
        this.allEqDataSubject.next(data)
    }

    add(eq: EarthquakeData) {
        return this.http.post(`${environment.apiUrl}/earthquakes`, eq);
    }

    getById(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/earthquakes/${id}`);

    }

    getAll(page: number) {
        if (page < 0) {
            return this.http.get<EarthquakeData[]>(`${environment.apiUrl}/earthquakes`);
        } else {
            return this.http.get<EarthquakeData[]>(`${environment.apiUrl}/earthquakes?page=${page}`);
        }
    }

    getTotalCount() {
        return this.http.get<EarthquakeCount>(`${environment.apiUrl}/earthquakes/count`);
    }

    getDashboardData() {
        return this.http.get<any>(`${environment.apiUrl}/dashboard`);
    }

    update(params: any) {
        return this.http.put(`${environment.apiUrl}/earthquakes`, params)
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/earthquakes/${id}`);  
    }

}