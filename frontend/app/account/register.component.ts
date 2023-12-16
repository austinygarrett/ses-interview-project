import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    registrationError = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
    ) {
        // redirect to home if already logged in
        if (this.userService.userValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }


    onSubmit() {
        this.submitted = true;

        //invalid form
        if (this.form.invalid) {
            this.registrationError = true;
            return;
        }

        this.loading = true;
        this.userService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['/login'], { queryParams: { registered: true }});
                },
                error: error => {
                    // error on submit
                    console.log(error)
                    this.registrationError = true;
                    this.loading = false;
                }
            });
    }
}