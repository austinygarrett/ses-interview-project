import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EarthquakeData, User } from '../_models';
import { UserService, EarthquakeDataService } from '../_services';

@Component({ templateUrl: 'dashboard.component.html' })
export class DashboardComponent {
    user: User | null;
    dashboardData: any | null = {total: 0, magMax: 0, depthMax: 0, depthAvg: 0};

    constructor(private userService: UserService, private earthquakeService: EarthquakeDataService, private http: HttpClient
    ) {
        this.user = this.userService.userValue;
        this.earthquakeService.getDashboardData().subscribe(res => {
            this.dashboardData = res
            this.dashboardData.depthAvg = this.dashboardData.depthAvg.toFixed(3)
        });
    }


}