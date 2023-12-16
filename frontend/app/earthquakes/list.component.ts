
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { EarthquakeDataService } from '../_services';
import { MatDialog } from '@angular/material/dialog';
import { EarthquakeDataDialog } from '../_components/earthquakedatadialog/earthquake-data-dialog.component'

@Component({
    templateUrl: 'list.component.html',
})
export class ListComponent implements OnInit {
    earthquakes?: any[];
    totalCount?: number;
    constructor(private eqService: EarthquakeDataService, public dialog: MatDialog) { }

    ngOnInit() {
        this.eqService.getTotalCount().pipe(first()).subscribe(result => this.totalCount = Number(result.total))
        this.eqService.getAll(1)
            .pipe(first())
            .subscribe(earthquakes => this.earthquakes = earthquakes);
    }

    /**
     * Handle event when page change button is clicked
     * @param event 
     */
    onPaginateChange(event: any) {
        this.eqService.getAll(event.pageIndex + 1)
            .pipe(first())
            .subscribe(earthquakes => this.earthquakes = earthquakes);
    }


    /**
     * Handle event when row is clicked on to display modal with data
     * @param id 
     */
    viewData(id: string) {
        const eq = this.earthquakes!.find(x => x.id === id);
        this.dialog.open(EarthquakeDataDialog, {
            data: eq,
        });
    }

    /**
     * Handle event when delete button is clicked
     * @param id 
     */
    deleteData(id: string) {
        const eq = this.earthquakes!.find(x => x.id === id);
        eq.isDeleting = true;
        this.eqService.delete(id).pipe(first())
            .subscribe(() => {
                this.earthquakes = this.earthquakes!.filter(x => x.id !== id)
                if (this.totalCount) {
                    this.totalCount = this.totalCount - 1;
                }
            });
    }
}