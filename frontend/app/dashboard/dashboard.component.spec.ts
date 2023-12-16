import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { EarthquakeDataService } from '../_services';
import { MatCardModule } from '@angular/material/card';
import { AppModule } from '../app.module';

describe('Dashboard', () => {
    let httpTestingController: HttpTestingController;
    let service: EarthquakeDataService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DashboardComponent,
            ],
            imports: [HttpClientTestingModule, MatCardModule, AppModule],
            providers: [EarthquakeDataService]
        }).compileComponents();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(EarthquakeDataService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('Test dashboard header stats function', () => {
        const listComponent = TestBed.createComponent(DashboardComponent);
        const app = listComponent.componentInstance;

        var httpRequest = httpTestingController.expectOne("http://localhost:5000/dashboard");
        httpRequest.flush({total: 123, magMax: 5.5, depthMax:333 , depthAvg: 70});

        expect(app.dashboardData).toEqual({total: 123, magMax: 5.5, depthMax: 333 , depthAvg: '70.000'})
    });

});