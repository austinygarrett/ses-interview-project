import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

import { UserService } from './_services';
import { User } from './_models';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
    user?: User | null;

    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;
    isMobile = true;
    isCollapsed = false;
    active = ""

    constructor(private userService: UserService, private observer: BreakpointObserver) {
        this.userService.user.subscribe(x => this.user = x);
    }
    ngOnInit() {
        this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
            if (screenSize.matches) {
                this.isMobile = true;
            } else {
                this.isMobile = false;
            }
        });
    }

    toggleMenu() {
        if (this.isMobile) {
            this.sidenav.toggle();
            this.isCollapsed = false; // On mobile, the menu can never be collapsed
        } else {
            this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
            this.isCollapsed = !this.isCollapsed;
        }
    }
    logout() {
        this.userService.logout();
    }
}