import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { EarthquakeDataService } from '../_services';

@Component({ templateUrl: 'add-edit-data.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private earthquakeService: EarthquakeDataService,
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            id: ['', Validators.required],
            date: ['', Validators.required],
            hours: [0, Validators.required],
            minutes: [0, Validators.required],
            seconds: [0, Validators.required],
            latitude: [0.0, Validators.required],
            longitude: [0.0, Validators.required],
            depth: [0.0, Validators.required],
            depth_error: [0.0],
            depth_seismic_stations: [0.0],
            magnitude: [0.0, Validators.required],
            magnitude_type: [''],
            magnitude_error: [0.0],
            magnitude_seismic_stations: [0.0],
            azimuthal_gap: [0.0],
            horizontal_distance: [0.0],
            horizontal_error: [0.0],
            root_mean_square: [0.0],
            source: ['', Validators.required],
            location_source: ['', Validators.required],
            magnitude_source: ['', Validators.required],
            status: ['', Validators.required],
            time: ['']
        });

        this.title = 'Add Earthquake Data';
        if (this.id) {
            // edit mode
            this.title = 'Edit Earthquake Data';
            this.loading = true;
            this.earthquakeService.getById(this.id).subscribe(res => {
                this.loading = false;
                var timeArr = res.time.split(":")
                res.hours = Number(timeArr[0])
                res.minutes = Number(timeArr[1])
                res.seconds = Number(timeArr[2])
                res.date = new Date(res.date)
                this.form.patchValue(res)
            })

        }
    }

    /**
     * Converts single digit to two-digit format. Used for time and date formatting.
     * @param val 
     * @returns 
     */
    private convertToTwoDigit(val: number) {
        return val.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
    }

    /**
     * Handles form submit
     */
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        var date = new Date(this.form.controls['date'].value);
        var formattedDate = (this.convertToTwoDigit(date.getMonth() + 1))  + '/' + this.convertToTwoDigit(date.getDate()) + '/' + date.getFullYear();
        this.form.controls['date'].setValue(formattedDate)

        this.form.controls['time'].setValue(
            this.convertToTwoDigit(this.form.controls['hours'].value) + ":"
            + this.convertToTwoDigit(this.form.controls['minutes'].value) + ':'
            + this.convertToTwoDigit(this.form.controls['seconds'].value))

        console.log(this.form.controls['time'])

        this.submitting = true;
        this.saveData()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigateByUrl('/earthquakes');
                },
                error: (error: any) => {
                    console.log(error)
                    this.submitting = false;
                }
            })
    }

    /**
     * Handles save data event for add or editing earthquake data
     * @returns 
     */
    private saveData() {
        // create or update user based on id param
        return this.id
            ? this.earthquakeService.update(this.form.value)
            : this.earthquakeService.add(this.form.value);
    }
}