import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from '../app.component';
import { EarthquakeDataService } from '../_services';
import { EarthquakeRoutingModule } from './earthquakes-routing.module';
import { ListComponent } from './list.component'
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

describe('Earthquake', () => {
    let httpTestingController: HttpTestingController;
    let service: EarthquakeDataService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                ListComponent
            ],
            imports: [HttpClientTestingModule,
                EarthquakeRoutingModule,
                MatDialogModule,
                ReactiveFormsModule,
                EarthquakeRoutingModule,
                MatPaginatorModule,
                MatFormFieldModule,
                MatInputModule,
                MatDatepickerModule,
                MatNativeDateModule,
                MatButtonModule,
                RouterTestingModule],
            providers: [EarthquakeDataService]
        }).compileComponents();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(EarthquakeDataService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it(`should have as title 'SimpleApp'`, () => {
        const listComponent = TestBed.createComponent(ListComponent);
        listComponent.detectChanges()
        const app = listComponent.componentInstance;
        const compiled = listComponent.nativeElement as HTMLElement;
        expect(compiled.querySelector('#id-header')?.textContent).toContain("ID");
        var httpRequest = httpTestingController.expectOne('http://localhost:5000/earthquakes?page=1');
        expect(httpRequest.request.method).toBe('GET');
        var earthquakes = []
        earthquakes.push({id: "id123", "latitude": 12.123, "longitude": 30.68})
        httpRequest.flush(earthquakes);

        httpRequest = httpTestingController.expectOne("http://localhost:5000/earthquakes/count");
        expect(httpRequest.request.method).toBe('GET');
        httpRequest.flush({total: 123});

        expect(app.totalCount).toBe(123)

    });

    it('Should have add function', () => {
        expect(service.add).toBeTruthy();
    });

    it('Should have get all function', () => {
        expect(service.getAll).toBeTruthy();
    });

    it('Should have get by id function', () => {
        expect(service.getById).toBeTruthy();
    });

    it('Should have dashboard data function', () => {
        expect(service.getDashboardData).toBeTruthy();
    });

    it('Should have update function', () => {
        expect(service.update).toBeTruthy();
    });

    it('Should have delete function', () => {
        expect(service.delete).toBeTruthy();
    });

});