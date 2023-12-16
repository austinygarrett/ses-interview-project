import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { EarthquakeDataService, UserService } from './_services';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [HttpClientTestingModule],
            providers: [UserService, EarthquakeDataService]
        }).compileComponents();
    });

    it('App should be created', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('Should have login function', () => {
        const service: UserService = TestBed.get(UserService);
        expect(service.login).toBeTruthy();
    });

    it('Should have logout function', () => {
        const service: UserService = TestBed.get(UserService);
        expect(service.logout).toBeTruthy();
    });

    it('Should have register function', () => {
        const service: UserService = TestBed.get(UserService);
        expect(service.register).toBeTruthy();
    });
    
});